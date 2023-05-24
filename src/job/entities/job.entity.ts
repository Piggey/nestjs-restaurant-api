import { ApiProperty } from '@nestjs/swagger';
import { Employee } from '../../employee/entities/employee.entity';

export class Job {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  jobId: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  createdAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  updatedAt: Date;
  @ApiProperty({
    required: false,
  })
  jobTitle: string;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  minSalary: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  maxSalary: number;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  employees?: Employee[];
}
