import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Phase8Service } from './phase8.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('phase8')
@UseGuards(JwtAuthGuard, TenantGuard)
export class Phase8Controller {
  constructor(private readonly service: Phase8Service) {}

  @Get('slas')
  getSLAs(@Req() req: Request & { user: any }) { return this.service.getSLAs(req.user.tenantId); }

  @Post('slas')
  createSLA(@Req() req: Request & { user: any }, @Body() data: any) { return this.service.createSLA(req.user.tenantId, data); }

  @Get('maintenance')
  getMaintenance(@Req() req: Request & { user: any }) { return this.service.getMaintenance(req.user.tenantId); }

  @Post('maintenance')
  createMaintenance(@Req() req: Request & { user: any }, @Body() data: any) { return this.service.createMaintenance(req.user.tenantId, data); }

  @Get('licenses')
  getLicenses(@Req() req: Request & { user: any }) { return this.service.getLicenses(req.user.tenantId); }

  @Post('licenses')
  createLicense(@Req() req: Request & { user: any }, @Body() data: any) { return this.service.createLicense(req.user.tenantId, data); }

  @Get('kb')
  getArticles(@Req() req: Request & { user: any }) { return this.service.getArticles(req.user.tenantId); }

  @Post('kb')
  createArticle(@Req() req: Request & { user: any }, @Body() data: any) { return this.service.createArticle(req.user.tenantId, data); }
}
