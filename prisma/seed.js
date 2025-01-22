import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if data already exists
  const settings = await prisma.apiSettings.findFirst();
  if (!settings) {
    console.log('Seeding ApiSettings...');
    await prisma.apiSettings.create({
      data: {
        stripePublishKey: '1234',
        stripeSecretKey: '1234',
        mayaApiKey: '1234',
        mayaSecretKey: '1234',
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
