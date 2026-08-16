import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { Prisma } from '@prisma/client';
import { requireAdminRole } from '@/lib/admin-authorization';
import { requireSameOriginMutation } from '@/lib/admin-csrf';
import { prisma } from '@/lib/db';
import { buildPublishSnapshot, getDraftHomePage } from '@/lib/page-data';

export async function POST(request: Request) {
  const authorization = await requireAdminRole('EDITOR');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  if (!requireSameOriginMutation(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  try {
    const draft = await getDraftHomePage();
    if (!draft) return NextResponse.json({ error: 'Page not found' }, { status: 404 });

    const snapshot = buildPublishSnapshot(draft, draft.sections);

    await prisma.$transaction(async (tx) => {
      const latest = await tx.pageVersion.findFirst({
        where: { pageId: draft.id },
        orderBy: { versionNumber: 'desc' },
        select: { versionNumber: true },
      });

      await tx.pageVersion.create({
        data: {
          pageId: draft.id,
          versionNumber: (latest?.versionNumber ?? 0) + 1,
          sectionsJson: snapshot as unknown as Prisma.InputJsonValue,
          isPublished: true,
          publishedById: authorization.user.userId,
        },
      });

      await tx.page.update({
        where: { id: draft.id },
        data: { status: 'PUBLISHED' },
      });
    });

    // Full Route Cache invalidation: `/` has no dynamic API usage
    // (no cookies/headers/searchParams) and reads via Prisma rather than
    // `fetch`, so Next statically caches its rendered output (including
    // generateMetadata) until explicitly revalidated. Only run this after
    // the transaction above has committed — a failed publish must not
    // invalidate the still-correct cached homepage.
    revalidatePath('/');

    return NextResponse.json({ published: true });
  } catch {
    return NextResponse.json({ error: 'Page CMS temporarily unavailable' }, { status: 503 });
  }
}
