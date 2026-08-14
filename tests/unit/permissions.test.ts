import { verifyPermission } from '../../src/lib/auth';

describe('Role Permission Hierarchy Unit Tests', () => {
  test('SUPER_ADMIN can access ADMIN and EDITOR tasks', () => {
    expect(verifyPermission('SUPER_ADMIN', 'SUPER_ADMIN')).toBe(true);
    expect(verifyPermission('SUPER_ADMIN', 'ADMIN')).toBe(true);
    expect(verifyPermission('SUPER_ADMIN', 'EDITOR')).toBe(true);
  });

  test('ADMIN can access ADMIN and EDITOR tasks but not SUPER_ADMIN', () => {
    expect(verifyPermission('ADMIN', 'SUPER_ADMIN')).toBe(false);
    expect(verifyPermission('ADMIN', 'ADMIN')).toBe(true);
    expect(verifyPermission('ADMIN', 'EDITOR')).toBe(true);
  });

  test('EDITOR cannot access ADMIN or SUPER_ADMIN tasks', () => {
    expect(verifyPermission('EDITOR', 'SUPER_ADMIN')).toBe(false);
    expect(verifyPermission('EDITOR', 'ADMIN')).toBe(false);
    expect(verifyPermission('EDITOR', 'EDITOR')).toBe(true);
  });
});
