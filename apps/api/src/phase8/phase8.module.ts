import { Module } from '@nestjs/common';
import { Phase8Controller } from './phase8.controller';
import { Phase8Service } from './phase8.service';

@Module({
  controllers: [Phase8Controller],
  providers: [Phase8Service],
  exports: [Phase8Service],
})
export class Phase8Module {}
