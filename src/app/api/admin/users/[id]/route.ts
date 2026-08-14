import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';
import { adminUserSelect, guardAdminUserUpdate, withAdminUserLock } from '@/lib/admin-users';

const updateUserSchema = z
  .object({
    fullName: z.string().trim().min(2).max(120).optional(),
    role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']).optional(),
    isActive: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'No fields to update');

class AdminUserRouteError extends Error {
  constructor(public code: 'not-found' | 'self-demotion' | 'self-deactivation' | 'last-super-admin') {
    super(code);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdminRole('SUPER_ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const parsed = updateUserSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });
  const intent = parsed.data;

  try {
    const user = await withAdminUserLock(async (tx) => {
      const target = await tx.user.findUnique({ where: { id }, select: adminUserSelect });
      if (!target) throw new AdminUserRouteError('not-found');

      const otherActiveSuperAdminCount = await tx.user.count({
        where: { role: 'SUPER_ADMIN', isActive: true, NOT: { id } },
      });

      const guard = guardAdminUserUpdate(authorization.user.userId, target, intent, otherActiveSuperAdminCount);
      if (!guard.ok) throw new AdminUserRouteError(guard.reason);

      const updated = await tx.user.update({
        where: { id },
        data: {
          ...(intent.fullName !== undefined ? { fullName: intent.fullName } : {}),
          ...(intent.role !== undefined ? { role: intent.role } : {}),
          ...(intent.isActive !== undefined ? { isActive: intent.isActive } : {}),
        },
        select: adminUserSelect,
      });

      const auditEntries = [];
      if (intent.role !== undefined && intent.role !== target.role) {
        auditEntries.push({ action: 'USER_ROLE_CHANGED', payload: { before: target.role, after: intent.role } });
      }
      if (intent.isActive !== undefined && intent.isActive !== target.isActive) {
        auditEntries.push({ action: intent.isActive ? 'USER_ACTIVATED' : 'USER_DEACTIVATED', payload: { before: target.isActive, after: intent.isActive } });
      }
      for (const entry of auditEntries) {
        await tx.auditLog.create({
          data: {
            userId: authorization.user.userId,
            userEmail: authorization.user.email,
            action: entry.action,
            entityType: 'User',
            entityId: id,
            payload: entry.payload,
          },
        });
      }

      return updated;
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof AdminUserRouteError) {
      if (error.code === 'not-found') return NextResponse.json({ error: 'User not found' }, { status: 404 });
      if (error.code === 'self-demotion') return NextResponse.json({ error: 'You cannot change your own role' }, { status: 409 });
      if (error.code === 'self-deactivation') return NextResponse.json({ error: 'You cannot deactivate your own account' }, { status: 409 });
      return NextResponse.json({ error: 'The last active SUPER_ADMIN cannot be removed' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Users temporarily unavailable' }, { status: 503 });
  }
}
