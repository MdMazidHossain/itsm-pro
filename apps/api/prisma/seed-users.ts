import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.findFirst({ where: { subdomain: 'acme' } });
  if (!tenant) { console.log('Tenant not found!'); return; }

  const password = await bcrypt.hash('Password@123', 10);

  // Create Technician
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'tech@acme.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'tech@acme.com',
      passwordHash: password,
      firstName: 'Rahim',
      lastName: 'Technician',
      role: 'TECHNICIAN',
      status: 'ACTIVE',
    },
  });

  // Create Employee 1
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'employee@acme.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'employee@acme.com',
      passwordHash: password,
      firstName: 'Karim',
      lastName: 'Employee',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
    },
  });

  // Create Employee 2
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'employee2@acme.com' } },
    update: {},
    create: {
      tenantId: tenant.id,
      email: 'employee2@acme.com',
      passwordHash: password,
      firstName: 'Jamal',
      lastName: 'Employee',
      role: 'EMPLOYEE',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Demo users created:');
  console.log('   Technician: tech@acme.com / Password@123');
  console.log('   Employee 1: employee@acme.com / Password@123');
  console.log('   Employee 2: employee2@acme.com / Password@123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
