import { IsOptional, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  categoryName?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  photoUrl?: string;
}
