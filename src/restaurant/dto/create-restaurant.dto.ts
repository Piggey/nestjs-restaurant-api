import {
  IsArray,
  IsLatitude,
  IsLongitude,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { ConnectManagerDto } from '../../manager/dto/connect-manager.dto';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { ConnectAddressDto } from '../../address/dto/connect-address.dto';
import { CreateOpeningHoursDto } from '../../opening-hours/dto/create-opening-hours.dto';

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
export class CreateRestaurantOpeningHoursRelationInputDto {
  @ApiProperty({
    isArray: true,
    type: CreateOpeningHoursDto,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOpeningHoursDto)
  create: CreateOpeningHoursDto[];
}

@ApiExtraModels(
  ConnectManagerDto,
  CreateRestaurantManagerRelationInputDto,
  CreateAddressDto,
  ConnectAddressDto,
  CreateRestaurantAddressRelationInputDto,
  CreateOpeningHoursDto,
  CreateRestaurantOpeningHoursRelationInputDto,
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
  geoLon: number;
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
  @ApiProperty({
    type: CreateRestaurantOpeningHoursRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRestaurantOpeningHoursRelationInputDto)
  openingHours?: CreateRestaurantOpeningHoursRelationInputDto;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  photoUrl?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber()
  phoneNumber?: string;
}
