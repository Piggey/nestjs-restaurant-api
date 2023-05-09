import { Test, TestingModule } from '@nestjs/testing';
import { ManagerService } from './manager.service';
import { PostgresModule } from '../postgres/postgres.module';

describe('ManagerService', () => {
  let service: ManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PostgresModule],
      providers: [ManagerService],
    }).compile();

    service = module.get<ManagerService>(ManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
