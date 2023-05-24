import { Role } from '@prisma/client';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  minSalary?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  maxSalary?: number;
  @ApiProperty({
    enum: Role,
    required: false,
  })
  @IsOptional()
  role?: Role;
}
