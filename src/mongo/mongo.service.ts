import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// hacking up so that we can access both postgres and mongodb through prisma
import { PrismaClient } from '../../node_modules/@prisma-mongo/prisma/client';

@Injectable()
export class MongoService extends PrismaClient {
  constructor(private readonly config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('MONGODB_URL'),
        },
      },
    });
  }
}
