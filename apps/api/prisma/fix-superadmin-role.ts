import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: { email: 'superadmin@itsmpro.com' },
    data: { role: 'SUPER_ADMIN' },
  });
  console.log('✅ Super Admin role updated:', user.email, '→', user.role);

  // Verify all roles
  const allUsers = await prisma.user.findMany({
    select: { email: true, role: true, tenantId: true },
  });
  console.log('\n📋 All Users:');
  allUsers.forEach((u) => console.log(`  ${u.email} → ${u.role}`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
