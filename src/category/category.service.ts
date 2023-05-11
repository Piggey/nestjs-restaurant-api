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

