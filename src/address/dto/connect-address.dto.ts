import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  addressId: string;
}
