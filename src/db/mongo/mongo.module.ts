import { Module } from '@nestjs/common';
import { MongoService } from './mongo.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule {}
