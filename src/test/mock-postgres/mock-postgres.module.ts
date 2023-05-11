import { Module } from '@nestjs/common';
import { MockPostgresService } from './mock-postgres.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MockPostgresService],
  exports: [MockPostgresService],
})
export class MockPostgresModule {}
