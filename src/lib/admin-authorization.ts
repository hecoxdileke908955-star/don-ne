import { cookies } from 'next/headers';
import { UserRole } from '@prisma/client';
import { verifyAdminSessionToken } from '@/lib/admin-session';
import { prisma } from '@/lib/db';
import { verifyPermission } from '@/lib/auth';

export type AdminAuthorization =
  | { status: 'unauthenticated' }
  | { status: 'forbidden' }
  | {
    status: 'authorized';
    user: {
      userId: string;
      email: string;
      fullName: string;
      role: UserRole;
    };
  };

export async function requireAdminSession() {
  const token = (await cookies()).get('don_ne_admin_session')?.value;
  const session = await verifyAdminSessionToken(token);

  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        isActive: true,
      },
    });

    if (!user?.isActive) return null;

    return {
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    };
  } catch {
    return null;
  }
}

export async function requireAdminRole(
  requiredRole: UserRole
): Promise<AdminAuthorization> {
  const user = await requireAdminSession();

  if (!user) return { status: 'unauthenticated' };
  if (!verifyPermission(user.role, requiredRole)) return { status: 'forbidden' };

  return { status: 'authorized', user };
}
