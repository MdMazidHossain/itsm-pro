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
import { Phase8Module } from './phase8/phase8.module';
import { TroubleshootingModule } from './troubleshooting/troubleshooting.module';

@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    AssetsModule,
    DevicesModule,
    BillingModule,
    Phase8Module,
    TroubleshootingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

