import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  itemId: string;
}
