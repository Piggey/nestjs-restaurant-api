import { Test, TestingModule } from '@nestjs/testing';
import { PostgresService } from './postgres.service';
import { ConfigModule } from '@nestjs/config';

describe('PrismaService', () => {
  let service: PostgresService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      providers: [PostgresService],
    }).compile();

    service = module.get<PostgresService>(PostgresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
