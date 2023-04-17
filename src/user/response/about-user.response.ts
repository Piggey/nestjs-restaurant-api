import { ApiProperty } from '@nestjs/swagger';
import { EmployeeDataResponse, UserDataResponse } from '.';

export class AboutUserResponse {
  @ApiProperty({ type: () => UserDataResponse })
  user: UserDataResponse;

  @ApiProperty({
    type: () => EmployeeDataResponse,
    description: 'only returned when user is also an employee',
    required: false,
  })
  employee?: EmployeeDataResponse;
}
