import { ApiProperty } from '@nestjs/swagger';
import { ManagerDataResponse } from '.';

export class FetchManagersResponse {
  @ApiProperty()
  managers: ManagerDataResponse[];
}
