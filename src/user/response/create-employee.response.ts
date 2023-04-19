import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDataResponse } from './employee-data.response';

export class CreateEmployeeResponse {
  @ApiProperty()
  employeeCreated: boolean;

  @ApiProperty()
  employee: EmployeeDataResponse;
}
