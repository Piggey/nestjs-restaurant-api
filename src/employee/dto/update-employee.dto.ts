import {
  IsByteLength,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateRestaurantDto } from '../../restaurant/dto/create-restaurant.dto';
import { ConnectRestaurantDto } from '../../restaurant/dto/connect-restaurant.dto';

export class UpdateEmployeeRestaurantRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateRestaurantDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRestaurantDto)
  create?: CreateRestaurantDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectRestaurantDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectRestaurantDto)
  connect?: ConnectRestaurantDto;
}

@ApiExtraModels(
  CreateRestaurantDto,
  ConnectRestaurantDto,
  UpdateEmployeeRestaurantRelationInputDto,
)
export class UpdateEmployeeDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  firedAt?: Date | null;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  lastName?: string;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsByteLength(11, 11)
  pesel?: string;
  @ApiProperty({
    required: false,
    type: UpdateEmployeeRestaurantRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateEmployeeRestaurantRelationInputDto)
  restaurant?: UpdateEmployeeRestaurantRelationInputDto;
}
