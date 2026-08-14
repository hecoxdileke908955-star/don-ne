const { PrismaClient } = require('@prisma/client');
const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;

async function main() {
  console.error('step: login');
  const login = await fetch(`${base}/api/admin/auth`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  if (!login.ok || !cookie) throw Error('login failed');
  const headers = { cookie, 'content-type': 'application/json' };
  const publicBefore = await fetch(`${base}/api/services`);
  const service = (await publicBefore.json()).services[0];
  const adminRead = await fetch(`${base}/api/admin/services`, { headers });
  const original = (await adminRead.json()).services.find((item) => item.id === service.id);
  const changed = `${original.shortDescription || ''} server-e2e`;
  const published = { categoryId: original.categoryId, slug: original.slug, title: original.title, shortDescription: changed, badge: original.badge, status: 'PUBLISHED', sortOrder: original.sortOrder };
  console.error('step: update');
  const patch = await fetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify(published) });
  const prisma = new PrismaClient();
  const db = await prisma.service.findUnique({ where: { id: service.id }, include: { priceItems: true } });
  const publicList = await fetch(`${base}/api/services`);
  const publicDetail = await fetch(`${base}/api/services/${service.slug}`);
  const quotePublished = await fetch(`${base}/api/quote`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerName: 'Server E2E', phone: '0900000000', serviceSlug: service.slug }) });
  const publishedQuoteBody = await quotePublished.json();
  const lead = await prisma.lead.findUnique({ where: { leadCode: publishedQuoteBody.leadCode } });
  console.error('step: unpublish');
  const draft = await fetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify({ ...published, status: 'DRAFT' }) });
  const hiddenList = await fetch(`${base}/api/services`);
  const hiddenServices = (await hiddenList.json()).services;
  const hiddenDetail = await fetch(`${base}/api/services/${service.slug}`);
  const quoteDraft = await fetch(`${base}/api/quote`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerName: 'Draft E2E', phone: '0900000000', serviceSlug: service.slug }) });
  const draftDb = await prisma.service.findUnique({ where: { id: service.id }, include: { priceItems: true, leads: true } });
  await fetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify(published) });
  await prisma.$disconnect();
  const valid = patch.ok && db.shortDescription === changed && publicList.ok && publicDetail.ok && quotePublished.ok && lead?.serviceId && draft.ok && !hiddenServices.some((item) => item.id === service.id) && hiddenDetail.status === 404 && quoteDraft.status === 400 && draftDb.priceItems.length === db.priceItems.length && draftDb.leads.some((item) => item.id === lead.id);
  if (!valid) throw Error('server assertion failed');
  console.log(JSON.stringify({ login: login.status, id: service.id, slug: service.slug, changed, patch: patch.status, db: db.shortDescription, publicList: publicList.status, publicDetail: publicDetail.status, quotePublished: quotePublished.status, draft: draft.status, hiddenList: !hiddenServices.some((item) => item.id === service.id), hiddenDetail: hiddenDetail.status, quoteDraft: quoteDraft.status, priceItems: db.priceItems.length, leadServiceId: lead.serviceId }));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
