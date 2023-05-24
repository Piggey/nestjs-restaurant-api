import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../address/entities/address.entity';
import { User } from '../../user/entities/user.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Job } from '../../job/entities/job.entity';
import { Manager } from '../../manager/entities/manager.entity';

export class Employee {
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  employeeId: number;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
  })
  hiredAt: Date;
  @ApiProperty({
    type: 'string',
    format: 'date-time',
    required: false,
    nullable: true,
  })
  firedAt: Date | null;
  @ApiProperty({
    required: false,
  })
  firstName: string;
  @ApiProperty({
    required: false,
  })
  lastName: string;
  @ApiProperty({
    required: false,
  })
  address?: Address;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  addressId: number;
  @ApiProperty({
    required: false,
  })
  user?: User;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  userId: number;
  @ApiProperty({
    required: false,
  })
  restaurant?: Restaurant;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  restaurantId: number;
  @ApiProperty({
    required: false,
  })
  job?: Job;
  @ApiProperty({
    type: 'integer',
    format: 'int32',
    required: false,
  })
  jobId: number;
  @ApiProperty({
    type: 'number',
    format: 'float',
    required: false,
  })
  salary: number;
  @ApiProperty({
    isArray: true,
    required: false,
  })
  managerInfo?: Manager[];
}
