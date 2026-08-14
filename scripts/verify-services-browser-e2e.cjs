const { chromium } = require('playwright');

const base = process.env.E2E_BASE_URL;
const slug = process.env.E2E_SERVICE_SLUG;
const title = process.env.E2E_SERVICE_TITLE;
const description = process.env.E2E_SERVICE_DESCRIPTION;
const readySlug = process.env.E2E_READY_SERVICE_SLUG;
const readyTitle = process.env.E2E_READY_SERVICE_TITLE;
const visible = process.env.E2E_EXPECTED_VISIBLE !== 'false';

function required(value, name) {
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function main() {
  required(base, 'E2E_BASE_URL');
  required(slug, 'E2E_SERVICE_SLUG');
  required(title, 'E2E_SERVICE_TITLE');
  required(readySlug, 'E2E_READY_SERVICE_SLUG');
  required(readyTitle, 'E2E_READY_SERVICE_TITLE');

  let browser;
  let context;
  let page;
  try {
    console.error(`step: launch (${visible ? 'published' : 'unpublished'})`);
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    page.setDefaultTimeout(10_000);

    console.error('step: directory');
    await page.goto(`${base}/dich-vu`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    await page.getByText(visible ? title : readyTitle, { exact: true }).waitFor();
    const directoryTitleCount = await page.getByText(title, { exact: true }).count();
    const directoryDescriptionCount = visible
      ? await page.getByText(description, { exact: true }).count()
      : 0;
    const directoryLinkCount = await page.locator(`main a[href="/${slug}"]`).count();

    console.error('step: homepage');
    await page.goto(base, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    await page.getByText(visible ? title : readyTitle, { exact: true }).waitFor();
    const homepageTitleCount = await page.getByText(title, { exact: true }).count();

    console.error('step: quote');
    await page.getByRole('button', { name: /Nhận Báo Giá/i }).first().click();
    await page.locator(`option[value="${readySlug}"]`).waitFor({ state: 'attached' });
    const quoteOption = await page.locator(`option[value="${slug}"]`).textContent().catch(() => null);

    console.error('step: detail');
    await page.goto(`${base}/${slug}`, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    if (visible) {
      await page.getByText(title, { exact: true }).waitFor();
      await page.getByText(description, { exact: true }).waitFor();
    } else {
      await page.getByText('Không tìm thấy dịch vụ.', { exact: true }).waitFor();
    }

    const result = {
      mode: visible ? 'published' : 'unpublished',
      directory: {
        title: directoryTitleCount,
        description: directoryDescriptionCount,
        link: directoryLinkCount,
      },
      homepage: { title: homepageTitleCount },
      quoteOption,
      detail: visible ? 'published-service-rendered' : 'public-unavailable-rendered',
    };
    console.log(JSON.stringify(result));

    const pass = visible
      ? directoryTitleCount > 0 && directoryDescriptionCount > 0 && directoryLinkCount > 0
        && homepageTitleCount > 0 && quoteOption === title
      : directoryTitleCount === 0 && directoryLinkCount === 0 && homepageTitleCount === 0
        && quoteOption === null;
    if (!pass) throw new Error(`Rendered assertions failed: ${JSON.stringify(result)}`);
  } finally {
    if (page) await page.close();
    if (context) await context.close();
    if (browser) await browser.close();
    console.error('step: browser-closed');
  }
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
