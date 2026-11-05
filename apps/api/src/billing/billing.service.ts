import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BillingService {
  constructor(private prisma: PrismaService) {}

  async getPlans() {
    return this.prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }

  async createPlan(data: any) {
    return this.prisma.subscriptionPlan.create({ data });
  }

  async getInvoices(tenantId: string) {
    return this.prisma.invoice.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createInvoice(tenantId: string, data: any) {
    const count = await this.prisma.invoice.count({ where: { tenantId } });
    const invoiceNumber = `INV-${Date.now()}-${count + 1}`;
    return this.prisma.invoice.create({
      data: {
        tenantId,
        invoiceNumber,
        amount: data.amount,
        dueDate: new Date(data.dueDate),
        description: data.description || 'ITSM Pro Subscription',
      },
    });
  }

  async getCurrentSubscription(tenantId: string) {
    return this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: { subscriptionPlan: true },
    });
  }

  async upgradeSubscription(tenantId: string, planId: string) {
    const plan = await this.prisma.subscriptionPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException('Plan not found');
    
    const endsAt = new Date();
    if (plan.billingCycle === 'MONTHLY') endsAt.setMonth(endsAt.getMonth() + 1);
    else endsAt.setFullYear(endsAt.getFullYear() + 1);

    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: {
        subscriptionPlanId: planId,
        subscriptionEndsAt: endsAt,
        status: 'ACTIVE',
      },
      include: { subscriptionPlan: true },
    });
  }
}
