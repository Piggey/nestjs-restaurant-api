import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectOpeningHoursDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  openingHoursId: string;
}
