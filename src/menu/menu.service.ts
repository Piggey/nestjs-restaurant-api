import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PostgresService } from '../postgres/postgres.service';
import {
  FetchMenuByCategoryResponse,
  FetchMenuItemResponse,
  FetchMenuResponse,
  MenuItemCreatedResponse,
  MenuItemRemovedResponse,
  MenuItemUpdatedResponse,
} from './responses';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

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

  async fetchMenuByCategory(id: number): Promise<FetchMenuByCategoryResponse> {
    let category;
    try {
      category = await this.db.category.findFirst({
        where: { categoryId: id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        const err = new HttpException(
          `category with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
        Logger.error(err);
        throw err;
      }
    }

    const menuItems = await this.db.menu.findMany({
      where: {
        category,
        available: true,
      },
    });

    return {
      category,
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

  async createMenuItem(
    newItem: CreateMenuDto,
  ): Promise<MenuItemCreatedResponse> {
    let menuItem;
    try {
      menuItem = await this.db.menu.create({ data: newItem });
    } catch (error) {
      const err = new HttpException(
        'something went wrong when creating a new menu item',
        HttpStatus.FAILED_DEPENDENCY,
      );
      Logger.error(error.message);
      Logger.error(err);
      throw err;
    }

    return {
      menuItem,
    };
  }

  async updateMenuItem(
    id: number,
    updatedItem: UpdateMenuDto,
  ): Promise<MenuItemUpdatedResponse> {
    let menuItem;
    try {
      menuItem = await this.db.menu.update({
        where: { itemId: id },
        data: updatedItem,
      });
    } catch (error) {
      const err = new HttpException(
        `could not update menu item with id = ${id}`,
        HttpStatus.FAILED_DEPENDENCY,
      );
      Logger.error(error.message);
      Logger.error(err);
      throw err;
    }

    return {
      menuItem,
    };
  }

  async removeMenuItem(id: number): Promise<MenuItemRemovedResponse> {
    let menuItem;
    try {
      menuItem = await this.db.menu.update({
        where: { itemId: id },
        data: {
          available: false,
        },
      });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new HttpException(
          `menu item with id ${id} not found`,
          HttpStatus.NOT_FOUND,
        );
      } else {
        err = new HttpException(
          `could not remove menu item ${id}`,
          HttpStatus.FAILED_DEPENDENCY,
        );
      }

      Logger.error(error.message);
      Logger.error(err);
      throw err;
    }

    return {
      menuItem,
    };
  }
}
