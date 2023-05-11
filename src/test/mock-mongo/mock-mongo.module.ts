import { Module } from '@nestjs/common';
import { MockMongoService } from './mock-mongo.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MockMongoService],
  exports: [MockMongoService],
})
export class MockMongoModule {}
