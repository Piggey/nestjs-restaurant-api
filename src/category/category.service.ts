import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CategoryUpdatedResponse, FetchCategoriesResponse } from './responses';
import { PostgresService } from '../postgres/postgres.service';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly db: PostgresService) {}

  async fetchCategories(): Promise<FetchCategoriesResponse> {
    const categories = await this.db.category.findMany();

    return {
      numCategories: categories.length,
      categories,
    };
  }

  async updateCategory(
    id: number,
    newCategory: UpdateCategoryDto,
  ): Promise<CategoryUpdatedResponse> {
    let category;
    try {
      category = await this.db.category.update({
        where: { categoryId: id },
        data: newCategory,
      });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new HttpException(
          `category with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        err = new HttpException(
          `something went wrong when updating category ${id}`,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      Logger.error(err);
      throw err;
    }

    return {
      category,
    };
  }
}
