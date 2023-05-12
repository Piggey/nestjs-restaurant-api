import {
  IsArray,
  IsNumber,
  IsOptional,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UpdateClientTypeDto } from '../../clientType/dto/update-clientType.dto';
import { UpdateAddressTypeDto } from '../../addressType/dto/update-addressType.dto';
import { UpdateMenuItemTypeDto } from '../../menuItemType/dto/update-menuItemType.dto';

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
