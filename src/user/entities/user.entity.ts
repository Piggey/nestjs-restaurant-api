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
  userEmail: string;
  @ApiProperty({
    enum: Role,
    required: false,
  })
  userRole: Role;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  loyaltyPoints: number;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  employeeInfo?: Employee[];
}
