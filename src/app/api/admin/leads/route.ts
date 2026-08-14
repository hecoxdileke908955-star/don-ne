import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdminSession } from '@/lib/admin-authorization';

export async function GET() {
  if (!await requireAdminSession()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
