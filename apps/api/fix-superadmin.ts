import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const updated = await prisma.user.update({
    where: { email: 'superadmin@itsmpro.com' },
    data: { role: 'SUPER_ADMIN' },
  });
  console.log('✅ Updated:', updated.email, '→ Role:', updated.role);
}

main().catch(console.error).finally(() => prisma.$disconnect());
