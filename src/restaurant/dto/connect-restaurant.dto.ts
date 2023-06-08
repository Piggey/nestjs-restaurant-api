import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectRestaurantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  restaurantId: string;
}
