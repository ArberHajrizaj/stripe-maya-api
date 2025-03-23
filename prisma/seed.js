import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const settings = await prisma.apiSettings.findFirst();
  if (!settings) {
    console.log('Seeding ApiSettings...');
    await prisma.apiSettings.create({
      data: {
        stripePublishKey: 'pk_test_51QDBSMHIlwY6M0uC3SmX3jxBXuVwUi2E3PCP3mL9E0T4ISWqAWKzlXOwpzTGF5zKED4qkKAFzzHRy4CjbSY4thIo00IGOklE5L',
        stripeSecretKey: 'sk_test_51QDBSMHIlwY6M0uCPgHZstV0aV2J3IEUVO2vtxk8H3FiZ5S8LDvrG9TNRZ7oKiAOlY3xy7OZ483WDjVfGZGHr4yi00KLVH77Ha',
        mayaApiKey: 'tSoiJXlDnz76',
        mayaSecretKey: 'Z6JJP2i8OojucrGfEsYPm3kIyohxW7KQ7NpTV12qkAwAqtd5eWIMdScNCiLbpQFl',
      },
    });
    console.log('Seeded ApiSettings successfully.');
  } else {
    console.log('ApiSettings already exists. Skipping seed.');
  }
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
