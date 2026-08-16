import { NextResponse } from 'next/server';
import { Prisma, LeadStatus } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { requireAdminRole } from '@/lib/admin-authorization';

const LEAD_STATUSES = ['NEW', 'CONTACTED', 'QUOTED', 'WON', 'LOST'] as const;

const querySchema = z.object({
  search: z.string().trim().max(200).optional(),
  status: z.enum(LEAD_STATUSES).optional(),
  serviceId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(request: Request) {
  const authorization = await requireAdminRole('ADMIN');
  if (authorization.status === 'unauthenticated') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (authorization.status === 'forbidden') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    search: searchParams.get('search') ?? undefined,
    status: searchParams.get('status') ?? undefined,
    serviceId: searchParams.get('serviceId') ?? undefined,
    page: searchParams.get('page') ?? undefined,
    pageSize: searchParams.get('pageSize') ?? undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
  const { search, status, serviceId, page, pageSize } = parsed.data;

  const where: Prisma.LeadWhereInput = {
    ...(status ? { status: status as LeadStatus } : {}),
    ...(serviceId ? { serviceId } : {}),
    ...(search
      ? {
          OR: [
            { customerName: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { leadCode: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {}),
  };

  try {
    const [leads, total] = await Promise.all([
      prisma.lead.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { service: { select: { title: true } } },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.lead.count({ where }),
    ]);
    return NextResponse.json({ leads, total, page, pageSize, totalPages: Math.max(1, Math.ceil(total / pageSize)) });
  } catch {
    return NextResponse.json({ error: 'Unable to load leads' }, { status: 503 });
  }
}
