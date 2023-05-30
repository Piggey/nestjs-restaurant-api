import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import {
  FetchRestaurantResponse,
  FetchRestaurantsResponse,
  RestaurantCreatedResponse,
  RestaurantDeletedResponse,
  RestaurantUpdatedResponse,
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
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsInRangeDto } from './dto/restaurants-in-range.dto';

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
    @Param('id', ParseUUIDPipe) id: string,
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

  @ApiOperation({ summary: 'update data about a restaurant' })
  @ApiOkResponse({
    description: 'returns updated data',
    type: RestaurantUpdatedResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a restaurant with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when updating a restaurant',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.MANAGER)
  @Patch(':id')
  async updateRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() newRestaurant: UpdateRestaurantDto,
  ): Promise<RestaurantUpdatedResponse> {
    this.logger.log(`PATCH /restaurant/${id}`);
    return this.restaurantService.updateRestaurant(id, newRestaurant);
  }

  @ApiOperation({ summary: 'delete (mark as unavailable) a restaurant' })
  @ApiOkResponse({
    description: 'returns data about deleted restaurant',
    type: RestaurantDeletedResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a restaurant with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: HttpStatus.FAILED_DEPENDENCY,
    description: 'database error when deleting a restaurant',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Delete(':id')
  async deleteRestaurant(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RestaurantDeletedResponse> {
    this.logger.log(`DELETE /restaurant/${id}`);
    return this.restaurantService.deleteRestaurant(id);
  }

  @ApiOperation({ summary: 'get all restaurants in given range' })
  @ApiOkResponse({
    description: 'returns all restaurants, along with number of restaurants',
    type: FetchRestaurantsResponse,
  })
  @Get('/range')
  async fetchRestaurantsInRange(
    @Param() dto: RestaurantsInRangeDto,
  ): Promise<FetchRestaurantsResponse> {
    this.logger.log(`GET /restaurant/range ${dto.rangeKm}km`);
    return this.restaurantService.fetchRestaurants(dto);
  }
}
