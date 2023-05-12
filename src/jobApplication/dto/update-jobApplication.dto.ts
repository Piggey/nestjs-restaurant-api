import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateJobApplicationDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  @IsOptional()
  @IsInt()
  age?: number;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  email?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  aboutMe?: string | null;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  resumee?: string | null;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  jobTitle?: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  @IsOptional()
  @IsInt()
  prefferedSalary?: number;
}
