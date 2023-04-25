import { ApiProperty } from '@nestjs/swagger';
import { Manager } from '../entities/manager.entity';

export class ManagerUpdatedResponse {
  @ApiProperty()
  managerUpdated: boolean;

  @ApiProperty()
  managerData: Manager;
}
