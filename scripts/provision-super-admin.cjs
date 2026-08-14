const { PrismaClient } = require('@prisma/client');
const argon2 = require('argon2');

const PASSWORD_MIN_LENGTH = 12;
const PASSWORD_MAX_LENGTH = 256;
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

function input() {
  const email = process.env.ADMIN_INITIAL_EMAIL?.trim().toLowerCase() ?? '';
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  const fullName = process.env.ADMIN_INITIAL_NAME?.trim() ?? '';

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || typeof password !== 'string'
    || password.length < PASSWORD_MIN_LENGTH
    || password.length > PASSWORD_MAX_LENGTH
    || fullName.length < 2
    || fullName.length > 120
  ) {
    throw new Error('Invalid provisioning input');
  }

  return { email, password, fullName };
}

async function main() {
  const { email, password, fullName } = input();
  const prisma = new PrismaClient();

  try {
    const passwordHash = await argon2.hash(password, ARGON2_OPTIONS);

    await prisma.$transaction(async (tx) => {
      await tx.$executeRawUnsafe('SELECT pg_advisory_xact_lock(719061001)');

      if (await tx.user.count()) {
        throw new Error('A user already exists');
      }

      await tx.user.create({
        data: {
          email,
          passwordHash,
          fullName,
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
    });

    console.log('Initial super-admin provisioned');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(() => {
  console.error('Super-admin provisioning failed');
  process.exitCode = 1;
});
