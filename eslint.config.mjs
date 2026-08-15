import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
  ]),
  {
    files: ['scripts/verify-lead-e2e.cjs', 'scripts/verify-lead-admin-e2e.cjs', 'scripts/verify-pricing-admin-e2e.cjs', 'scripts/verify-pricing-db-down.cjs', 'scripts/verify-pricing-public-e2e.cjs', 'scripts/verify-services-admin-e2e.cjs', 'scripts/verify-services-public-e2e.cjs', 'scripts/verify-services-server-e2e.cjs', 'scripts/verify-services-browser-e2e.cjs', 'scripts/verify-settings-admin-e2e.cjs', 'scripts/verify-settings-public-e2e.cjs', 'scripts/verify-track-e2e.cjs', 'scripts/verify-rate-limit-e2e.cjs', 'scripts/verify-csrf-e2e.cjs', 'scripts/verify-security-headers-e2e.cjs', 'scripts/verify-error-hygiene-e2e.cjs', 'scripts/provision-super-admin.cjs', 'scripts/verify-db-auth-e2e.cjs', 'scripts/verify-rbac-e2e.cjs', 'scripts/verify-admin-users-e2e.cjs', 'scripts/verify-hidden-admin-entry-e2e.cjs', 'scripts/verify-page-cms-e2e.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);

export default eslintConfig;
