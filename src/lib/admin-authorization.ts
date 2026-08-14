import { cookies } from 'next/headers';
import { verifyAdminSessionToken } from '@/lib/admin-session';
import { prisma } from '@/lib/db';

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
