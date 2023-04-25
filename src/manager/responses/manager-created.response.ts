import { ApiProperty } from '@nestjs/swagger';
import { Manager } from '../entities/manager.entity';

export class ManagerCreatedResponse {
  @ApiProperty()
  managerCreated: boolean;

  @ApiProperty()
  managerData: Manager;
}
