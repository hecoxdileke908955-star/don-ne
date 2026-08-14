import 'server-only';
import { createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { prisma } from '@/lib/db';

type RateLimitPolicyName = 'auth' | 'quote' | 'track';

type RateLimitPolicy = {
  limit: number;
  windowSeconds: number;
  environmentLimit: string;
};

type RateLimitResult =
  | { status: 'allowed' }
  | { status: 'limited'; retryAfterSeconds: number }
  | { status: 'unavailable' };

const POLICIES: Record<RateLimitPolicyName, RateLimitPolicy> = {
  // Strict brute-force protection while still allowing a person to retry.
  auth: { limit: 5, windowSeconds: 15 * 60, environmentLimit: 'RATE_LIMIT_AUTH_MAX' },
  // A legitimate customer may submit a small number of corrections in ten minutes.
  quote: { limit: 5, windowSeconds: 10 * 60, environmentLimit: 'RATE_LIMIT_QUOTE_MAX' },
  // Click telemetry is expected to be more frequent than form submissions.
  track: { limit: 60, windowSeconds: 60, environmentLimit: 'RATE_LIMIT_TRACK_MAX' },
};

function configuredLimit(policy: RateLimitPolicy): number {
  const configured = Number(process.env[policy.environmentLimit]);

  return Number.isInteger(configured) && configured > 0 && configured <= 10_000
    ? configured
    : policy.limit;
}

function firstValidIp(header: string | null): string | null {
  const candidate = header?.split(',')[0]?.trim();
  return candidate && isIP(candidate) ? candidate : null;
}

function clientIdentity(request: Request): string {
  // Vercel overwrites this header with the connecting client's address. If a
  // proxy sits in front of Vercel, Vercel documents x-vercel-forwarded-for as
  // the safer source than a user-supplied x-forwarded-for chain.
  if (process.env.VERCEL === '1') {
    return firstValidIp(request.headers.get('x-vercel-forwarded-for')) ?? 'unattributed';
  }

  // Self-hosted deployments must opt in only after their reverse proxy strips
  // inbound forwarding headers and sets this value itself.
  if (process.env.RATE_LIMIT_TRUST_PROXY === '1') {
    return firstValidIp(request.headers.get('x-forwarded-for')) ?? 'unattributed';
  }

  // Do not trust arbitrary forwarding headers on direct/local deployments.
  return 'unattributed';
}

function bucketKey(request: Request, policy: RateLimitPolicyName): string {
  const identityHash = createHash('sha256').update(clientIdentity(request)).digest('hex');
  return `${policy}:${identityHash}`;
}

export async function enforceRateLimit(
  request: Request,
  policyName: RateLimitPolicyName
): Promise<RateLimitResult> {
  const policy = POLICIES[policyName];
  const limit = configuredLimit(policy);
  const expiresAt = new Date(Date.now() + policy.windowSeconds * 1_000);

  try {
    // Keep retention bounded without adding a worker or another service. The
    // batched, infrequent cleanup avoids scanning the whole table per request.
    if (Math.random() < 0.01) {
      await prisma.$executeRaw`
        DELETE FROM "RateLimitBucket"
        WHERE "key" IN (
          SELECT "key"
          FROM "RateLimitBucket"
          WHERE "expiresAt" <= CURRENT_TIMESTAMP
          LIMIT 500
        )
      `;
    }

    const rows = await prisma.$queryRaw<{ count: number; expiresAt: Date }[]>`
      INSERT INTO "RateLimitBucket" ("key", "count", "expiresAt", "updatedAt")
      VALUES (${bucketKey(request, policyName)}, 1, ${expiresAt}, CURRENT_TIMESTAMP)
      ON CONFLICT ("key") DO UPDATE
      SET
        "count" = CASE
          WHEN "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP THEN 1
          ELSE "RateLimitBucket"."count" + 1
        END,
        "expiresAt" = CASE
          WHEN "RateLimitBucket"."expiresAt" <= CURRENT_TIMESTAMP THEN EXCLUDED."expiresAt"
          ELSE "RateLimitBucket"."expiresAt"
        END,
        "updatedAt" = CURRENT_TIMESTAMP
      RETURNING "count", "expiresAt"
    `;

    const bucket = rows[0];
    if (!bucket) return { status: 'unavailable' };

    if (bucket.count > limit) {
      return {
        status: 'limited',
        retryAfterSeconds: Math.max(
          1,
          Math.ceil((bucket.expiresAt.getTime() - Date.now()) / 1_000)
        ),
      };
    }

    return { status: 'allowed' };
  } catch {
    // Fail closed: public writes and administrator authentication should not
    // silently lose their shared protection when the limiter store is down.
    return { status: 'unavailable' };
  }
}
