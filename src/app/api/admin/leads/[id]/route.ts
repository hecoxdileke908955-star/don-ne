import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';

// All fields optional — the drawer may PATCH just status, just internalNote,
// just a price, or several at once. `nullable()` (not `.optional()`) on the
// note/price fields lets the client explicitly clear a value by sending
// `null`; omitting the key entirely leaves it untouched (Prisma treats an
// `undefined` field in `data` as "don't update this column").
const bodySchema = z
  .object({
    status: z.enum(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']).optional(),
    internalNote: z.string().trim().max(2000).nullable().optional(),
    quotedPrice: z.number().finite().min(0).max(9_999_999_999.99).nullable().optional(),
    finalOrderValue: z.number().finite().min(0).max(9_999_999_999.99).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, { message: 'At least one field is required' });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdminRole('ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid lead update' }, { status: 400 });
  try {
    const lead = await prisma.lead.update({ where: { id: (await params).id }, data: parsed.data });
    return NextResponse.json({ lead });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Leads temporarily unavailable' }, { status: 503 });
  }
}
