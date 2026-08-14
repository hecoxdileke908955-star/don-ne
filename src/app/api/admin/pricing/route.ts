import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-authorization';

export async function GET() {
  if (!await requireAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const items = await prisma.priceItem.findMany({ orderBy: [{ service: { title: 'asc' } }, { sortOrder: 'asc' }], include: { service: { select: { title: true, slug: true } } } });
    return NextResponse.json({ items });
  } catch { return NextResponse.json({ error: 'Unable to load pricing' }, { status: 503 }); }
}
