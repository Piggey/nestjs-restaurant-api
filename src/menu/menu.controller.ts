import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { MenuService } from './menu.service';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  FetchMenuByCategoryResponse,
  FetchMenuItemResponse,
  FetchMenuResponse,
} from './responses';
import { RequestErrorResponse } from '../app/response';

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

}
