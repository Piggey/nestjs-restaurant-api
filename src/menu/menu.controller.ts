import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiHeader,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FetchMenuByCategoryResponse,
  FetchMenuItemResponse,
  FetchMenuResponse,
  MenuItemCreatedResponse,
} from './responses';
import { RequestErrorResponse } from '../app/response';
import { CreateMenuDto } from './dto/create-menu.dto';
import { RolesGuard } from '../auth/guard';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';
import { SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO } from '../auth/dto';

@ApiTags('menu')
@Controller('menu')
export class MenuController {
  private readonly logger = new Logger(MenuController.name);
  constructor(private readonly menuService: MenuService) {}

  @ApiOperation({ summary: 'fetch all menu items' })
  @ApiOkResponse({
    description: 'returns all menu items, along with number of items fetched',
    type: FetchMenuResponse,
  })
  @Get('/')
  async fetchMenu(): Promise<FetchMenuResponse> {
    this.logger.log('GET /menu');
    return this.menuService.fetchMenu();
  }

  @ApiOperation({ summary: 'fetch menu item with given id' })
  @ApiOkResponse({
    description: 'returns all information about this menu item',
    type: FetchMenuItemResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find an available menu item with this id',
    type: RequestErrorResponse,
  })
  @Get(':id')
  async fetchMenuItem(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FetchMenuItemResponse> {
    this.logger.log(`GET /menu/${id}`);
    return this.menuService.fetchMenuItem(id);
  }

  @ApiOperation({ summary: 'fetch all menu items with given category' })
  @ApiOkResponse({
    description: 'return all menu items, number of items and category',
    type: FetchMenuByCategoryResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a category with this id',
    type: RequestErrorResponse,
  })
  @Get('/category/:id')
  async fetchMenuByCategory(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FetchMenuByCategoryResponse> {
    this.logger.log(`GET /menu/category/${id}`);
    return this.menuService.fetchMenuByCategory(id);
  }

  @ApiOperation({ summary: 'create a new menu item' })
  @ApiCookieAuth()
  @ApiHeader(SWAGGER_CLIENT_PRINCIPAL_HEADER_INFO)
  @ApiOkResponse({
    description: 'new item created',
    type: MenuItemCreatedResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description: 'something went wrong when creating a new menu item',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Post('/')
  async createMenuItem(
    @Body() newItem: CreateMenuDto,
  ): Promise<MenuItemCreatedResponse> {
    this.logger.log(`POST /menu create new menu item ${newItem}`);
    return this.menuService.createMenuItem(newItem);
  }
}
