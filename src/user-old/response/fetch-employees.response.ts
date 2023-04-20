import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDataResponse } from './employee-data.response';

export class FetchEmployeesResponse {
  @ApiProperty({ type: [EmployeeDataResponse] })
  employees: EmployeeDataResponse[];
}
