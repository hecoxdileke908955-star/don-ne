import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';

export async function GET() {
  const authorization = await requireAdminRole('ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
      include: { service: { select: { title: true } } },
    });
    return NextResponse.json({ leads });
  } catch {
    return NextResponse.json({ error: 'Unable to load leads' }, { status: 503 });
  }
}
