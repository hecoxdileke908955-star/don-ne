import 'server-only';

import * as argon2 from 'argon2';

export const ADMIN_PASSWORD_MIN_LENGTH = 12;
export const ADMIN_PASSWORD_MAX_LENGTH = 256;

const ARGON2_OPTIONS = {
  type: argon2.argon2id as 2,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

export function isValidAdminPassword(value: unknown): value is string {
  return typeof value === 'string'
    && value.length >= ADMIN_PASSWORD_MIN_LENGTH
    && value.length <= ADMIN_PASSWORD_MAX_LENGTH;
}

export async function hashAdminPassword(password: string): Promise<string> {
  return argon2.hash(password, ARGON2_OPTIONS);
}

export async function verifyAdminPassword(
  passwordHash: string,
  password: string,
): Promise<{ valid: boolean; needsRehash: boolean }> {
  try {
    const valid = await argon2.verify(passwordHash, password);

    return {
      valid,
      needsRehash: valid && argon2.needsRehash(passwordHash, ARGON2_OPTIONS),
    };
  } catch {
    return { valid: false, needsRehash: false };
  }
}
