import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty({
    required: false,
  })
  employeeId: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  hiredAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  firedAt: Date | null;
  @ApiProperty({
    required: false,
  })
  firstName: string;
  @ApiProperty({
    required: false,
  })
  lastName: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  salary: number;
}
