import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SuperAdminService {
  constructor(private prisma: PrismaService) {}

  async getAllTenants() {
    const tenants = await this.prisma.tenant.findMany({
      where: { subdomain: { not: 'platform' } },
      include: {
        subscriptionPlan: true,
        _count: { select: { users: true, assets: true, tickets: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return tenants;
  }

  async getStats() {
    const [totalTenants, activeTenants, suspendedTenants, totalUsers] = await Promise.all([
      this.prisma.tenant.count({ where: { subdomain: { not: 'platform' } } }),
      this.prisma.tenant.count({ where: { status: 'ACTIVE', subdomain: { not: 'platform' } } }),
      this.prisma.tenant.count({ where: { status: 'SUSPENDED', subdomain: { not: 'platform' } } }),
      this.prisma.user.count(),
    ]);
    return { totalTenants, activeTenants, suspendedTenants, totalUsers };
  }

  async updateTenantStatus(tenantId: string, status: string) {
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { status: status as any },
    });
  }

  async getSubscriptionPlans() {
    return this.prisma.subscriptionPlan.findMany({ orderBy: { price: 'asc' } });
  }

  async createPlan(data: any) {
    return this.prisma.subscriptionPlan.create({ data });
  }

  async updatePlan(id: string, data: any) {
    return this.prisma.subscriptionPlan.update({ where: { id }, data });
  }
}
