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

}
