import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  FetchCouponResponse,
  FetchCouponsResponse,
  ValidateCouponResponse,
} from './responses';
import { MongoService } from '../db/mongo/mongo.service';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ValidateCouponDto } from './dto/validate-coupon.dto';
import { PostgresService } from '../db/postgres/postgres.service';

@Injectable()
export class CouponService {
  constructor(
    private readonly mongo: MongoService,
    private readonly postgres: PostgresService,
  ) {}

  async fetchCoupons(): Promise<FetchCouponsResponse> {
    const coupons = await this.mongo.coupon.findMany({
      where: { available: true },
    });

    return { coupons };
  }

  async fetchCoupon(id: string): Promise<FetchCouponResponse> {
    const coupon = await this.mongo.coupon.findUnique({ where: { id } });

    if (!coupon) {
      const err = new NotFoundException(`could not find coupon ${id}`);
      Logger.error(err);
      throw err;
    }

    return { coupon };
  }

  async validateCoupon(
    validateCouponDto: ValidateCouponDto,
  ): Promise<ValidateCouponResponse> {
    const coupon = await this.mongo.coupon.findFirst({
      where: { code: validateCouponDto.code },
    });

    return {
      couponValid: coupon?.available ?? false,
      coupon,
    };
  }

  async createCoupon(
    createCouponDto: CreateCouponDto,
  ): Promise<FetchCouponResponse> {
    let categoryName = null;
    if (createCouponDto.categoryId) {
      const category = await this.postgres.category.findFirst({
        where: { categoryId: createCouponDto.categoryId, available: true },
      });
      categoryName = category.categoryName;
    }

    try {
      const coupon = await this.mongo.coupon.create({
        data: {
          categoryName,
          ...createCouponDto,
        },
      });
      return { coupon };
    } catch (error) {
      const err = new HttpException(
        error.message,
        HttpStatus.FAILED_DEPENDENCY,
      );
      Logger.error(err);
      throw err;
    }
  }

  async deleteCoupon(id: string): Promise<FetchCouponResponse> {
    try {
      const coupon = await this.mongo.coupon.update({
        where: { id },
        data: { available: false },
      });
      return { coupon };
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`could not find coupon ${id}`);
      } else {
        err = new HttpException(error.message, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }
  }
}
