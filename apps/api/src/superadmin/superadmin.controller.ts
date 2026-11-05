import { Controller, Get, Post, Patch, Body, Param, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { Request } from 'express';
import { SuperAdminService } from './superadmin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('superadmin')
@UseGuards(JwtAuthGuard)
export class SuperAdminController {
  constructor(private readonly service: SuperAdminService) {}

  private checkRole(req: Request & { user: any }) {
    if (req.user.role !== 'SUPER_ADMIN') {
      throw new ForbiddenException('Super Admin access required');
    }
  }

  @Get('stats')
  getStats(@Req() req: Request & { user: any }) {
    this.checkRole(req);
    return this.service.getStats();
  }

  @Get('tenants')
  getTenants(@Req() req: Request & { user: any }) {
    this.checkRole(req);
    return this.service.getAllTenants();
  }

  @Patch('tenants/:id/status')
  updateStatus(@Req() req: Request & { user: any }, @Param('id') id: string, @Body() data: { status: string }) {
    this.checkRole(req);
    return this.service.updateTenantStatus(id, data.status);
  }

  @Get('plans')
  getPlans(@Req() req: Request & { user: any }) {
    this.checkRole(req);
    return this.service.getSubscriptionPlans();
  }

  @Post('plans')
  createPlan(@Req() req: Request & { user: any }, @Body() data: any) {
    this.checkRole(req);
    return this.service.createPlan(data);
  }

  @Patch('plans/:id')
  updatePlan(@Req() req: Request & { user: any }, @Param('id') id: string, @Body() data: any) {
    this.checkRole(req);
    return this.service.updatePlan(id, data);
  }
}
