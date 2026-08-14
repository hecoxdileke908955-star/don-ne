const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const authPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const timeout = (url, options) => fetch(url, {
  ...options,
  signal: AbortSignal.timeout(15_000),
});

async function json(response) {
  return response.json().catch(() => ({}));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function rateLimited(response, body) {
  return response.status === 429
    && Number(response.headers.get('retry-after')) > 0
    && body.success !== true
    && body.tracked !== true
    && !/prisma|postgres|database|sql|p20\d\d/i.test(JSON.stringify(body));
}

async function post(path, body) {
  const response = await timeout(`${base}${path}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return { response, body: await json(response) };
}

async function main() {
  if (!base || !authPassword) {
    throw new Error('E2E_BASE_URL and ADMIN_BOOTSTRAP_PASSWORD are required');
  }

  const prisma = new PrismaClient();
  try {
    console.error('step: auth');
    const authSuccess = await post('/api/admin/auth', { password: authPassword });
    const authFirst = await post('/api/admin/auth', { password: 'incorrect-password' });
    const authSecond = await post('/api/admin/auth', { password: 'incorrect-password' });
    const authLimited = await post('/api/admin/auth', { password: 'incorrect-password' });
    assert(
      authSuccess.response.ok
        && authSuccess.body.success === true
        && /HttpOnly/i.test(authSuccess.response.headers.get('set-cookie') ?? '')
        && /SameSite=Strict/i.test(authSuccess.response.headers.get('set-cookie') ?? ''),
      'Expected successful authentication to keep its signed HttpOnly strict cookie'
    );
    assert(authFirst.response.status === 401, 'Expected first invalid authentication attempt to be 401');
    assert(authSecond.response.status === 401, 'Expected second invalid authentication attempt to be 401');
    assert(rateLimited(authLimited.response, authLimited.body), 'Expected repeated authentication attempt to be safely rate limited');

    console.error('step: quote');
    const servicesResponse = await timeout(`${base}/api/services`);
    const services = await json(servicesResponse);
    const serviceSlug = services.services?.[0]?.slug;
    assert(servicesResponse.ok && serviceSlug, 'Expected a seeded published service');
    const leadCountBefore = await prisma.lead.count();
    const quotePayload = {
      customerName: 'Rate Limit E2E',
      phone: '0900000000',
      serviceSlug,
      customerNote: `rate-limit-${Date.now()}`,
    };
    const quoteFirst = await post('/api/quote', quotePayload);
    const quoteSecond = await post('/api/quote', quotePayload);
    const quoteLimited = await post('/api/quote', quotePayload);
    const leadCountAfter = await prisma.lead.count();
    assert(quoteFirst.response.ok && quoteFirst.body.success === true, 'Expected first quote to succeed');
    assert(quoteSecond.response.ok && quoteSecond.body.success === true, 'Expected second quote to succeed');
    assert(rateLimited(quoteLimited.response, quoteLimited.body), 'Expected repeated quote to be safely rate limited');
    assert(leadCountAfter === leadCountBefore + 2, 'Expected rate-limited quote not to create another lead');

    console.error('step: track');
    const eventCountBefore = await prisma.trafficEvent.count();
    const sessionPrefix = `rl${Date.now().toString(36)}`;
    const trackPayload = (suffix) => ({
      sessionId: `${sessionPrefix}${suffix}`,
      eventName: 'phone_click',
      pageUrl: '/dich-vu',
      meta: { device: 'DESKTOP', location: 'rate-limit-e2e' },
    });
    const trackFirst = await post('/api/track', trackPayload('a'));
    const trackSecond = await post('/api/track', trackPayload('b'));
    const trackLimited = await post('/api/track', trackPayload('c'));
    const eventCountAfter = await prisma.trafficEvent.count();
    assert(trackFirst.response.ok && trackFirst.body.tracked === true, 'Expected first telemetry event to succeed');
    assert(trackSecond.response.ok && trackSecond.body.tracked === true, 'Expected second telemetry event to succeed');
    assert(rateLimited(trackLimited.response, trackLimited.body), 'Expected telemetry flood to be safely rate limited');
    assert(eventCountAfter === eventCountBefore + 2, 'Expected rate-limited telemetry not to persist');

    console.log(JSON.stringify({
      auth: { success: authSuccess.response.status, first: authFirst.response.status, second: authSecond.response.status, limited: authLimited.response.status },
      quote: { first: quoteFirst.response.status, second: quoteSecond.response.status, limited: quoteLimited.response.status, persisted: leadCountAfter - leadCountBefore },
      track: { first: trackFirst.response.status, second: trackSecond.response.status, limited: trackLimited.response.status, persisted: eventCountAfter - eventCountBefore },
    }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
