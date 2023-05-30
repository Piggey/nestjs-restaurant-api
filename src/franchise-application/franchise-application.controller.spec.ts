import { Test, TestingModule } from '@nestjs/testing';
import { FranchiseApplicationController } from './franchise-application.controller';
import { FranchiseApplicationService } from './franchise-application.service';

describe('FranchiseApplicationController', () => {
  let controller: FranchiseApplicationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FranchiseApplicationController],
      providers: [FranchiseApplicationService],
    }).compile();

    controller = module.get<FranchiseApplicationController>(
      FranchiseApplicationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
