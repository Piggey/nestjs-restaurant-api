import { Module } from '@nestjs/common';
import { PostgresService } from './postgres.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [PostgresService],
  exports: [PostgresService],
})
export class PostgresModule {}
