import { Module } from '@nestjs/common';
import { ManagerService } from './manager.service';
import { ManagerController } from './manager.controller';
import { PostgresModule } from '../db/postgres/postgres.module';

@Module({
  imports: [PostgresModule],
  controllers: [ManagerController],
  providers: [ManagerService],
})
export class ManagerModule {}
