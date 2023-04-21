import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class FetchEmployeesResponse {
  @ApiProperty({ type: [Employee] })
  employees: Employee[];
}
