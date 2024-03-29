import { Role } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class JobDto {
  @ApiProperty({
    required: false,
  })
  jobId: string;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  updatedAt: Date;
  @ApiProperty({
    required: false,
  })
  jobTitle: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  minSalary: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  maxSalary: number;
  @ApiProperty({
    enum: Role,
    required: false,
  })
  role: Role;
}
