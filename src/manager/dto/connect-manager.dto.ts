import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectManagerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  managerId: string;
}
