import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateClientTypeDto } from '../../client-type/dto/update-client-type.dto';
import { UpdateAddressTypeDto } from '../../address-type/dto/update-address-type.dto';
import { UpdateMenuItemTypeDto } from '../../menu-item-type/dto/update-menu-item-type.dto';

export class UpdateOrderDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateClientTypeDto)
  client?: UpdateClientTypeDto;
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateAddressTypeDto)
  address?: UpdateAddressTypeDto;
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
