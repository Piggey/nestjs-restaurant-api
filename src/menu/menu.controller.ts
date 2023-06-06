import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
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
  MenuItemRemovedResponse,
  MenuItemUpdatedResponse,
} from './responses';
import { RequestErrorResponse } from '../app/response';
import { CreateMenuDto } from './dto/create-menu.dto';
import { RolesGuard } from '../auth/guard';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { RateMenuItemDto } from './dto/rate-menu-item.dto';

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
    @Param('id', ParseUUIDPipe) id: string,
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
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<FetchMenuByCategoryResponse> {
    this.logger.log(`GET /menu/category/${id}`);
    return this.menuService.fetchMenuByCategory(id);
  }

  @ApiOperation({ summary: 'create a new menu item' })
  @ApiBearerAuth()
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

  @ApiOperation({ summary: 'update menu item with given id' })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'item updated',
    type: MenuItemUpdatedResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description: 'something went wrong when updating a new menu item',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Patch(':id')
  async updateMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatedItem: UpdateMenuDto,
  ): Promise<MenuItemUpdatedResponse> {
    this.logger.log(`PATCH /menu/${id}`);
    return this.menuService.updateMenuItem(id, updatedItem);
  }

  @ApiOperation({ summary: 'rate a menu item and update its rating' })
  @ApiOkResponse({
    description: 'rating updated',
    type: FetchMenuItemResponse,
  })
  @ApiBadRequestResponse({
    description: 'parameters in request body were incorrect',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `CLIENT`',
    type: RequestErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find menu item with this id',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.CLIENT)
  @Patch(':id/rate')
  async rateMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RateMenuItemDto,
  ): Promise<FetchMenuItemResponse> {
    this.logger.log(`PATCH /menu/${id}/rate`);
    return this.menuService.rateMenuItem(id, dto);
  }

  @ApiOperation({
    summary: 'remove (mark as unavailable) menu item with given id',
  })
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'item removed',
    type: MenuItemRemovedResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description: 'something went wrong when updating a new menu item',
    type: RequestErrorResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a menu item with given id',
    type: RequestErrorResponse,
  })
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Delete(':id')
  async removeMenuItem(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MenuItemRemovedResponse> {
    this.logger.log(`DELETE /menu/${id}`);
    return this.menuService.removeMenuItem(id);
  }
}
