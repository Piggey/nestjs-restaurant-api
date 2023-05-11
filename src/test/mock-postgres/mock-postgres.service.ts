import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class MockPostgresService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super({ datasources: { db: { url: config.get('POSTGRES_MOCK_DB_URL') } } });
  }
}
