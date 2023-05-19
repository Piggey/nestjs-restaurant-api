import { ApiProperty } from '@nestjs/swagger';
import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';

export class RestaurantsInRangeDto {
  @ApiProperty({ default: 10, minimum: 0, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Min(0)
  rangeKm = 10;

  @ApiProperty()
  @IsLatitude()
  userLat: number;

  @ApiProperty()
  @IsLongitude()
  userLon: number;
}
