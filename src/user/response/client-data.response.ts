import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class ClientDataResponse {
  @ApiProperty({
    description: "user's unique identifier",
    example: 'd75b260a64504067bfc5b2905e3b8182',
  })
  userId: string;

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

  @ApiProperty()
  createdAt: Date;
}
