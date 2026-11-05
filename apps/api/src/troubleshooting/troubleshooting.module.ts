import { Module } from '@nestjs/common';
import { TroubleshootingController } from './troubleshooting.controller';
import { TroubleshootingService } from './troubleshooting.service';

@Module({
  controllers: [TroubleshootingController],
  providers: [TroubleshootingService],
  exports: [TroubleshootingService],
})
export class TroubleshootingModule {}
