import {
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ConnectManagerDto } from '../../manager/dto/connect-manager.dto';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { ConnectAddressDto } from '../../address/dto/connect-address.dto';

export class CreateRestaurantManagerRelationInputDto {
  @ApiProperty({
    type: ConnectManagerDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectManagerDto)
  connect: ConnectManagerDto;
}
export class CreateRestaurantAddressRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressDto)
  create?: CreateAddressDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectAddressDto)
  connect?: ConnectAddressDto;
}

@ApiExtraModels(
  ConnectManagerDto,
  CreateRestaurantManagerRelationInputDto,
  CreateAddressDto,
  ConnectAddressDto,
  CreateRestaurantAddressRelationInputDto,
)
export class CreateRestaurantDto {
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsLatitude()
  geoLat: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsLongitude()
  geoLong: number;
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateRestaurantManagerRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRestaurantManagerRelationInputDto)
  manager?: CreateRestaurantManagerRelationInputDto;
  @ApiProperty({
    type: CreateRestaurantAddressRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateRestaurantAddressRelationInputDto)
  address: CreateRestaurantAddressRelationInputDto;
}
