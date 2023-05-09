import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { MenuController } from './menu.controller';
import { PostgresModule } from '../postgres/postgres.module';

@Module({
  imports: [PostgresModule],
  controllers: [MenuController],
  providers: [MenuService],
})
export class MenuModule {}
