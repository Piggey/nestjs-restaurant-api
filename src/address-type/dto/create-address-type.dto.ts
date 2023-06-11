import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  houseNumber: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  apartment?: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;
}
