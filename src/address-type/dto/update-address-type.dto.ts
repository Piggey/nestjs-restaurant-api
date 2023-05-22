import { IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAddressTypeDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  street?: string;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  @IsOptional()
  @IsInt()
  houseNumber?: number;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  apartment?: number | null;
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
