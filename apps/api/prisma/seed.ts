import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.subscriptionPlan.upsert({
    where: { id: 'starter-plan-0001' },
    update: {},
    create: { id: 'starter-plan-0001', name: 'Starter', description: 'For small teams', price: 999, billingCycle: 'MONTHLY', maxUsers: 5, maxAssets: 25, maxDevices: 5 },
  });
  await prisma.subscriptionPlan.upsert({
    where: { id: 'business-plan-0001' },
    update: {},
    create: { id: 'business-plan-0001', name: 'Business', description: 'For growing businesses', price: 2499, billingCycle: 'MONTHLY', maxUsers: 25, maxAssets: 100, maxDevices: 25 },
  });
  await prisma.subscriptionPlan.upsert({
    where: { id: 'professional-plan-0001' },
    update: {},
    create: { id: 'professional-plan-0001', name: 'Professional', description: 'For established teams', price: 4999, billingCycle: 'MONTHLY', maxUsers: 100, maxAssets: 500, maxDevices: 100 },
  });
  console.log('Plans seeded!');
}

main().catch(console.error).finally(() => prisma.\());
