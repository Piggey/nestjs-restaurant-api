import { Controller, Logger } from '@nestjs/common';
import { CouponService } from './coupon.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  private readonly logger = new Logger(CouponController.name);
  constructor(private readonly couponService: CouponService) {}
}
