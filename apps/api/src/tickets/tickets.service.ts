import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, userId: string, role: string) {
    const where: any = { tenantId };

    // Technician: Only show assigned tickets
    if (role === 'TECHNICIAN') {
      where.assignedToId = userId;
    }
    // Employee: Only show own tickets
    else if (role === 'EMPLOYEE') {
      where.createdById = userId;
    }
    // Company Admin: Show all

    return this.prisma.ticket.findMany({
      where,
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        _count: { select: { comments: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(tenantId: string, id: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: { id, tenantId },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        comments: {
          include: {
            user: { select: { id: true, firstName: true, lastName: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async create(tenantId: string, userId: string, data: any) {
    const count = await this.prisma.ticket.count({ where: { tenantId } });
    const ticketNumber = `TKT-${Date.now()}-${count + 1}`;

    return this.prisma.ticket.create({
      data: {
        tenantId,
        ticketNumber,
        subject: data.subject,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        category: data.category,
        createdById: userId,
        slaDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
      include: {
        createdBy: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    });
  }

  async assign(tenantId: string, id: string, assignedToId: string) {
    return this.prisma.ticket.update({
      where: { id },
      data: { assignedToId, status: 'IN_PROGRESS' },
    });
  }

  async updateStatus(tenantId: string, id: string, status: any) {
    const data: any = { status };
    if (status === 'RESOLVED') data.resolvedAt = new Date();
    if (status === 'CLOSED') data.closedAt = new Date();

    return this.prisma.ticket.update({
      where: { id },
      data,
    });
  }

  async addComment(tenantId: string, ticketId: string, userId: string, message: string, isInternal: boolean) {
    return this.prisma.ticketComment.create({
      data: { ticketId, userId, message, isInternal },
      include: {
        user: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async getTechnicians(tenantId: string) {
    return this.prisma.user.findMany({
      where: { tenantId, role: 'TECHNICIAN', status: 'ACTIVE' },
      select: { id: true, firstName: true, lastName: true, email: true },
    });
  }

  async getStats(tenantId: string) {
    const [total, open, inProgress, resolved] = await Promise.all([
      this.prisma.ticket.count({ where: { tenantId } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'OPEN' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'IN_PROGRESS' } }),
      this.prisma.ticket.count({ where: { tenantId, status: 'RESOLVED' } }),
    ]);

    return { total, open, inProgress, resolved };
  }
}
