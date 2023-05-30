import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CategoryDeletedResponse,
  CategoryUpdatedResponse,
  FetchCategoriesResponse,
} from './responses';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { RequestErrorResponse } from '../app/response';
import { RolesGuard } from '../auth/guard';
import { AllowMinRole } from '../auth/decorator';
import { UserRoles } from '../auth/model';

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

  @ApiOperation({ summary: 'update a category' })
  @ApiOkResponse({
    description: 'category updated',
    type: CategoryUpdatedResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a category with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description: 'something went wrong when updating a category',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Patch(':id')
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() newCategory: UpdateCategoryDto,
  ): Promise<CategoryUpdatedResponse> {
    this.logger.log(`PATCH /category/${id}`);
    return this.categoryService.updateCategory(id, newCategory);
  }

  @ApiOperation({
    summary: 'delete (mark as deleted) a category with all of its menu item',
  })
  @ApiOkResponse({
    description: 'category and menu items deleted',
    type: CategoryDeletedResponse,
  })
  @ApiNotFoundResponse({
    description: 'could not find a category with given id',
    type: RequestErrorResponse,
  })
  @ApiResponse({
    status: 424,
    description: 'something went wrong when deleting a category',
    type: RequestErrorResponse,
  })
  @ApiForbiddenResponse({
    description: 'insufficient `UserRoles` privileges. minimum = `BOSS`',
    type: RequestErrorResponse,
  })
  @ApiBearerAuth()
  @UseGuards(RolesGuard)
  @AllowMinRole(UserRoles.BOSS)
  @Delete(':id')
  async deleteCategory(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CategoryDeletedResponse> {
    this.logger.log(`DELETE /category/${id}`);
    return this.categoryService.deleteCategory(id);
  }
}
