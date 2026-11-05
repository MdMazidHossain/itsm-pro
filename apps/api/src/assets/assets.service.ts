import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.asset.findMany({
      where: { tenantId },
      include: { assignedTo: { select: { id: true, firstName: true, lastName: true } } },
    });
  }

  async create(tenantId: string, data: any) {
    return this.prisma.asset.create({
      data: { ...data, tenantId },
    });
  }
}
