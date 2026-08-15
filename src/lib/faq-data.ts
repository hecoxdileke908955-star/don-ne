import 'server-only';

import { prisma } from '@/lib/db';

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
}

/**
 * Public read: only active, global FAQs, deterministically ordered. Any
 * failure (including the database being unreachable) collapses to an empty
 * list — the same "no fake fallback" convention as getPublicSiteConfig and
 * getPublishedHomePage. There is no hard-coded FAQ list to fall back to.
 */
export async function getPublicFaqs(): Promise<PublicFaq[]> {
  try {
    const rows = await prisma.fAQ.findMany({
      where: { isGlobal: true, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
      select: { id: true, question: true, answer: true },
    });
    return rows;
  } catch {
    return [];
  }
}
