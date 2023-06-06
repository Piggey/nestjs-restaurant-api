import { ApiProperty } from '@nestjs/swagger';
import { Coupon } from '../entities/coupon.entity';

export class FetchCouponResponse {
  @ApiProperty()
  coupon: Coupon;
}
