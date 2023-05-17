import { Test, TestingModule } from '@nestjs/testing';
import { ManagerController } from './manager.controller';
import { ManagerService } from './manager.service';
import { PostgresModule } from '../db/postgres/postgres.module';

describe('ManagerController', () => {
  let controller: ManagerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PostgresModule],
      controllers: [ManagerController],
      providers: [ManagerService],
    }).compile();

    controller = module.get<ManagerController>(ManagerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
