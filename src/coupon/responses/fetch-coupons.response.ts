import { ApiProperty } from '@nestjs/swagger';
import { Coupon } from '../entities/coupon.entity';

export class FetchCouponsResponse {
  @ApiProperty({ type: [Coupon] })
  coupons: Coupon[];
}
