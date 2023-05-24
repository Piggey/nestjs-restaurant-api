import {
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateJobApplicationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  @IsNotEmpty()
  @IsInt()
  @IsPositive()
  age: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  aboutMe?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  resumee?: Buffer;
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
  @IsPositive()
  prefferedSalary: number;
}
