import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MockMongoService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super({ datasources: { db: { url: config.get('MONGODB_MOCK_DB_URL') } } });
  }
}
