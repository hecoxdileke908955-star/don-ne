import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';
import { prisma } from '@/lib/db';
import { HOME_PAGE_SLUG, isImplementedSectionType } from '@/lib/page-data';
import { SectionContentSchema, SectionPropsSchema } from '@/lib/section-schema';

const sectionUpdateSchema = z
  .object({
    visible: z.boolean().optional(),
    sortOrder: z.number().int().min(0).max(999).optional(),
    props: SectionContentSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, 'No fields to update');

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { id } = await params;
  const parsed = sectionUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: 'Invalid section data' }, { status: 400 });

  try {
    const page = await prisma.page.findUnique({ where: { slug: HOME_PAGE_SLUG }, select: { id: true } });
    if (!page) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const section = await prisma.pageSection.findFirst({ where: { id, pageId: page.id } });
    if (!section) return NextResponse.json({ error: 'Section not found' }, { status: 404 });
    if (!isImplementedSectionType(section.type)) {
      return NextResponse.json({ error: 'Unsupported section type' }, { status: 400 });
    }

    const nextVisible = parsed.data.visible ?? section.visible;
    const nextSortOrder = parsed.data.sortOrder ?? section.sortOrder;
    const nextProps = parsed.data.props ?? section.props;

    const fullValidation = SectionPropsSchema.safeParse({
      id: section.id,
      type: section.type,
      variant: section.variant,
      order: nextSortOrder,
      visible: nextVisible,
      props: nextProps,
    });
    if (!fullValidation.success) return NextResponse.json({ error: 'Invalid section data' }, { status: 400 });

    const updated = await prisma.pageSection.update({
      where: { id: section.id },
      data: { visible: nextVisible, sortOrder: nextSortOrder, props: nextProps as unknown as Prisma.InputJsonValue },
    });

    return NextResponse.json({
      section: {
        id: updated.id,
        type: updated.type,
        variant: updated.variant,
        order: updated.sortOrder,
        visible: updated.visible,
        props: updated.props,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Page CMS temporarily unavailable' }, { status: 503 });
  }
}
