import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';

const faqUpdateSchema = z
  .object({
    question: z.string().trim().min(1).max(300).optional(),
    answer: z.string().trim().min(1).max(2000).optional(),
    sortOrder: z.number().int().min(0).max(999).optional(),
    isActive: z.boolean().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, 'No fields to update');

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const parsed = faqUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid FAQ data' }, { status: 400 });

  try {
    const faq = await prisma.fAQ.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json({ faq });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'FAQ not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'FAQ temporarily unavailable' }, { status: 503 });
  }
}
