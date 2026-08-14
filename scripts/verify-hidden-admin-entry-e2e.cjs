const { spawnSync } = require('node:child_process');
const { chromium, devices } = require('playwright');

const base = process.env.E2E_BASE_URL;
const superAdmin = {
  email: process.env.ADMIN_INITIAL_EMAIL,
  password: process.env.ADMIN_INITIAL_PASSWORD,
  fullName: process.env.ADMIN_INITIAL_NAME,
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function provisionSuperAdmin() {
  return spawnSync(process.execPath, ['scripts/provision-super-admin.cjs'], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
}

async function pressAndHold(locator, durationMs, pointerType) {
  await locator.dispatchEvent('pointerdown', { pointerId: 1, pointerType, isPrimary: true, button: 0 });
  await new Promise((resolve) => setTimeout(resolve, durationMs));
}

async function releasePress(locator, pointerType) {
  await locator.dispatchEvent('pointerup', { pointerId: 1, pointerType, isPrimary: true, button: 0 });
}

async function main() {
  if (!base || !superAdmin.email || !superAdmin.password || !superAdmin.fullName) {
    throw new Error('Required E2E process environment is missing');
  }

  const provision = provisionSuperAdmin();
  assert(provision.status === 0, 'Initial super-admin provisioning failed');

  let browser;
  try {
    browser = await chromium.launch({ headless: true });

    // ---- Desktop ----
    const desktopContext = await browser.newContext();
    const page = await desktopContext.newPage();
    page.setDefaultTimeout(10_000);

    // J. no visible Admin/Login nav item in the public header
    await page.goto(`${base}/dich-vu`, { waitUntil: 'domcontentloaded' });
    const headerText = await page.locator('header').innerText();
    const headerLinks = await page.locator('header a').evaluateAll((els) => els.map((el) => el.getAttribute('href')));
    const hasVisibleAdminAffordance = /admin|đăng nhập/i.test(headerText) || headerLinks.some((href) => href?.startsWith('/admin'));
    assert(!hasVisibleAdminAffordance, 'Public header exposed a visible Admin/Login affordance');

    // A. short desktop click on logo -> normal Home behavior, no modal
    const logo = page.locator('header a').first();
    await logo.click();
    await page.waitForURL(`${base}/`);
    assert(await page.locator('[role="dialog"]').count() === 0, 'Short click unexpectedly opened the Admin modal');

    // B. hold < 2s -> release -> no modal
    await pressAndHold(logo, 700, 'mouse');
    await releasePress(logo, 'mouse');
    await page.waitForTimeout(1600);
    assert(await page.locator('[role="dialog"]').count() === 0, 'Short hold (<2s) unexpectedly opened the Admin modal');

    // C. hold >= 2s -> modal appears
    await pressAndHold(logo, 2200, 'mouse');
    await page.locator('[role="dialog"]').waitFor({ state: 'visible' });
    assert(await page.locator('[role="dialog"]').isVisible(), 'Long press did not reveal the Admin modal');
    const modalText = await page.locator('[role="dialog"]').innerText();
    assert(!/super_admin|bootstrap/i.test(modalText), 'Modal leaked internal role/bootstrap terminology');
    await releasePress(logo, 'mouse');

    // D. close modal -> returns cleanly to the public page
    await page.getByRole('button', { name: 'Đóng' }).click();
    assert(await page.locator('[role="dialog"]').count() === 0, 'Modal did not close');
    assert(page.url() === `${base}/`, 'Closing the modal navigated away from the public page');

    // F. invalid credentials -> generic failure, no internal information
    await pressAndHold(logo, 2200, 'mouse');
    await page.locator('[role="dialog"]').waitFor({ state: 'visible' });
    await releasePress(logo, 'mouse');
    await page.locator('#admin-login-email').fill('not-a-real-admin@example.test');
    await page.locator('#admin-login-password').fill('WrongPassword123456');
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    const invalidError = await page.locator('[role="dialog"] [role="alert"]').innerText();
    assert(/incorrect|không thể đăng nhập|không thể kết nối/i.test(invalidError), 'Invalid login did not show the expected generic message');
    assert(!/prisma|postgres|sql|stack/i.test(invalidError), 'Invalid login leaked internal information');
    assert(page.url() !== `${base}/admin`, 'Invalid credentials unexpectedly reached /admin');

    // E. valid DB-backed credentials -> reaches /admin
    await page.locator('#admin-login-email').fill(superAdmin.email);
    await page.locator('#admin-login-password').fill(superAdmin.password);
    await page.getByRole('button', { name: 'Đăng nhập' }).click();
    await page.waitForURL(`${base}/admin`);
    assert(page.url() === `${base}/admin`, 'Valid credentials did not reach /admin');

    // Already-authenticated long press should now navigate straight to /admin
    // (no login modal forced). The pointerdown timer alone triggers the
    // navigation, so no matching pointerup against the now-replaced DOM is
    // needed.
    await page.goto(`${base}/dich-vu`, { waitUntil: 'domcontentloaded' });
    await pressAndHold(page.locator('header a').first(), 2200, 'mouse');
    await page.waitForURL(`${base}/admin`);

    await page.request.post(`${base}/api/admin/auth/logout`);

    // G. rate limiting still applies because the modal reuses the existing auth API
    let lastStatus = 0;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      const response = await page.request.post(`${base}/api/admin/auth`, {
        data: { email: 'rate-limit-check@example.test', password: 'IncorrectPassword123456' },
      });
      lastStatus = response.status();
    }
    assert(lastStatus === 429, 'Rate limiting did not apply to repeated auth attempts');

    await desktopContext.close();

    // ---- Mobile / touch ----
    const mobileContext = await browser.newContext({ ...devices['Pixel 5'] });
    const mobilePage = await mobileContext.newPage();
    mobilePage.setDefaultTimeout(10_000);
    await mobilePage.goto(`${base}/dich-vu`, { waitUntil: 'domcontentloaded' });
    const mobileLogo = mobilePage.locator('header a').first();

    // H. short tap -> normal Home behavior, no accidental modal
    await pressAndHold(mobileLogo, 200, 'touch');
    await releasePress(mobileLogo, 'touch');
    await mobilePage.waitForTimeout(1600);
    assert(await mobilePage.locator('[role="dialog"]').count() === 0, 'Short touch unexpectedly opened the Admin modal');

    // I. long touch (>=2s) -> modal appears
    await pressAndHold(mobileLogo, 2200, 'touch');
    await mobilePage.locator('[role="dialog"]').waitFor({ state: 'visible' });
    assert(await mobilePage.locator('[role="dialog"]').isVisible(), 'Long touch did not reveal the Admin modal');
    await releasePress(mobileLogo, 'touch');
    await mobileContext.close();

    // K. direct unauthenticated /admin remains protected
    const unauthContext = await browser.newContext();
    const unauthPage = await unauthContext.newPage();
    await unauthPage.goto(`${base}/admin`, { waitUntil: 'domcontentloaded' });
    assert(unauthPage.url().startsWith(`${base}/admin-login`), 'Unauthenticated /admin was not protected');
    await unauthContext.close();

    console.log(JSON.stringify({
      noVisibleAdminAffordance: true,
      shortClick: 'home',
      shortHold: 'no-modal',
      longHold: 'modal',
      modalClose: 'clean',
      invalidLogin: 'generic-rejected',
      validLogin: 'reached-admin',
      alreadyAuthenticated: 'reached-admin-directly',
      rateLimit: lastStatus,
      shortTouch: 'no-modal',
      longTouch: 'modal',
      directAdminUnauthenticated: 'protected',
    }));
  } finally {
    if (browser) await browser.close();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
