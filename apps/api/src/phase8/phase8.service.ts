import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class Phase8Service {
  constructor(private prisma: PrismaService) {}

  async getSLAs(tenantId: string) {
    return this.prisma.sLA.findMany({ where: { tenantId } });
  }

  async createSLA(tenantId: string, data: any) {
    return this.prisma.sLA.create({ data: { ...data, tenantId } });
  }

  async getMaintenance(tenantId: string) {
    return this.prisma.maintenanceSchedule.findMany({ where: { tenantId }, orderBy: { scheduledAt: 'asc' } });
  }

  async createMaintenance(tenantId: string, data: any) {
    return this.prisma.maintenanceSchedule.create({ data: { ...data, scheduledAt: new Date(data.scheduledAt), tenantId } });
  }

  async getLicenses(tenantId: string) {
    return this.prisma.softwareLicense.findMany({ where: { tenantId } });
  }

  async createLicense(tenantId: string, data: any) {
    return this.prisma.softwareLicense.create({ data: { ...data, tenantId } });
  }

  async getArticles(tenantId: string) {
    return this.prisma.knowledgeBase.findMany({ where: { tenantId }, orderBy: { createdAt: 'desc' } });
  }

  async createArticle(tenantId: string, data: any) {
    return this.prisma.knowledgeBase.create({ data: { ...data, tenantId } });
  }
}
