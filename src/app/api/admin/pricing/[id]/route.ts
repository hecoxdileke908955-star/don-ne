import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';
const schema = z.object({ itemName: z.string().trim().min(1).max(200), unit: z.string().trim().min(1).max(50), minPrice: z.number().finite().nonnegative(), maxPrice: z.number().finite().nonnegative().nullable(), conditionText: z.string().trim().max(1000).nullable().optional(), note: z.string().trim().max(1000).nullable().optional(), sortOrder: z.number().int().min(0), status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']) }).refine(x => x.maxPrice === null || x.minPrice <= x.maxPrice, { message: 'Invalid price range' });
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const data = schema.safeParse(await request.json().catch(() => null));
  if (!data.success) return NextResponse.json({ error: 'Invalid pricing data' }, { status: 400 });
  try { const item = await prisma.priceItem.update({ where: { id: (await params).id }, data: data.data }); return NextResponse.json({ item }); }
  catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') return NextResponse.json({ error: 'Price item not found' }, { status: 404 });
    return NextResponse.json({ error: 'Pricing service unavailable' }, { status: 503 });
  }
}
