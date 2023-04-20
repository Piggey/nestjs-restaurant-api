import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';

export class User {
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  userDetails: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  loyaltyPoints: number;
  @ApiProperty({
    enum: Role,
    required: false,
  })
  role: Role;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  employeeInfo?: Employee[];
}
