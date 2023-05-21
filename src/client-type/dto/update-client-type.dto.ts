import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateClientTypeDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  userId?: string;
}
