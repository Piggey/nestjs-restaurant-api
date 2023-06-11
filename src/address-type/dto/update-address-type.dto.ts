import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressTypeDto {
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
  houseNumber?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  apartment?: string | null;
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
  country?: string;
}
