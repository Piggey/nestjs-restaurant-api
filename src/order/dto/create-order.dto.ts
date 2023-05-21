import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CreateAddressTypeDto } from '../../address-type/dto/create-address-type.dto';
import { CreateMenuItemTypeDto } from '../../menu-item-type/dto/create-menu-item-type.dto';

export class CreateOrderDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  userEmail: string;
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
