import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectOpeningHoursDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  openingHoursId: string;
}
