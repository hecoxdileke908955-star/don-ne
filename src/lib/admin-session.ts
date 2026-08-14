export const ADMIN_SESSION_COOKIE = 'don_ne_admin_session';

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR';

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string;
  role: AdminRole;
  exp: number;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function toBase64Url(bytes: Uint8Array): string {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(
  value: string
): Uint8Array<ArrayBuffer> {
  const normalized = value
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const padding =
    '='.repeat((4 - (normalized.length % 4)) % 4);

  const binary = atob(normalized + padding);

  const bytes = new Uint8Array(
    new ArrayBuffer(binary.length)
  );

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function getSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.length < 32 || secret.includes('CHANGE_ME')) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters'
    );
  }

  return secret;
}

async function getKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(getSecret()),
    {
      name: 'HMAC',
      hash: 'SHA-256',
    },
    false,
    ['sign', 'verify']
  );
}

export async function createAdminSessionToken(
  session: Omit<AdminSession, 'exp'>,
  ttlSeconds = 60 * 60 * 8
): Promise<string> {
  const payload: AdminSession = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + ttlSeconds,
  };

  const payloadPart = toBase64Url(
    encoder.encode(JSON.stringify(payload))
  );

  const signature = new Uint8Array(
    await crypto.subtle.sign(
      'HMAC',
      await getKey(),
      encoder.encode(payloadPart)
    )
  );

  return `${payloadPart}.${toBase64Url(signature)}`;
}

export async function verifyAdminSessionToken(
  token?: string | null
): Promise<AdminSession | null> {
  try {
    if (!token) return null;

    const parts = token.split('.');

    if (parts.length !== 2) return null;

    const [payloadPart, signaturePart] = parts;

    const valid = await crypto.subtle.verify(
      'HMAC',
      await getKey(),
      fromBase64Url(signaturePart),
      encoder.encode(payloadPart)
    );

    if (!valid) return null;

    const payload = JSON.parse(
      decoder.decode(fromBase64Url(payloadPart))
    ) as AdminSession;

    if (
      !payload.userId ||
      !payload.email ||
      !payload.fullName ||
      !['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(
        payload.role
      )
    ) {
      return null;
    }

    if (
      !payload.exp ||
      payload.exp <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function hasRequiredRole(
  actual: AdminRole,
  required: AdminRole
): boolean {
  const hierarchy: Record<AdminRole, number> = {
    SUPER_ADMIN: 3,
    ADMIN: 2,
    EDITOR: 1,
  };

  return hierarchy[actual] >= hierarchy[required];
}