import { ApiProperty } from '@nestjs/swagger';
import { Manager } from '../entities/manager.entity';

export class FetchManagersResponse {
  @ApiProperty({ type: [Manager] })
  managers: Manager[];
}
