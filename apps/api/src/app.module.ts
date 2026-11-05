import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { AssetsModule } from './assets/assets.module';
import { DevicesModule } from './devices/devices.module';
import { BillingModule } from './billing/billing.module';
import { TroubleshootingModule } from './troubleshooting/troubleshooting.module';
import { Phase8Module } from './phase8/phase8.module';
import { TicketsModule } from './tickets/tickets.module';
import { SuperAdminModule } from './superadmin/superadmin.module';

@Module({
  imports: [
    PrismaModule, HealthModule, AuthModule, UsersModule, AssetsModule,
    DevicesModule, BillingModule, TroubleshootingModule, Phase8Module,
    TicketsModule, SuperAdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
