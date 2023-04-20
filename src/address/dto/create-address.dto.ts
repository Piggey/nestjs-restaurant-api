import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  streetNo: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  postalCode: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;
}
