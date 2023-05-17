import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  userId: number;
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
}
