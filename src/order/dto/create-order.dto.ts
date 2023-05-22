import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateClientTypeDto } from '../../client-type/dto/create-client-type.dto';
import { CreateAddressTypeDto } from '../../address-type/dto/create-address-type.dto';
import { CreateMenuItemTypeDto } from '../../menu-item-type/dto/create-menu-item-type.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateClientTypeDto)
  client: CreateClientTypeDto;
  @ApiProperty()
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateAddressTypeDto)
  address: CreateAddressTypeDto;
  @ApiProperty({
    isArray: true,
  })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemTypeDto)
  orderedItems: CreateMenuItemTypeDto[];
  @ApiProperty({
    type: 'number',
    format: 'float',
  })
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  totalPrice: number;
}
