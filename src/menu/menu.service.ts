import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../postgres/postgres.service';
import {
  FetchMenuByCategoryResponse,
  FetchMenuItemResponse,
  FetchMenuResponse,
} from './responses';

@Injectable()
export class MenuService {
  constructor(private readonly db: PostgresService) {}

  async fetchMenu(): Promise<FetchMenuResponse> {
    const menuItems = await this.db.menu.findMany({
      include: { category: true },
      where: { available: true },
    });

    return {
      itemsAvailable: menuItems.length,
      menuItems,
    };
  }


  async fetchMenuItem(id: number): Promise<FetchMenuItemResponse> {
    let menuItem;
    try {
      menuItem = await this.db.menu.findFirst({
        include: { category: true },
        where: {
          available: true,
          itemId: id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        const err = new HttpException(
          `menu item with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
        Logger.error(err);
        throw err;
      }
    }

    return {
      menuItem,
    };
  }
}
