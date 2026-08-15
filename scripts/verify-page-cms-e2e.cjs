const { spawnSync, execFileSync } = require('node:child_process');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

const base = process.env.E2E_BASE_URL;
const container = process.env.E2E_DATABASE_CONTAINER;
const superAdmin = {
  email: process.env.ADMIN_INITIAL_EMAIL,
  password: process.env.ADMIN_INITIAL_PASSWORD,
  fullName: process.env.ADMIN_INITIAL_NAME,
};

const request = (path, options = {}) => fetch(`${base}${path}`, {
  ...options,
  redirect: 'manual',
  signal: AbortSignal.timeout(15_000),
});

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function json(response) {
  return response.json().catch(() => ({}));
}

function safeBody(body) {
  return !/(prisma|postgres|database|sql|p20\d\d|stack|[a-z]:\\|\/app\/|\/src\/)/i.test(JSON.stringify(body));
}

function provisionSuperAdmin() {
  return spawnSync(process.execPath, ['scripts/provision-super-admin.cjs'], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
  });
}

async function login(email, password) {
  const response = await request('/api/admin/auth', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const cookie = response.headers.get('set-cookie')?.split(';')[0];
  return { status: response.status, cookie };
}

async function main() {
  if (!base || !container || !superAdmin.email || !superAdmin.password || !superAdmin.fullName) {
    throw new Error('Required E2E process environment is missing');
  }

  const prisma = new PrismaClient();

  try {
    // A. Admin login succeeds
    const provision = provisionSuperAdmin();
    assert(provision.status === 0, 'Initial super-admin provisioning failed');
    const superLogin = await login(superAdmin.email, superAdmin.password);
    assert(superLogin.status === 200 && superLogin.cookie, 'Super-admin login failed');
    const superCookie = superLogin.cookie;
    const superHeaders = { cookie: superCookie, origin: base, 'content-type': 'application/json' };

    const editorPasswordHash = await argon2.hash('PageCmsEditorPass123!', ARGON2_OPTIONS);
    const editor = await prisma.user.create({
      data: { email: 'page-cms-editor@example.test', passwordHash: editorPasswordHash, fullName: 'Page CMS Editor', role: 'EDITOR' },
    });
    const editorLogin = await login(editor.email, 'PageCmsEditorPass123!');
    assert(editorLogin.status === 200 && editorLogin.cookie, 'EDITOR login failed');
    const editorCookie = editorLogin.cookie;
    const editorHeaders = { cookie: editorCookie, origin: base, 'content-type': 'application/json' };

    // B. EDITOR-or-higher GET Page CMS -> 200
    const editorGet = await request('/api/admin/pages/home', { headers: { cookie: editorCookie } });
    const editorGetBody = await json(editorGet);
    assert(editorGet.status === 200 && Array.isArray(editorGetBody.page?.sections), 'EDITOR could not read the Page CMS draft');

    // C. unauthenticated Admin Page API -> 401
    const unauth = await request('/api/admin/pages/home');
    assert(unauth.status === 401, 'Unauthenticated Page CMS API did not return 401');

    const ctaSection = editorGetBody.page.sections.find((section) => section.type === 'CTA');
    assert(ctaSection, 'Seeded home page is missing a CTA section to exercise');
    const marker = `E2E-MARKER-${Date.now().toString(36)}`;

    // D. update one harmless homepage section field -> 2xx
    const updateSection = await request(`/api/admin/pages/home/sections/${ctaSection.id}`, {
      method: 'PATCH',
      headers: editorHeaders,
      body: JSON.stringify({ props: { ...ctaSection.props, heading: marker } }),
    });
    assert(updateSection.status >= 200 && updateSection.status < 300, 'Section update did not return 2xx');

    // E. direct PostgreSQL read -> changed draft value persisted
    const rawSection = await prisma.pageSection.findUnique({ where: { id: ctaSection.id } });
    assert(rawSection?.props?.heading === marker, 'Direct DB read did not show the persisted draft change');

    // F. Admin reload -> same persisted value
    const reload = await request('/api/admin/pages/home', { headers: { cookie: editorCookie } });
    const reloadBody = await json(reload);
    const reloadedCta = reloadBody.page.sections.find((section) => section.id === ctaSection.id);
    assert(reloadedCta?.props?.heading === marker, 'Admin reload did not show the persisted draft change');

    // G. PUBLIC homepage BEFORE publish -> does NOT expose the draft change
    const publicBeforePublish = await request('/');
    const publicBeforeHtml = await publicBeforePublish.text();
    assert(!publicBeforeHtml.includes(marker), 'Public homepage exposed a draft change before publish');

    // H. authenticated Preview -> DOES show draft change
    const preview = await request('/admin/pages/home/preview', { headers: { cookie: editorCookie } });
    const previewHtml = await preview.text();
    assert(preview.status === 200 && previewHtml.includes(marker), 'Authenticated preview did not show the draft change');

    // Preview security: unauthenticated preview is blocked (redirect, not the draft content).
    const unauthPreview = await request('/admin/pages/home/preview');
    const unauthPreviewBody = await unauthPreview.text();
    assert(
      unauthPreview.status >= 300 && unauthPreview.status < 400 && !unauthPreviewBody.includes(marker),
      'Unauthenticated preview was not blocked'
    );

    // I. publish action -> succeeds
    const publish = await request('/api/admin/pages/home/publish', { method: 'POST', headers: superHeaders });
    assert(publish.status >= 200 && publish.status < 300, 'Publish action did not succeed');

    // J. PUBLIC homepage after publish -> shows the changed value
    const publicAfterPublish = await request('/');
    const publicAfterHtml = await publicAfterPublish.text();
    assert(publicAfterHtml.includes(marker), 'Public homepage did not reflect the change after publish');

    // K. reload public homepage -> published value remains
    const publicReload = await request('/');
    const publicReloadHtml = await publicReload.text();
    assert(publicReloadHtml.includes(marker), 'Published value did not remain on reload');

    // L. edit seoTitle / seoDescription -> persist -> publish -> public metadata reflects
    const seoTitle = `SEO Title ${marker}`;
    const seoDescription = `SEO Description ${marker}`;
    const seoUpdate = await request('/api/admin/pages/home', {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ seoTitle, seoDescription }),
    });
    assert(seoUpdate.status >= 200 && seoUpdate.status < 300, 'SEO update did not return 2xx');
    const seoPublish = await request('/api/admin/pages/home/publish', { method: 'POST', headers: superHeaders });
    assert(seoPublish.status >= 200 && seoPublish.status < 300, 'SEO publish did not succeed');
    const publicHome = await request('/');
    const publicHomeHtml = await publicHome.text();
    assert(publicHomeHtml.includes(`<title>${seoTitle}`) || publicHomeHtml.includes(seoTitle), 'Public homepage did not reflect the published SEO title');
    assert(publicHomeHtml.includes(seoDescription), 'Public homepage did not reflect the published SEO description');

    // M. malformed/unknown section payload -> 400
    const malformed = await request(`/api/admin/pages/home/sections/${ctaSection.id}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ visible: 'not-a-boolean' }),
    });
    assert(malformed.status === 400, 'Malformed section payload did not return 400');

    // N. unsupported section type -> rejected
    const homePage = await prisma.page.findUnique({ where: { slug: 'home' } });
    const unsupportedRow = await prisma.pageSection.create({
      data: { pageId: homePage.id, type: 'Stats', variant: 'default', sortOrder: 99, visible: true, props: { heading: 'Unsupported' } },
    });
    const unsupportedPatch = await request(`/api/admin/pages/home/sections/${unsupportedRow.id}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ visible: false }),
    });
    assert(unsupportedPatch.status === 400, 'Unsupported section type was not rejected');
    await prisma.pageSection.delete({ where: { id: unsupportedRow.id } });

    // O. foreign-origin mutation -> 403
    const foreignOrigin = await request(`/api/admin/pages/home/sections/${ctaSection.id}`, {
      method: 'PATCH',
      headers: { cookie: superCookie, origin: 'https://attacker.example', 'content-type': 'application/json' },
      body: JSON.stringify({ visible: true }),
    });
    assert(foreignOrigin.status === 403, 'Foreign-origin mutation was not rejected');

    // Restore the CTA heading to its canonical seeded value, then publish, before taking the database down.
    const canonicalHeading = 'Đặt Lịch Dọn Dẹp Hôm Nay — Nhận Ưu Đãi Đầu Tuần';
    await request(`/api/admin/pages/home/sections/${ctaSection.id}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ props: { ...ctaSection.props, heading: canonicalHeading } }),
    });
    await request('/api/admin/pages/home', {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({
        seoTitle: 'Dọn Nè — Dịch Vụ Vệ Sinh Công Nghiệp & Nhà Cửa Chuyên Nghiệp Hà Nội',
        seoDescription: 'Dọn Nè cung cấp dịch vụ tổng vệ sinh nhà cửa, vệ sinh sau xây dựng, văn phòng, giặt sofa đệm tại Hà Nội. Giá minh bạch, nghiệm thu mới thanh toán. Hotline: 0964.182.330.',
      }),
    });
    await request('/api/admin/pages/home/publish', { method: 'POST', headers: superHeaders });

    // P. DB unavailable during mutation -> non-2xx, no fake success
    execFileSync('docker', ['stop', container], { stdio: 'pipe' });
    const dbDownMutation = await request(`/api/admin/pages/home/sections/${ctaSection.id}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ visible: true }),
    });
    const dbDownMutationBody = await json(dbDownMutation);
    assert(
      !(dbDownMutation.status >= 200 && dbDownMutation.status < 300) && safeBody(dbDownMutationBody),
      'A mutation returned fake success while the database was unavailable'
    );

    // Q. DB unavailable during public homepage read -> controlled behavior, no DEFAULT_SECTIONS fallback
    const dbDownPublic = await request('/');
    const dbDownPublicHtml = await dbDownPublic.text();
    assert(dbDownPublic.status === 200, 'Public homepage crashed instead of degrading gracefully while the database was unavailable');
    assert(!dbDownPublicHtml.includes(marker), 'Public homepage served stale content while the database was unavailable');
    assert(/tạm thời chưa khả dụng/i.test(dbDownPublicHtml), 'Public homepage did not show a controlled unavailable message');

    console.log(JSON.stringify({
      login: superLogin.status,
      editorGet: editorGet.status,
      unauthenticated: unauth.status,
      sectionUpdate: updateSection.status,
      directDbRead: 'matches',
      adminReload: 'matches',
      publicBeforePublish: 'no-draft-leak',
      preview: 'shows-draft',
      unauthPreview: 'blocked',
      publish: publish.status,
      publicAfterPublish: 'shows-published',
      publicReload: 'still-published',
      seoPropagation: 'reflected',
      malformedPayload: malformed.status,
      unsupportedSectionType: unsupportedPatch.status,
      foreignOrigin: foreignOrigin.status,
      dbDownMutation: dbDownMutation.status,
      dbDownPublic: 'controlled-unavailable',
    }));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
