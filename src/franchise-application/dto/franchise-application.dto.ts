import { ApiProperty } from '@nestjs/swagger';

export class FranchiseApplicationDto {
  @ApiProperty({
    required: false,
  })
  id: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    required: false,
  })
  respondedTo: boolean;
  @ApiProperty({
    required: false,
  })
  firstName: string;
  @ApiProperty({
    required: false,
  })
  lastName: string;
  @ApiProperty({
    required: false,
  })
  phoneNumber: string;
  @ApiProperty({
    required: false,
  })
  email: string;
  @ApiProperty({
    required: false,
  })
  aboutMe: string;
  @ApiProperty({
    required: false,
  })
  reasonForOpening: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  longitude: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  latitude: number;
}
