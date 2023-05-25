import {
  IsEmail,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFranchiseApplicationDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  aboutMe: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  reasonForOpening: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  longitude: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  latitude: number;
}
