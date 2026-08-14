const { execFileSync } = require('node:child_process');
const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const container = process.env.E2E_DATABASE_CONTAINER;
const timeout = (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(15_000) });

async function json(response) { return response.json().catch(() => ({})); }

async function main() {
  if (!base || !container) throw new Error('E2E_BASE_URL and E2E_DATABASE_CONTAINER are required');

  const prisma = new PrismaClient();
  try {
    const payload = {
      sessionId: `sess_track_e2e_${Date.now().toString(36)}`,
      eventName: 'phone_click',
      pageUrl: '/dich-vu',
      meta: { device: 'DESKTOP', utmSource: 'e2e', hotline: '0900000000', location: 'track-e2e' },
    };

    console.error('step: valid-event');
    const valid = await timeout(`${base}/api/track`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const validBody = await json(valid);
    const stored = await prisma.trafficEvent.findFirst({ where: { sessionId: payload.sessionId, eventName: payload.eventName, pageUrl: payload.pageUrl } });

    console.error('step: malformed');
    const malformed = await timeout(`${base}/api/track`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{' });
    const malformedBody = await json(malformed);

    console.error('step: oversized');
    const oversized = await timeout(`${base}/api/track`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, pageUrl: `/${'x'.repeat(9_000)}` }) });
    const oversizedBody = await json(oversized);

    console.error('step: unsupported-event');
    const unsupported = await timeout(`${base}/api/track`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...payload, eventName: 'unknown_event' }) });
    const unsupportedBody = await json(unsupported);

    console.error('step: core-ux');
    const publicPage = await timeout(`${base}/`);
    const services = await json(await timeout(`${base}/api/services`));
    const serviceSlug = services.services?.[0]?.slug;
    const quote = serviceSlug ? await timeout(`${base}/api/quote`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ customerName: 'Track E2E', phone: '0900000000', serviceSlug }) }) : null;

    const validBeforeDown = valid.ok && validBody.tracked === true && Boolean(stored);
    const invalidInputs = malformed.status === 400 && malformedBody.tracked !== true && oversized.status === 400 && oversizedBody.tracked !== true && unsupported.status === 400 && unsupportedBody.tracked !== true;
    const coreUx = publicPage.ok && quote?.ok;
    if (!validBeforeDown || !invalidInputs || !coreUx) throw new Error('Track persistence, validation, or core UX assertion failed');

    console.error('step: db-down');
    execFileSync('docker', ['stop', container], { stdio: 'pipe' });
    const down = await timeout(`${base}/api/track`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload) });
    const downBody = await json(down);
    const publicPageAfterDown = await timeout(`${base}/`);
    const downBodyText = JSON.stringify(downBody);
    const dbDownSafe = !down.ok && down.status === 503 && downBody.tracked !== true && !/Prisma|P20\d\d|database|sql|postgres/i.test(downBodyText) && publicPageAfterDown.ok;
    if (!dbDownSafe) throw new Error('Track database failure assertion failed');

    console.log(JSON.stringify({ valid: valid.status, persisted: Boolean(stored), malformed: malformed.status, oversized: oversized.status, unsupported: unsupported.status, quote: quote?.status, publicPage: publicPage.status, dbDown: down.status, noFakeSuccess: downBody.tracked !== true, noInternals: !/Prisma|P20\d\d|database|sql|postgres/i.test(downBodyText), publicPageAfterDown: publicPageAfterDown.status }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
