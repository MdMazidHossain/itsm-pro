import { Controller, Get, Post, Patch, Body, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('tickets')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  findAll(@Req() req: Request & { user: any }) {
    return this.ticketsService.findAll(req.user.tenantId, req.user.userId, req.user.role);
  }

  @Get('stats')
  getStats(@Req() req: Request & { user: any }) {
    return this.ticketsService.getStats(req.user.tenantId);
  }

  @Get('technicians')
  getTechnicians(@Req() req: Request & { user: any }) {
    return this.ticketsService.getTechnicians(req.user.tenantId);
  }

  @Get(':id')
  findOne(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.ticketsService.findOne(req.user.tenantId, id);
  }

  @Post()
  create(@Req() req: Request & { user: any }, @Body() data: any) {
    return this.ticketsService.create(req.user.tenantId, req.user.userId, data);
  }

  @Patch(':id/assign')
  assign(@Req() req: Request & { user: any }, @Param('id') id: string, @Body() data: { assignedToId: string }) {
    return this.ticketsService.assign(req.user.tenantId, id, data.assignedToId);
  }

  @Patch(':id/status')
  updateStatus(@Req() req: Request & { user: any }, @Param('id') id: string, @Body() data: { status: string }) {
    return this.ticketsService.updateStatus(req.user.tenantId, id, data.status);
  }

  @Post(':id/comments')
  addComment(
    @Req() req: Request & { user: any },
    @Param('id') id: string,
    @Body() data: { message: string; isInternal?: boolean },
  ) {
    return this.ticketsService.addComment(req.user.tenantId, id, req.user.userId, data.message, data.isInternal || false);
  }
}
