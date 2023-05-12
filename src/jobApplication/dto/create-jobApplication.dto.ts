import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  age: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
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
  @IsString()
  resumee?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  jobTitle: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  @IsNotEmpty()
  @IsInt()
  prefferedSalary: number;
}
