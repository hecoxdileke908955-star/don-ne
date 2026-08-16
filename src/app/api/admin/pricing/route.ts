import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';

const createSchema = z
  .object({
    serviceId: z.string().uuid(),
    itemName: z.string().trim().min(1).max(200),
    unit: z.string().trim().min(1).max(50),
    minPrice: z.number().finite().nonnegative(),
    maxPrice: z.number().finite().nonnegative().nullable(),
    conditionText: z.string().trim().max(1000).nullable().optional(),
    note: z.string().trim().max(1000).nullable().optional(),
    sortOrder: z.number().int().min(0),
    status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']),
  })
  .refine((x) => x.maxPrice === null || x.minPrice <= x.maxPrice, { message: 'Invalid price range' });

export async function GET() {
  const authorization = await requireAdminRole('ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const items = await prisma.priceItem.findMany({ orderBy: [{ service: { title: 'asc' } }, { sortOrder: 'asc' }], include: { service: { select: { title: true, slug: true } } } });
    return NextResponse.json({ items });
  } catch { return NextResponse.json({ error: 'Unable to load pricing' }, { status: 503 }); }
}

export async function POST(request: Request) {
  const authorization = await requireAdminRole('ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = createSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid pricing data' }, { status: 400 });
  try {
    const priceItem = await prisma.priceItem.create({
      data: parsed.data,
      include: { service: { select: { title: true, slug: true } } },
    });
    return NextResponse.json({ priceItem }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') return NextResponse.json({ error: 'Service not found' }, { status: 400 });
    return NextResponse.json({ error: 'Pricing temporarily unavailable' }, { status: 503 });
  }
}
