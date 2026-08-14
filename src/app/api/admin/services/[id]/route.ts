import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';

const serviceSchema = z.object({
  categoryId: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).min(1).max(120),
  title: z.string().trim().min(1).max(200),
  shortDescription: z.string().trim().max(1000).nullable(),
  badge: z.string().trim().max(120).nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  sortOrder: z.number().int().min(0),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = serviceSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid service data' }, { status: 400 });
  try {
    const service = await prisma.service.update({ where: { id: (await params).id }, data: parsed.data });
    return NextResponse.json({ service });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') return NextResponse.json({ error: 'Service slug already exists' }, { status: 409 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') return NextResponse.json({ error: 'Service category not found' }, { status: 400 });
    return NextResponse.json({ error: 'Services temporarily unavailable' }, { status: 503 });
  }
}
