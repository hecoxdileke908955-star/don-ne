import 'server-only';
import { prisma } from '@/lib/db';
export async function getPublishedServices() { return prisma.service.findMany({ where: { status: 'PUBLISHED' }, include: { category: { select: { id: true, name: true, slug: true } } }, orderBy: [{ sortOrder: 'asc' }, { title: 'asc' }] }); }
export async function getPublishedServiceBySlug(slug: string) { return prisma.service.findFirst({ where: { slug, status: 'PUBLISHED' }, include: { category: { select: { id: true, name: true, slug: true } } } }); }
