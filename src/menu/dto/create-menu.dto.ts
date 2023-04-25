import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateCategoryDto } from '../../category/dto/create-category.dto';
import { ConnectCategoryDto } from '../../category/dto/connect-category.dto';

export class CreateMenuCategoryRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateCategoryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCategoryDto)
  create?: CreateCategoryDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectCategoryDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectCategoryDto)
  connect?: ConnectCategoryDto;
}

@ApiExtraModels(
  CreateCategoryDto,
  ConnectCategoryDto,
  CreateMenuCategoryRelationInputDto,
)
export class CreateMenuDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  photoUrl: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  description: string;
  @ApiProperty({
    description: 'a list of ingredients separated by `,`',
  })
  @IsNotEmpty()
  @IsString()
  ingredients: string;
  @ApiProperty({
    type: CreateMenuCategoryRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateMenuCategoryRelationInputDto)
  category: CreateMenuCategoryRelationInputDto;
}
