import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryName?: string;
}
