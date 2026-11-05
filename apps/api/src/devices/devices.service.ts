import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DevicesService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.device.findMany({
      where: { tenantId },
      orderBy: { lastHeartbeat: 'desc' },
    });
  }

  async register(tenantId: string, data: any) {
    return this.prisma.device.upsert({
      where: { agentId: data.agentId },
      update: {
        hostname: data.hostname,
        osInfo: data.osInfo,
        ipAddress: data.ipAddress,
        cpuUsage: data.cpuUsage,
        ramUsage: data.ramUsage,
        diskUsage: data.diskUsage,
        lastHeartbeat: new Date(),
        status: 'ONLINE',
      },
      create: {
        tenantId,
        hostname: data.hostname,
        agentId: data.agentId,
        osInfo: data.osInfo,
        ipAddress: data.ipAddress,
        cpuUsage: data.cpuUsage,
        ramUsage: data.ramUsage,
        diskUsage: data.diskUsage,
      },
    });
  }

  async heartbeat(agentId: string) {
    return this.prisma.device.update({
      where: { agentId },
      data: { lastHeartbeat: new Date(), status: 'ONLINE' },
    });
  }
}