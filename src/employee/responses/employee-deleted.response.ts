import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../entities/employee.entity';

export class EmployeeDeletedResponse {
  @ApiProperty()
  employeeDeleted: boolean;

  @ApiProperty()
  employeeData: Employee;
}
