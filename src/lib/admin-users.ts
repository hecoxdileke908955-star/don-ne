import 'server-only';

import { Prisma, UserRole } from '@prisma/client';
import { prisma } from '@/lib/db';

export const ADMIN_USER_LOCK_KEY = 719061002;

export const adminUserSelect = {
  id: true,
  email: true,
  fullName: true,
  role: true,
  isActive: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

export type AdminUserUpdateIntent = {
  role?: UserRole;
  isActive?: boolean;
};

export type AdminUserGuardResult =
  | { ok: true }
  | { ok: false; reason: 'self-demotion' | 'self-deactivation' | 'last-super-admin' };

/**
 * Rejects updates that would demote/deactivate the acting SUPER_ADMIN's own
 * account, or that would leave zero active SUPER_ADMIN accounts in the
 * system. Concurrency safety comes from the caller running this inside a
 * transaction guarded by an advisory lock (see withAdminUserLock).
 */
export function guardAdminUserUpdate(
  actorUserId: string,
  target: { id: string; role: UserRole; isActive: boolean },
  intent: AdminUserUpdateIntent,
  otherActiveSuperAdminCount: number
): AdminUserGuardResult {
  const isSelf = target.id === actorUserId;
  const nextRole = intent.role ?? target.role;
  const nextIsActive = intent.isActive ?? target.isActive;

  if (isSelf && intent.role !== undefined && nextRole !== 'SUPER_ADMIN') {
    return { ok: false, reason: 'self-demotion' };
  }
  if (isSelf && intent.isActive === false) {
    return { ok: false, reason: 'self-deactivation' };
  }

  const targetIsCurrentlyActiveSuperAdmin = target.role === 'SUPER_ADMIN' && target.isActive;
  const targetRemainsActiveSuperAdmin = nextRole === 'SUPER_ADMIN' && nextIsActive;

  if (
    targetIsCurrentlyActiveSuperAdmin
    && !targetRemainsActiveSuperAdmin
    && otherActiveSuperAdminCount === 0
  ) {
    return { ok: false, reason: 'last-super-admin' };
  }

  return { ok: true };
}

/**
 * Serializes concurrent admin-user mutations with a PostgreSQL advisory lock
 * so two simultaneous requests can't both observe "another active
 * SUPER_ADMIN exists" and jointly strip the last one.
 */
export async function withAdminUserLock<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(async (tx) => {
    await tx.$executeRawUnsafe(`SELECT pg_advisory_xact_lock(${ADMIN_USER_LOCK_KEY})`);
    return fn(tx);
  });
}

export function normalizeAdminEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}
