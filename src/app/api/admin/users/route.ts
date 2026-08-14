import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';
import { hashAdminPassword, isValidAdminPassword } from '@/lib/admin-password';
import { adminUserSelect, normalizeAdminEmail } from '@/lib/admin-users';

const createUserSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().min(3).max(200).email(),
  password: z.string().refine(isValidAdminPassword, 'Invalid password'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'EDITOR']),
});

export async function GET() {
  const authorization = await requireAdminRole('SUPER_ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const users = await prisma.user.findMany({ select: adminUserSelect, orderBy: [{ createdAt: 'asc' }] });
    return NextResponse.json({ users });
  } catch { return NextResponse.json({ error: 'Users temporarily unavailable' }, { status: 503 }); }
}

export async function POST(request: Request) {
  const authorization = await requireAdminRole('SUPER_ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const email = normalizeAdminEmail(body?.email);
  const parsed = createUserSchema.safeParse({ ...body, email });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid user data' }, { status: 400 });

  try {
    const passwordHash = await hashAdminPassword(parsed.data.password);
    const user = await prisma.$transaction(async (tx) => {
      const created = await tx.user.create({
        data: {
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          passwordHash,
          role: parsed.data.role,
          isActive: true,
        },
        select: adminUserSelect,
      });
      await tx.auditLog.create({
        data: {
          userId: authorization.user.userId,
          userEmail: authorization.user.email,
          action: 'USER_CREATED',
          entityType: 'User',
          entityId: created.id,
          payload: { role: created.role },
        },
      });
      return created;
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Users temporarily unavailable' }, { status: 503 });
  }
}
