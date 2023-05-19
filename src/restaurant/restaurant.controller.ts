import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { FetchRestaurantResponse, FetchRestaurantsResponse } from './responses';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RequestErrorResponse } from '../app/response';

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
    status: 424,
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
}
