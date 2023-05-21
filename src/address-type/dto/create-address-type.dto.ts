import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAddressTypeDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  street: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  @IsNotEmpty()
  @IsInt()
  houseNumber: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  apartment?: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  city: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  country: string;
}
