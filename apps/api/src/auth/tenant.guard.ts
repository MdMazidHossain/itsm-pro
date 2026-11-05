import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.tenantId) {
      throw new ForbiddenException('No tenant context found');
    }

    // Request-এ tenantId স্বয়ংক্রিয়ভাবে যোগ করুন
    request.tenantId = user.tenantId;
    return true;
  }
}