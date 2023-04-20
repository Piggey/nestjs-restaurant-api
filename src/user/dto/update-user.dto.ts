import { IsByteLength, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(32, 32)
  userId?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  userDetails?: string;
}
