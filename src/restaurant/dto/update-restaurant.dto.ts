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
import { ConnectEmployeeDto } from '../../employee/dto/connect-employee.dto';
import { CreateAddressDto } from '../../address/dto/create-address.dto';
import { ConnectAddressDto } from '../../address/dto/connect-address.dto';

export class UpdateRestaurantManagerRelationInputDto {
  @ApiProperty({
    type: ConnectEmployeeDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ConnectEmployeeDto)
  connect: ConnectEmployeeDto;
}
export class UpdateRestaurantAddressRelationInputDto {
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
  ConnectEmployeeDto,
  UpdateRestaurantManagerRelationInputDto,
  CreateAddressDto,
  ConnectAddressDto,
  UpdateRestaurantAddressRelationInputDto,
)
export class UpdateRestaurantDto {
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLatitude()
  geoLat?: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsLongitude()
  geoLong?: number;
  @ApiProperty({
    required: false,
    nullable: true,
    type: UpdateRestaurantManagerRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRestaurantManagerRelationInputDto)
  manager?: UpdateRestaurantManagerRelationInputDto;
  @ApiProperty({
    required: false,
    type: UpdateRestaurantAddressRelationInputDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateRestaurantAddressRelationInputDto)
  address?: UpdateRestaurantAddressRelationInputDto;
}
