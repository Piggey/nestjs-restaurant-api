import { IsByteLength, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectUserDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsByteLength(32, 32)
  userId: string;
}
