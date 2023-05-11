import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryUpdatedResponse, FetchCategoriesResponse } from './responses';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags('category')
@Controller('category')
export class CategoryController {
  private readonly logger = new Logger(CategoryController.name);
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({ summary: 'fetch all category info' })
  @ApiOkResponse({
    description: 'returns all categories',
    type: FetchCategoriesResponse,
  })
  @Get('/')
  async fetchCategories(): Promise<FetchCategoriesResponse> {
    this.logger.log('GET /category');
    return this.categoryService.fetchCategories();
  }

}
