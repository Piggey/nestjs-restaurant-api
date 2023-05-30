import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConnectRestaurantDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  restaurantId: string;
}
