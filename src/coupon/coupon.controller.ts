import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CouponService } from './coupon.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FetchCouponResponse,
  FetchCouponsResponse,
  ValidateCouponResponse,
} from './responses';
import { RequestErrorResponse } from '../app/response';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { RolesGuard } from '../auth/guard';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';
import { ValidateCouponDto } from './dto/validate-coupon.dto';

@ApiTags('coupon')
@Controller('coupon')
export class CouponController {
  private readonly logger = new Logger(CouponController.name);
  constructor(private readonly couponService: CouponService) {}

  @ApiOperation({ summary: 'fetch all available coupons' })
  @ApiOkResponse({
    description: 'returns all coupons',
    type: FetchCouponsResponse,
  })
  @Get('/')
  async fetchCoupons(): Promise<FetchCouponsResponse> {
    this.logger.log('GET /coupon');
    return this.couponService.fetchCoupons();
  }

  @ApiOperation({
    summary: 'returns coupon with given id (might not be available!)',
  })
  @ApiOkResponse({
    description: 'returns coupon',
    type: FetchCouponResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find coupon with given id',
    type: RequestErrorResponse,
  })
  @Get(':id')
  async fetchCoupon(@Param('id') id: string): Promise<FetchCouponResponse> {
    this.logger.log(`GET /coupon/${id}`);
    return this.couponService.fetchCoupon(id);
  }

  @ApiOperation({
    summary: 'checks whether coupon with given code is valid',
  })
  @ApiOkResponse({
    description: 'returns coupon',
    type: ValidateCouponResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find coupon with given id',
    type: RequestErrorResponse,
  })
  @Get('/validate')
  async validateCoupon(
    @Query() validateCouponDto: ValidateCouponDto,
  ): Promise<ValidateCouponResponse> {
    this.logger.log(`GET /coupon/validate ${validateCouponDto.code}`);
    return this.couponService.validateCoupon(validateCouponDto);
  }

  @ApiOperation({ summary: 'creates a new coupon' })
  @ApiCreatedResponse({
    description: 'returns created coupon',
    type: FetchCouponResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when creating new coupon',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Post('/')
  async createCoupon(
    @Body() createCouponDto: CreateCouponDto,
  ): Promise<FetchCouponResponse> {
    console.log(createCouponDto);

    this.logger.log('POST /coupon');
    return this.couponService.createCoupon(createCouponDto);
  }

  @ApiOperation({ summary: 'delete (mark as not available) a coupon' })
  @ApiOkResponse({
    description: 'returns deleted coupon',
    type: FetchCouponResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a coupon with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when creating new coupon',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Delete(':id')
  async deleteCoupon(@Param('id') id: string): Promise<FetchCouponResponse> {
    this.logger.log(`DELETE /coupon/${id}`);
    return this.couponService.deleteCoupon(id);
  }
}
