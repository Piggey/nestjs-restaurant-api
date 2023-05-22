import {
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateAddressTypeDto)
  address?: CreateAddressTypeDto;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
  })
  @IsNotEmpty()
  @IsInt()
  restaurantId: number;
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
