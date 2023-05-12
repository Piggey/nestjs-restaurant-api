import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateClientTypeDto } from '../../clientType/dto/create-clientType.dto';
import { CreateAddressTypeDto } from '../../addressType/dto/create-addressType.dto';
import { CreateMenuItemTypeDto } from '../../menuItemType/dto/create-menuItemType.dto';

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
