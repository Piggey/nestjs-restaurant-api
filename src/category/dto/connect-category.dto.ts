import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
