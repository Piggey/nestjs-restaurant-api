import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PostgresModule } from '../db/postgres/postgres.module';

@Module({
  imports: [PostgresModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
