import { ApiProperty } from '@nestjs/swagger';

export class JobApplication {
  @ApiProperty({
    required: false,
  })
  id: string;
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
  resumee: string | null;
  @ApiProperty({
    required: false,
  })
  jobTitle: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  prefferedSalary: number;
}
