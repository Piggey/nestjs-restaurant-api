import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectAddressDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  addressId: string;
}
