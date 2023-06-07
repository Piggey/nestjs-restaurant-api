import {
  ArrayMaxSize,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
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
  @IsPositive()
  age?: number;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
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
  @IsPositive({ each: true })
  @ArrayMaxSize(16 * 1024 * 1024)
  resumee?: Buffer | null;
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
  @IsPositive()
  prefferedSalary?: number;
}
