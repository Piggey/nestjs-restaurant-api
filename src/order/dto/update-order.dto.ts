import {
  IsArray,
  IsEmail,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateAddressTypeDto } from '../../address-type/dto/update-address-type.dto';
import { UpdateMenuItemTypeDto } from '../../menu-item-type/dto/update-menu-item-type.dto';

export class UpdateOrderDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsEmail()
  userEmail?: string;
  @ApiProperty({
    required: false,
    nullable: true,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressTypeDto)
  address?: UpdateAddressTypeDto | null;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  @IsOptional()
  @IsInt()
  restaurantId?: number;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateMenuItemTypeDto)
  orderedItems?: UpdateMenuItemTypeDto[];
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  totalPrice?: number;
}
