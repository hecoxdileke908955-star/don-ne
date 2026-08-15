import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';

const faqCreateSchema = z
  .object({
    question: z.string().trim().min(1).max(300),
    answer: z.string().trim().min(1).max(2000),
    sortOrder: z.number().int().min(0).max(999).optional(),
    isActive: z.boolean().optional(),
  })
  .strict();

export async function GET() {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const faqs = await prisma.fAQ.findMany({
      where: { isGlobal: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
    return NextResponse.json({ faqs });
  } catch {
    return NextResponse.json({ error: 'FAQ temporarily unavailable' }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = faqCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid FAQ data' }, { status: 400 });

  try {
    const faq = await prisma.fAQ.create({
      data: {
        question: parsed.data.question,
        answer: parsed.data.answer,
        sortOrder: parsed.data.sortOrder ?? 0,
        isActive: parsed.data.isActive ?? true,
        isGlobal: true,
      },
    });
    return NextResponse.json({ faq }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'FAQ temporarily unavailable' }, { status: 503 });
  }
}
