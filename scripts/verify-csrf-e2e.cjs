const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
const request = (path, options = {}) => fetch(`${base}${path}`, {
  ...options,
  signal: AbortSignal.timeout(15_000),
});

async function json(response) {
  return response.json().catch(() => ({}));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function noInternals(body) {
  return !/prisma|postgres|database|sql|p20\d\d|forwarded/i.test(JSON.stringify(body));
}

async function main() {
  if (!base || !password) throw new Error('E2E_BASE_URL and ADMIN_BOOTSTRAP_PASSWORD are required');

  const prisma = new PrismaClient();
  try {
    console.error('step: login');
    const login = await request('/api/admin/auth', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const loginBody = await json(login);
    const cookie = login.headers.get('set-cookie')?.split(';')[0];
    assert(login.ok && loginBody.success === true && cookie, 'Expected authenticated admin login');

    const adminHeaders = {
      cookie,
      origin: base,
      'content-type': 'application/json',
    };

    console.error('step: same-origin-read');
    const read = await request('/api/admin/pricing', { headers: { cookie } });
    const readBody = await json(read);
    const item = readBody.items?.[0];
    assert(read.ok && item, 'Expected authenticated admin read');

    const pricingPayload = {
      itemName: item.itemName,
      unit: item.unit,
      minPrice: Number(item.minPrice),
      maxPrice: item.maxPrice === null ? null : Number(item.maxPrice),
      conditionText: item.conditionText ?? null,
      note: item.note ?? null,
      sortOrder: item.sortOrder,
      status: item.status,
    };

    console.error('step: same-origin-mutation');
    const sameOrigin = await request(`/api/admin/pricing/${item.id}`, {
      method: 'PATCH', headers: adminHeaders, body: JSON.stringify(pricingPayload),
    });
    assert(sameOrigin.ok, 'Expected same-origin authenticated pricing mutation');
    const beforeForeign = await prisma.priceItem.findUnique({
      where: { id: item.id },
      select: { minPrice: true, maxPrice: true, updatedAt: true },
    });

    console.error('step: foreign-pricing');
    const foreignPricing = await request(`/api/admin/pricing/${item.id}`, {
      method: 'PATCH',
      headers: { ...adminHeaders, origin: 'https://attacker.example' },
      body: JSON.stringify({ ...pricingPayload, minPrice: pricingPayload.minPrice + 1 }),
    });
    const foreignPricingBody = await json(foreignPricing);
    const afterForeign = await prisma.priceItem.findUnique({
      where: { id: item.id },
      select: { minPrice: true, maxPrice: true, updatedAt: true },
    });
    assert(foreignPricing.status === 403 && noInternals(foreignPricingBody), 'Expected foreign pricing mutation to be generically forbidden');
    assert(JSON.stringify(afterForeign) === JSON.stringify(beforeForeign), 'Expected rejected pricing mutation not to persist');

    console.error('step: foreign-settings');
    const settings = await request('/api/admin/settings', { headers: { cookie } });
    const settingsBody = await json(settings);
    const foreignSettings = await request('/api/admin/settings', {
      method: 'PATCH',
      headers: { ...adminHeaders, origin: 'https://attacker.example' },
      body: JSON.stringify(settingsBody.settings),
    });
    const foreignSettingsBody = await json(foreignSettings);
    assert(foreignSettings.status === 403 && noInternals(foreignSettingsBody), 'Expected foreign settings mutation to be forbidden');

    console.error('step: foreign-logout');
    const foreignLogout = await request('/api/admin/auth/logout', {
      method: 'POST', headers: { cookie, origin: 'https://attacker.example' },
    });
    const foreignLogoutBody = await json(foreignLogout);
    const readAfterLogoutAttempt = await request('/api/admin/pricing', { headers: { cookie } });
    assert(foreignLogout.status === 403 && noInternals(foreignLogoutBody) && readAfterLogoutAttempt.ok, 'Expected foreign logout to be forbidden without clearing the session');

    console.error('step: unauthenticated-mutation');
    const unauthenticated = await request(`/api/admin/pricing/${item.id}`, {
      method: 'PATCH',
      headers: { origin: base, 'content-type': 'application/json' },
      body: JSON.stringify(pricingPayload),
    });
    assert(unauthenticated.status === 401, 'Expected unauthenticated mutation to remain unauthorized');

    console.error('step: public-endpoints');
    const services = await json(await request('/api/services'));
    const quote = await request('/api/quote', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ customerName: 'CSRF E2E', phone: '0900000000', serviceSlug: services.services?.[0]?.slug }),
    });
    const track = await request('/api/track', {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId: `csrf${Date.now().toString(36)}`, eventName: 'phone_click', pageUrl: '/', meta: { device: 'DESKTOP' } }),
    });
    const quoteBody = await json(quote);
    const trackBody = await json(track);
    assert(quote.ok && quoteBody.success === true && track.ok && trackBody.tracked === true, 'Expected public Quote and Track to remain usable');

    console.log(JSON.stringify({
      sameOriginRead: read.status,
      sameOriginMutation: sameOrigin.status,
      foreignPricing: foreignPricing.status,
      foreignSettings: foreignSettings.status,
      foreignLogout: foreignLogout.status,
      unauthenticated: unauthenticated.status,
      quote: quote.status,
      track: track.status,
    }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
