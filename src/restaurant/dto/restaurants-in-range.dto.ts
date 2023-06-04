import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsLatitude,
  IsLongitude,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class RestaurantsInRangeDto {
  @ApiProperty({ type: Number, minimum: 1, required: false })
  @IsOptional()
  @Transform((n) => parseInt(n.value))
  @IsPositive()
  rangeKm = 10;

  @ApiProperty()
  @IsLatitude()
  userLat: number;

  @ApiProperty()
  @IsLongitude()
  userLon: number;
}
