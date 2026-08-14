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
    files: ['scripts/verify-lead-e2e.cjs', 'scripts/verify-lead-admin-e2e.cjs', 'scripts/verify-pricing-admin-e2e.cjs', 'scripts/verify-pricing-db-down.cjs', 'scripts/verify-pricing-public-e2e.cjs', 'scripts/verify-services-admin-e2e.cjs', 'scripts/verify-services-public-e2e.cjs', 'scripts/verify-services-server-e2e.cjs', 'scripts/verify-services-browser-e2e.cjs', 'scripts/verify-settings-admin-e2e.cjs', 'scripts/verify-settings-public-e2e.cjs', 'scripts/verify-track-e2e.cjs', 'scripts/verify-rate-limit-e2e.cjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
]);

export default eslintConfig;
