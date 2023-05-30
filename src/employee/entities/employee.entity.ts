import { ApiProperty } from '@nestjs/swagger';
import { Address } from '../../address/entities/address.entity';
import { User } from '../../user/entities/user.entity';
import { Restaurant } from '../../restaurant/entities/restaurant.entity';
import { Job } from '../../job/entities/job.entity';
import { Manager } from '../../manager/entities/manager.entity';

export class Employee {
  @ApiProperty({
    required: false,
  })
  employeeId: string;
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
    required: false,
  })
  addressId: string;
  @ApiProperty({
    required: false,
  })
  user?: User;
  @ApiProperty({
    required: false,
  })
  userId: string;
  @ApiProperty({
    required: false,
  })
  restaurant?: Restaurant;
  @ApiProperty({
    required: false,
  })
  restaurantId: string;
  @ApiProperty({
    required: false,
  })
  job?: Job;
  @ApiProperty({
    required: false,
  })
  jobId: string;
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
