import { Role } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  jobTitle: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  minSalary: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  maxSalary: number;
  @ApiProperty({
    enum: Role,
  })
  @IsNotEmpty()
  role: Role;
}
