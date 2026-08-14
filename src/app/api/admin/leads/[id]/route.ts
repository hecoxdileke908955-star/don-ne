import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';

const bodySchema = z.object({ status: z.enum(['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST']) });

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid lead status' }, { status: 400 });
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
