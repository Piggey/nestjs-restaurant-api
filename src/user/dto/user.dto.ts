import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
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
}
