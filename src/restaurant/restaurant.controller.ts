import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  FetchRestaurantResponse,
  FetchRestaurantsResponse,
  RestaurantCreatedResponse,
} from './responses';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestErrorResponse } from '../app/response';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { RolesGuard } from '../auth/guard';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';

@ApiTags('restaurant')
@Controller('restaurant')
export class RestaurantController {
  private readonly logger = new Logger(RestaurantController.name);
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({ summary: 'fetch all restaurants' })
  @ApiOkResponse({
    description: 'returns all restaurants, along with number of restaurants',
    type: FetchRestaurantsResponse,
  })
  @Get('/')
  async fetchRestaurants(): Promise<FetchRestaurantsResponse> {
    this.logger.log('GET /restaurant');
    return this.restaurantService.fetchRestaurants();
  }

  @ApiOperation({ summary: 'fetch restaurant data with given id' })
  @ApiOkResponse({
    description: 'returns data about a restaurant',
    type: FetchRestaurantResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a restaurant with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when getting restaurant data',
    type: RequestErrorResponse,
  })
  @Get(':id')
  async fetchRestaurant(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FetchRestaurantResponse> {
    this.logger.log(`GET /restaurant/${id}`);
    return this.restaurantService.fetchRestaurant(id);
  }

  @ApiOperation({ summary: 'creates a new restaurant' })
  @ApiOkResponse({
    description: 'created a new restaurant and returned its data',
    type: RestaurantCreatedResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when creating a new restaurant',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Post('/')
  async createRestaurant(
    @Body() newRestaurant: CreateRestaurantDto,
  ): Promise<RestaurantCreatedResponse> {
    this.logger.log('POST /restaurant');
    return this.restaurantService.createRestaurant(newRestaurant);
  }
}
