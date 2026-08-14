const { execFileSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');
const { chromium } = require('playwright');
const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const container = process.env.E2E_DATABASE_CONTAINER;

function checkedFetch(url, options) {
  return fetch(url, { ...options, signal: AbortSignal.timeout(15_000) });
}

async function main() {
  if (!base || !password || !container) throw Error('E2E_BASE_URL, ADMIN_BOOTSTRAP_PASSWORD, and E2E_DATABASE_CONTAINER are required');
  console.error('step: login');
  const login = await checkedFetch(`${base}/api/admin/auth`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
  const cookie = login.headers.get('set-cookie')?.split(';')[0];
  if (!login.ok || !cookie) throw Error('Admin login failed');
  const headers = { cookie, 'content-type': 'application/json' };
  console.error('step: published-api');
  const publicList = await checkedFetch(`${base}/api/services`);
  const service = (await publicList.json()).services[0];
  const adminList = await checkedFetch(`${base}/api/admin/services`, { headers });
  const adminService = (await adminList.json()).services.find((item) => item.id === service.id);
  const changed = `${adminService.shortDescription || ''} E2E`;
  const publishedPayload = { categoryId: adminService.categoryId, slug: adminService.slug, title: adminService.title, shortDescription: changed, badge: adminService.badge, status: 'PUBLISHED', sortOrder: adminService.sortOrder };
  console.error('step: admin-update');
  const update = await checkedFetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify(publishedPayload) });
  const prisma = new PrismaClient();
  const dbPublished = await prisma.service.findUnique({ where: { id: service.id }, include: { priceItems: true } });
  const quoteBefore = await checkedFetch(`${base}/api/quote`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerName: 'Published E2E', phone: '0900000000', serviceSlug: service.slug }) });
  const beforeLead = await prisma.lead.findUnique({ where: { leadCode: (await quoteBefore.json()).leadCode } });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.setDefaultTimeout(10_000);
  console.error('step: rendered-published');
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  await page.getByText(service.title, { exact: true }).waitFor();
  const homepageText = await page.getByText(changed, { exact: true }).textContent();
  await page.getByRole('button', { name: /Nhận Báo Giá/i }).first().click();
  const publishedOption = await page.locator('select').first().locator(`option[value="${service.slug}"]`).textContent();
  await page.goto(`${base}/dich-vu`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  await page.getByText(changed, { exact: true }).waitFor();
  const detail = await checkedFetch(`${base}/api/services/${service.slug}`);
  const draftPayload = { ...publishedPayload, status: 'DRAFT' };
  console.error('step: unpublished');
  const draft = await checkedFetch(`${base}/api/admin/services/${service.id}`, { method: 'PATCH', headers, body: JSON.stringify(draftPayload) });
  const hiddenList = await checkedFetch(`${base}/api/services`);
  const hiddenDetail = await checkedFetch(`${base}/api/services/${service.slug}`);
  const directQuote = await checkedFetch(`${base}/api/quote`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerName: 'Draft E2E', phone: '0900000000', serviceSlug: service.slug }) });
  await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  const hiddenHomepage = await page.getByText(service.title, { exact: true }).count();
  await page.getByRole('button', { name: /Nhận Báo Giá/i }).first().click();
  const hiddenOption = await page.locator('select').first().locator(`option[value="${service.slug}"]`).count();
  await page.goto(`${base}/dich-vu`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
  const hiddenDirectory = await page.getByText(service.title, { exact: true }).count();
  const dbDraft = await prisma.service.findUnique({ where: { id: service.id }, include: { priceItems: true, leads: true } });
  await prisma.$disconnect();
  if (!update.ok || !dbPublished || dbPublished.shortDescription !== changed || !homepageText || !publishedOption || !detail.ok || !quoteBefore.ok || !beforeLead?.serviceId || !draft.ok || hiddenDetail.status !== 404 || directQuote.status !== 400 || hiddenHomepage || hiddenOption || hiddenDirectory || dbDraft.priceItems.length !== dbPublished.priceItems.length || !dbDraft.leads.some((lead) => lead.id === beforeLead.id)) throw Error('Public services acceptance failed');
  console.error('step: db-down');
  execFileSync('docker', ['stop', container], { stdio: 'pipe' });
  const downList = await checkedFetch(`${base}/api/services`);
  const downDetail = await checkedFetch(`${base}/api/services/${service.slug}`);
  if (downList.status !== 503 || downDetail.status !== 503) throw Error('DB-down behavior failed');
  await browser.close();
  console.log(JSON.stringify({ id: service.id, slug: service.slug, changed, update: update.status, db: dbPublished.shortDescription, homepage: homepageText, quoteOption: publishedOption, detail: detail.status, draft: draft.status, hiddenList: hiddenList.status, hiddenDetail: hiddenDetail.status, hiddenHomepage, hiddenOption, hiddenDirectory, directQuote: directQuote.status, priceItems: dbDraft.priceItems.length, historicalLead: beforeLead.serviceId, dbDownList: downList.status, dbDownDetail: downDetail.status }));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
