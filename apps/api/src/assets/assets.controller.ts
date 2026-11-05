import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('assets')
@UseGuards(JwtAuthGuard, TenantGuard)
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll(@Req() req: Request & { user: any }) {
    return this.assetsService.findAll(req.user.tenantId);
  }

  @Post()
  create(@Req() req: Request & { user: any }, @Body() data: any) {
    return this.assetsService.create(req.user.tenantId, data);
  }
}
