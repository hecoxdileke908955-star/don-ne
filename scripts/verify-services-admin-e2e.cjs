const { execFileSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const databaseContainer = process.env.E2E_DATABASE_CONTAINER;

async function main() {
  if (!base || !password || !databaseContainer) throw new Error('E2E_BASE_URL, ADMIN_BOOTSTRAP_PASSWORD, and E2E_DATABASE_CONTAINER are required');
  const login = await fetch(`${base}/api/admin/auth`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  if (!login.ok || !cookie) throw new Error('Admin login failed');
  const headers = { cookie, 'content-type': 'application/json' };
  const unauthenticatedGet = await fetch(`${base}/api/admin/services`);
  const unauthenticatedPost = await fetch(`${base}/api/admin/services`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}' });
  const read = await fetch(`${base}/api/admin/services`, { headers });
  const listing = await read.json();
  const service = listing.services?.find((candidate) => candidate._count.priceItems > 0);
  if (!read.ok || !service) throw new Error('Seeded service with PriceItems unavailable');
  const payload = { categoryId: service.categoryId, slug: service.slug, title: `${service.title} E2E`, shortDescription: service.shortDescription, badge: service.badge, status: service.status, sortOrder: service.sortOrder };
  const patch = await fetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify(payload) });
  const invalid = await fetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify({ ...payload, title: '' }) });
  const malformed = await fetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify({ ...payload, sortOrder: 'bad' }) });
  const missing = await fetch(`${base}/api/admin/services/missing-service`, { method: 'PATCH', headers, body: JSON.stringify(payload) });
  const duplicate = await fetch(`${base}/api/admin/services`, { method: 'POST', headers, body: JSON.stringify(payload) });
  const createPayload = { ...payload, slug: `e2e-service-${Date.now()}`, title: 'E2E disposable service', status: 'DRAFT' };
  const created = await fetch(`${base}/api/admin/services`, { method: 'POST', headers, body: JSON.stringify(createPayload) });
  const prisma = new PrismaClient();
  const persisted = await prisma.service.findUnique({ where: { id: service.id }, include: { priceItems: true } });
  const createdRow = created.ok ? await prisma.service.findUnique({ where: { slug: createPayload.slug } }) : null;
  const quote = await fetch(`${base}/api/quote`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerName: 'E2E Service', phone: '0900000000', serviceSlug: service.slug }) });
  const quoteResult = await quote.json();
  const lead = quote.ok ? await prisma.lead.findUnique({ where: { leadCode: quoteResult.leadCode } }) : null;
  const reload = await fetch(`${base}/api/admin/services`, { headers });
  const reloadService = (await reload.json()).services?.find((candidate) => candidate.id === service.id);
  await prisma.$disconnect();
  if (!patch.ok || !persisted || persisted.title !== payload.title || persisted.priceItems.length !== service._count.priceItems || !lead?.serviceId || !createdRow || !reloadService || reloadService.title !== payload.title) throw new Error('Persistence or relations failed');
  execFileSync('docker', ['stop', databaseContainer], { stdio: 'pipe' });
  const dbDownPatch = await fetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify(payload) });
  const dbDownGet = await fetch(`${base}/api/admin/services`, { headers });
  if (dbDownPatch.status !== 503 || dbDownGet.status !== 503) throw new Error('DB-down services responses were not 503');
  console.log(JSON.stringify({ login: login.status, unauthenticatedGet: unauthenticatedGet.status, unauthenticatedPost: unauthenticatedPost.status, id: service.id, slug: service.slug, original: service.title, changed: payload.title, patch: patch.status, db: persisted.title, reload: reloadService.title, priceItems: persisted.priceItems.length, quote: quote.status, leadServiceId: lead.serviceId, create: created.status, duplicate: duplicate.status, invalid: invalid.status, malformed: malformed.status, missing: missing.status, dbDownPatch: dbDownPatch.status, dbDownGet: dbDownGet.status }));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
