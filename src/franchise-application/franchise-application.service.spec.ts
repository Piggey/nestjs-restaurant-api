import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseApplicationService } from './franchise-application.service';

describe('FranchiseApplicationService', () => {
  let service: FranchiseApplicationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FranchiseApplicationService],
    }).compile();

    service = module.get<FranchiseApplicationService>(FranchiseApplicationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
