import { Controller, Get, Post, Body, Param, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { TroubleshootingService } from './troubleshooting.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TenantGuard } from '../auth/tenant.guard';

@Controller('troubleshooting')
@UseGuards(JwtAuthGuard, TenantGuard)
export class TroubleshootingController {
  constructor(private readonly troubleshootingService: TroubleshootingService) {}

  @Post('scan')
  runScan(@Req() req: Request & { user: any }) {
    return this.troubleshootingService.runDiagnostics(req.user.tenantId);
  }

  @Get('diagnostics')
  getDiagnostics(@Req() req: Request & { user: any }) {
    return this.troubleshootingService.getDiagnostics(req.user.tenantId);
  }

  @Post('diagnostics/:id/resolve')
  resolve(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.troubleshootingService.resolveDiagnostic(req.user.tenantId, id);
  }

  @Post('remediation')
  createRemediation(@Req() req: Request & { user: any }, @Body() data: { diagnosticId: string; actionName: string }) {
    return this.troubleshootingService.createRemediation(req.user.tenantId, data.diagnosticId, data.actionName);
  }

  @Post('remediation/:id/approve')
  approveRemediation(@Req() req: Request & { user: any }, @Param('id') id: string) {
    return this.troubleshootingService.approveRemediation(req.user.tenantId, id, req.user.userId);
  }
}
