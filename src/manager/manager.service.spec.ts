import { Test, TestingModule } from '@nestjs/testing';
import { ManagerService } from './manager.service';
import { PrismaModule } from '../prisma/prisma.module';

describe('ManagerService', () => {
  let service: ManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [ManagerService],
    }).compile();

    service = module.get<ManagerService>(ManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
