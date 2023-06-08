import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { CreateEmployeeDto } from '../../employee/dto/create-employee.dto';
import { ConnectEmployeeDto } from '../../employee/dto/connect-employee.dto';

export class CreateManagerEmployeeRelationInputDto {
  @ApiProperty({
    required: false,
    nullable: true,
    type: CreateEmployeeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateEmployeeDto)
  create?: CreateEmployeeDto;
  @ApiProperty({
    required: false,
    nullable: true,
    type: ConnectEmployeeDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ConnectEmployeeDto)
  connect?: ConnectEmployeeDto;
}

@ApiExtraModels(
  CreateEmployeeDto,
  ConnectEmployeeDto,
  CreateManagerEmployeeRelationInputDto,
)
export class CreateManagerDto {
  @ApiProperty({
    type: CreateManagerEmployeeRelationInputDto,
  })
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CreateManagerEmployeeRelationInputDto)
  employee: CreateManagerEmployeeRelationInputDto;
}
