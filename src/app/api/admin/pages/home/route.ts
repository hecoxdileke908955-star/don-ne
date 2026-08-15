import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';
import { getDraftHomePage } from '@/lib/page-data';
import { prisma } from '@/lib/db';

const pageMetaSchema = z
  .object({
    seoTitle: z.string().trim().max(160).nullable().optional(),
    seoDescription: z.string().trim().max(320).nullable().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'No fields to update');

export async function GET() {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const page = await getDraftHomePage();
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    return NextResponse.json({ page });
  } catch {
    return NextResponse.json({ error: 'Page CMS temporarily unavailable' }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const parsed = pageMetaSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid page data' }, { status: 400 });

  try {
    const existing = await getDraftHomePage();
    if (!existing) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const updated = await prisma.page.update({
      where: { id: existing.id },
      data: {
        ...(parsed.data.seoTitle !== undefined ? { seoTitle: parsed.data.seoTitle } : {}),
        ...(parsed.data.seoDescription !== undefined ? { seoDescription: parsed.data.seoDescription } : {}),
      },
      select: { id: true, slug: true, title: true, status: true, seoTitle: true, seoDescription: true },
    });
    return NextResponse.json({ page: updated });
  } catch {
    return NextResponse.json({ error: 'Page CMS temporarily unavailable' }, { status: 503 });
  }
}
