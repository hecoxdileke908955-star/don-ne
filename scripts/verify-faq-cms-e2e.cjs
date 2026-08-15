const { spawnSync, execFileSync } = require('node:child_process');
const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

const base = process.env.E2E_BASE_URL;
const container = process.env.E2E_DATABASE_CONTAINER;
const superAdmin = {
  email: process.env.ADMIN_INITIAL_EMAIL,
  password: process.env.ADMIN_INITIAL_PASSWORD,
  fullName: process.env.ADMIN_INITIAL_NAME,
};
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
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
    const provision = provisionSuperAdmin();
    assert(provision.status === 0, 'Initial super-admin provisioning failed');
    const superLogin = await login(superAdmin.email, superAdmin.password);
    assert(superLogin.status === 200 && superLogin.cookie, 'Super-admin login failed');
    const superHeaders = { cookie: superLogin.cookie, origin: base, 'content-type': 'application/json' };

    const editorPasswordHash = await argon2.hash('FaqCmsEditorPass123!', ARGON2_OPTIONS);
    const editor = await prisma.user.create({
      data: { email: 'faq-cms-editor@example.test', passwordHash: editorPasswordHash, fullName: 'FAQ CMS Editor', role: 'EDITOR' },
    });
    const editorLogin = await login(editor.email, 'FaqCmsEditorPass123!');
    assert(editorLogin.status === 200 && editorLogin.cookie, 'EDITOR login failed');
    const editorHeaders = { cookie: editorLogin.cookie, origin: base, 'content-type': 'application/json' };

    // A. authenticated EDITOR GET FAQs -> 200
    const editorGet = await request('/api/admin/faqs', { headers: { cookie: editorLogin.cookie } });
    const editorGetBody = await json(editorGet);
    assert(editorGet.status === 200 && Array.isArray(editorGetBody.faqs), 'EDITOR could not list FAQs');

    // B. unauthenticated GET Admin FAQs -> 401
    const unauth = await request('/api/admin/faqs');
    assert(unauth.status === 401, 'Unauthenticated Admin FAQ API did not return 401');

    // C. create FAQ through Admin API -> success
    const marker = `E2E-FAQ-${Date.now().toString(36)}`;
    const question = `Câu hỏi kiểm thử ${marker}?`;
    const answer = `Câu trả lời kiểm thử ${marker}.`;
    const create = await request('/api/admin/faqs', {
      method: 'POST',
      headers: editorHeaders,
      body: JSON.stringify({ question, answer, sortOrder: 50, isActive: true }),
    });
    const createBody = await json(create);
    assert(create.status === 201 && createBody.faq?.id, 'FAQ creation did not succeed');
    const faqId = createBody.faq.id;

    // D. direct PostgreSQL read -> FAQ persisted
    const rawFaq = await prisma.fAQ.findUnique({ where: { id: faqId } });
    assert(rawFaq?.question === question && rawFaq?.answer === answer, 'Direct DB read did not show the persisted FAQ');

    // E. Admin reload -> persisted FAQ returned
    const reload = await request('/api/admin/faqs', { headers: { cookie: superLogin.cookie } });
    const reloadBody = await json(reload);
    assert(reloadBody.faqs.some((faq) => faq.id === faqId && faq.question === question), 'Admin reload did not show the persisted FAQ');

    // F. published FAQ -> public homepage shows it
    const publicWithFaq = await request('/');
    const publicWithFaqHtml = await publicWithFaq.text();
    assert(publicWithFaqHtml.includes(question), 'Public homepage did not show the active FAQ');

    // G. unpublish/deactivate FAQ -> public homepage no longer shows it
    const deactivate = await request(`/api/admin/faqs/${faqId}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ isActive: false }),
    });
    assert(deactivate.status === 200, 'Deactivation did not succeed');
    const publicAfterDeactivate = await request('/');
    const publicAfterDeactivateHtml = await publicAfterDeactivate.text();
    assert(!publicAfterDeactivateHtml.includes(question), 'Public homepage still showed a deactivated FAQ');

    // H. reactivate/publish -> public homepage shows it again
    const reactivate = await request(`/api/admin/faqs/${faqId}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ isActive: true }),
    });
    assert(reactivate.status === 200, 'Reactivation did not succeed');
    const publicAfterReactivate = await request('/');
    const publicAfterReactivateHtml = await publicAfterReactivate.text();
    assert(publicAfterReactivateHtml.includes(question), 'Public homepage did not show the reactivated FAQ');

    // I. edit question/answer -> PostgreSQL persists -> public reflects the published value
    const editedQuestion = `${question} (đã sửa)`;
    const edit = await request(`/api/admin/faqs/${faqId}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ question: editedQuestion }),
    });
    assert(edit.status === 200, 'FAQ edit did not succeed');
    const rawEdited = await prisma.fAQ.findUnique({ where: { id: faqId } });
    assert(rawEdited?.question === editedQuestion, 'Direct DB read did not reflect the edited question');
    const publicAfterEdit = await request('/');
    const publicAfterEditHtml = await publicAfterEdit.text();
    assert(publicAfterEditHtml.includes(editedQuestion), 'Public homepage did not reflect the edited FAQ question');

    // J. invalid payload -> 400
    const invalid = await request('/api/admin/faqs', {
      method: 'POST',
      headers: superHeaders,
      body: JSON.stringify({ question: '', answer: '' }),
    });
    assert(invalid.status === 400, 'Invalid FAQ payload did not return 400');
    const unknownField = await request(`/api/admin/faqs/${faqId}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ passwordHash: 'x', isActive: true }),
    });
    assert(unknownField.status === 400, 'Unknown field in FAQ payload was not rejected');

    // K. foreign-origin mutation -> 403
    const foreignOrigin = await request(`/api/admin/faqs/${faqId}`, {
      method: 'PATCH',
      headers: { cookie: superLogin.cookie, origin: 'https://attacker.example', 'content-type': 'application/json' },
      body: JSON.stringify({ isActive: true }),
    });
    assert(foreignOrigin.status === 403, 'Foreign-origin mutation was not rejected');

    // L. missing FAQ -> 404
    const missing = await request('/api/admin/faqs/00000000-0000-0000-0000-000000000000', {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ isActive: true }),
    });
    assert(missing.status === 404, 'Missing FAQ did not return 404');

    // Deactivate the test FAQ so it no longer clutters the public homepage before the DB goes down.
    await request(`/api/admin/faqs/${faqId}`, { method: 'PATCH', headers: superHeaders, body: JSON.stringify({ isActive: false }) });

    // M. DB-down mutation -> non-2xx, no fake success
    execFileSync('docker', ['stop', container], { stdio: 'pipe' });
    const dbDownMutation = await request(`/api/admin/faqs/${faqId}`, {
      method: 'PATCH',
      headers: superHeaders,
      body: JSON.stringify({ isActive: true }),
    });
    const dbDownMutationBody = await json(dbDownMutation);
    assert(
      !(dbDownMutation.status >= 200 && dbDownMutation.status < 300) && safeBody(dbDownMutationBody),
      'A mutation returned fake success while the database was unavailable'
    );

    // N. DB-down public FAQ read -> controlled behavior, no hard-coded FAQ fallback
    const dbDownPublic = await request('/');
    const dbDownPublicHtml = await dbDownPublic.text();
    assert(dbDownPublic.status === 200, 'Public homepage crashed instead of degrading gracefully while the database was unavailable');
    assert(
      !dbDownPublicHtml.includes('Dọn Nè có mang đầy đủ hóa chất máy móc không'),
      'Public homepage served the retired hard-coded FAQ fallback while the database was unavailable'
    );
    assert(!dbDownPublicHtml.includes(editedQuestion), 'Public homepage served stale FAQ content while the database was unavailable');

    console.log(JSON.stringify({
      editorGet: editorGet.status,
      unauthenticated: unauth.status,
      create: create.status,
      directDbRead: 'matches',
      adminReload: 'matches',
      publicWithFaq: 'shown',
      deactivate: deactivate.status,
      publicAfterDeactivate: 'hidden',
      reactivate: reactivate.status,
      publicAfterReactivate: 'shown',
      edit: edit.status,
      publicAfterEdit: 'reflected',
      invalid: invalid.status,
      unknownField: unknownField.status,
      foreignOrigin: foreignOrigin.status,
      missing: missing.status,
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
