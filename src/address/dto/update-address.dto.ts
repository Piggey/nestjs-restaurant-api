import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  streetNo?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  city?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  postalCode?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  country?: string;
}
