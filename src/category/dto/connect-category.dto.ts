import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectCategoryDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  categoryId: string;
}
