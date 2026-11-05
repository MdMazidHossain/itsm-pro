import { Controller, Get, Post, Body, Req, UseGuards, Headers, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('devices')
export class DevicesController {
  constructor(
    private readonly devicesService: DevicesService,
    private readonly prisma: PrismaService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard, TenantGuard)
  findAll(@Req() req: Request & { user: any }) {
    return this.devicesService.findAll(req.user.tenantId);
  }

  // এই এন্ডপয়েন্টটি এজেন্টের জন্য, JWT ছাড়াই কাজ করবে
  @Post('register')
  async register(@Body() data: any, @Headers('x-tenant-id') tenantId: string) {
    if (!tenantId) {
      throw new UnauthorizedException('Tenant ID required');
    }
    return this.devicesService.register(tenantId, data);
  }

  @Post('heartbeat')
  async heartbeat(@Body() data: { agentId: string }) {
    return this.devicesService.heartbeat(data.agentId);
  }
}
