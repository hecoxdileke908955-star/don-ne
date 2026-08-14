import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';

export async function GET() {
  const authorization = await requireAdminRole('ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const items = await prisma.priceItem.findMany({ orderBy: [{ service: { title: 'asc' } }, { sortOrder: 'asc' }], include: { service: { select: { title: true, slug: true } } } });
    return NextResponse.json({ items });
  } catch { return NextResponse.json({ error: 'Unable to load pricing' }, { status: 503 }); }
}
