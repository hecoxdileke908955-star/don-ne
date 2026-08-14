import 'server-only';
import { prisma } from '@/lib/db';

export async function getPublicPriceItems() {
  return prisma.priceItem.findMany({
    where: { status: 'PUBLISHED', service: { status: 'PUBLISHED' } },
    include: { service: { select: { id: true, title: true, slug: true, category: { select: { name: true } } } } },
    orderBy: [{ service: { title: 'asc' } }, { sortOrder: 'asc' }],
  });
}
