import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TroubleshootingService {
  constructor(private prisma: PrismaService) {}

  async runDiagnostics(tenantId: string) {
    const devices = await this.prisma.device.findMany({
      where: { tenantId },
    });

    const newDiagnostics = [];

    for (const device of devices) {
      if (device.cpuUsage && device.cpuUsage > 80) {
        const existing = await this.prisma.diagnostic.findFirst({
          where: {
            tenantId,
            deviceId: device.id,
            category: 'HIGH_CPU',
            isResolved: false,
          },
        });

        if (!existing) {
          const diag = await this.prisma.diagnostic.create({
            data: {
              tenantId,
              deviceId: device.id,
              title: 'High CPU Usage Detected',
              description: `Device ${device.hostname} has CPU usage at ${device.cpuUsage}%`,
              severity: device.cpuUsage > 95 ? 'CRITICAL' : 'WARNING',
              category: 'HIGH_CPU',
              metadata: { cpuUsage: device.cpuUsage },
            },
          });
          newDiagnostics.push(diag);
        }
      }

      if (device.ramUsage && device.ramUsage > 85) {
        const existing = await this.prisma.diagnostic.findFirst({
          where: { tenantId, deviceId: device.id, category: 'HIGH_RAM', isResolved: false },
        });
        if (!existing) {
          const diag = await this.prisma.diagnostic.create({
            data: {
              tenantId,
              deviceId: device.id,
              title: 'High RAM Usage Detected',
              description: `Device ${device.hostname} has RAM usage at ${device.ramUsage}%`,
              severity: device.ramUsage > 95 ? 'CRITICAL' : 'WARNING',
              category: 'HIGH_RAM',
              metadata: { ramUsage: device.ramUsage },
            },
          });
          newDiagnostics.push(diag);
        }
      }

      if (device.diskUsage && device.diskUsage > 90) {
        const existing = await this.prisma.diagnostic.findFirst({
          where: { tenantId, deviceId: device.id, category: 'LOW_DISK', isResolved: false },
        });
        if (!existing) {
          const diag = await this.prisma.diagnostic.create({
            data: {
              tenantId,
              deviceId: device.id,
              title: 'Low Disk Space Detected',
              description: `Device ${device.hostname} has disk usage at ${device.diskUsage}%`,
              severity: 'CRITICAL',
              category: 'LOW_DISK',
              metadata: { diskUsage: device.diskUsage },
            },
          });
          newDiagnostics.push(diag);
        }
      }

      if (device.status === 'OFFLINE') {
        const existing = await this.prisma.diagnostic.findFirst({
          where: { tenantId, deviceId: device.id, category: 'DEVICE_OFFLINE', isResolved: false },
        });
        if (!existing) {
          const diag = await this.prisma.diagnostic.create({
            data: {
              tenantId,
              deviceId: device.id,
              title: 'Device Offline',
              description: `Device ${device.hostname} is offline`,
              severity: 'CRITICAL',
              category: 'DEVICE_OFFLINE',
            },
          });
          newDiagnostics.push(diag);
        }
      }
    }

    return { newDiagnostics, totalDiagnostics: await this.getDiagnostics(tenantId) };
  }

  async getDiagnostics(tenantId: string) {
    return this.prisma.diagnostic.findMany({
      where: { tenantId },
      include: { device: true, remediations: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async resolveDiagnostic(tenantId: string, diagnosticId: string) {
    return this.prisma.diagnostic.update({
      where: { id: diagnosticId },
      data: { isResolved: true, resolvedAt: new Date() },
    });
  }

  async createRemediation(tenantId: string, diagnosticId: string, actionName: string) {
    return this.prisma.remediationAction.create({
      data: { tenantId, diagnosticId, actionName },
    });
  }

  async approveRemediation(tenantId: string, remediationId: string, userId: string) {
    return this.prisma.remediationAction.update({
      where: { id: remediationId },
      data: { status: 'APPROVED', approvedById: userId },
    });
  }
}
