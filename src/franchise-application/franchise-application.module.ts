import { Module } from '@nestjs/common';
import { FranchiseApplicationService } from './franchise-application.service';
import { FranchiseApplicationController } from './franchise-application.controller';

@Module({
  controllers: [FranchiseApplicationController],
  providers: [FranchiseApplicationService]
})
export class FranchiseApplicationModule {}
