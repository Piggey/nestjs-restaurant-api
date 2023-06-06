import { ApiProperty } from '@nestjs/swagger';
import { Coupon } from '../entities/coupon.entity';

export class ValidateCouponResponse {
  @ApiProperty()
  couponValid: boolean;

  @ApiProperty()
  coupon?: Coupon;
}
