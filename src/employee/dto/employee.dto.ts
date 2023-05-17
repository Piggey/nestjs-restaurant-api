import { ApiProperty } from '@nestjs/swagger';

export class EmployeeDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  employeeId: number;
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
}
