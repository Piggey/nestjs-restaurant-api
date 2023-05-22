import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsMongoId()
  id: string;
}
