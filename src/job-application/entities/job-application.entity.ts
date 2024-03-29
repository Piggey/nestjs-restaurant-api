import { ApiProperty } from '@nestjs/swagger';

export class JobApplication {
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
    type: 'integer',
    format: 'int32',
    required: false,
  })
  age: number;
  @ApiProperty({
    required: false,
  })
  email: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  aboutMe: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  resumee: Buffer | null;
  @ApiProperty({
    required: false,
  })
  jobTitle: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  prefferedSalary: number;
}
