import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class UserDataResponse {
  @ApiProperty({
    description: 'username or email address of the user',
    example: 'username',
  })
  userDetails: string;

  @ApiProperty({
    description: 'access level of user',
    example: 'CLIENT',
  })
  userRole: Role;

  @ApiProperty({
    description: 'whole number of loyalty points that user aquired',
    example: 36,
  })
  loyaltyPoints: number;
}
