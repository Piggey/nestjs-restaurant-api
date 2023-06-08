import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  itemId: string;
}
