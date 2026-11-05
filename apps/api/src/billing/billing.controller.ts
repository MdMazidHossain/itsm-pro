import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  getPlans() {
    return this.billingService.getPlans();
  }

  @Post('plans')
  @UseGuards(JwtAuthGuard, TenantGuard)
  createPlan(@Body() data: any) {
    return this.billingService.createPlan(data);
  }

  @Get('invoices')
  @UseGuards(JwtAuthGuard, TenantGuard)
  getInvoices(@Req() req: Request & { user: any }) {
    return this.billingService.getInvoices(req.user.tenantId);
  }

  @Post('invoices')
  @UseGuards(JwtAuthGuard, TenantGuard)
  createInvoice(@Req() req: Request & { user: any }, @Body() data: any) {
    return this.billingService.createInvoice(req.user.tenantId, data);
  }

  @Get('subscription')
  @UseGuards(JwtAuthGuard, TenantGuard)
  getSubscription(@Req() req: Request & { user: any }) {
    return this.billingService.getCurrentSubscription(req.user.tenantId);
  }

  @Post('upgrade')
  @UseGuards(JwtAuthGuard, TenantGuard)
  upgrade(@Req() req: Request & { user: any }, @Body() data: { planId: string }) {
    return this.billingService.upgradeSubscription(req.user.tenantId, data.planId);
  }
}
