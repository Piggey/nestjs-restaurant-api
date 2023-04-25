import { ApiProperty } from '@nestjs/swagger';
import { Manager } from '../entities/manager.entity';

export class ManagerDeletedResponse {
  @ApiProperty()
  managerDeleted: boolean;

  @ApiProperty()
  managerData: Manager;
}
