import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUrl()
  photoUrl: string;
}
