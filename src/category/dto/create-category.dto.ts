import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryName: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  photoUrl: string;
}
