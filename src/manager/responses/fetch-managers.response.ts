import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';

export class FetchManagersResponse {
  @ApiProperty({ type: [Employee] })
  managers: Employee[];
}
