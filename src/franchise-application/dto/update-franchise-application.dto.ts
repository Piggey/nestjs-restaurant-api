import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateFranchiseApplicationDto {
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
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  aboutMe?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  reasonForOpening?: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  longitude?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  latitude?: number;
}
