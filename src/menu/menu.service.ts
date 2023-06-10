import {
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PostgresService } from '../db/postgres/postgres.service';
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
import { RateMenuItemDto } from './dto/rate-menu-item.dto';

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

  async fetchMenuByCategory(id: string): Promise<FetchMenuByCategoryResponse> {
    let category;
    try {
      category = await this.db.category.findFirst({
        where: { categoryId: id, available: true },
      });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`category with id ${id} not found`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
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

  async fetchMenuItem(id: string): Promise<FetchMenuItemResponse> {
    let menuItem;
    try {
      menuItem = await this.db.menu.findFirstOrThrow({
        include: { category: true },
        where: {
          available: true,
          itemId: id,
        },
      });
    } catch (error) {
      let err;
      if (error.code === 'P2025') {
        err = new NotFoundException(`menu item with id ${id} not found`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }

    return { menuItem };
  }

  async createMenuItem(
    newItem: CreateMenuDto,
  ): Promise<MenuItemCreatedResponse> {
    let menuItem;
    try {
      menuItem = await this.db.menu.create({
        include: { category: true },
        data: newItem,
      });
    } catch (error) {
      const err = new HttpException(
        error.meta.cause,
        HttpStatus.FAILED_DEPENDENCY,
      );

      Logger.error(err);
      throw err;
    }

    return { menuItem };
  }

  async updateMenuItem(
    id: string,
    updatedItem: UpdateMenuDto,
  ): Promise<MenuItemUpdatedResponse> {
    let menuItem;
    try {
      menuItem = await this.db.menu.update({
        include: { category: true },
        where: { itemId: id },
        data: updatedItem,
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
          `could not update menu item with id = ${id}`,
          HttpStatus.FAILED_DEPENDENCY,
        );
        Logger.error(error.message);
      }

      Logger.error(err);
      throw err;
    }

    return { menuItem };
  }

  async rateMenuItem(
    id: string,
    dto: RateMenuItemDto,
  ): Promise<FetchMenuItemResponse> {
    const menuItem = await this.db.$transaction(async (prisma) => {
      const menuItem = await prisma.menu.findUnique({
        include: { category: true },
        where: { itemId: id },
      });

      if (!menuItem) {
        const err = new NotFoundException(`could not find menu item ${id}`);
        Logger.error(err);
        throw err;
      }

      const numberOfRatings = menuItem.numberOfRatings + 1;
      const rating =
        (menuItem.rating * menuItem.numberOfRatings + dto.rating) /
        (menuItem.numberOfRatings + 1);

      const updatedItem = await prisma.menu.update({
        include: { category: true },
        where: { itemId: menuItem.itemId },
        data: {
          numberOfRatings,
          rating,
        },
      });

      return updatedItem;
    });

    return { menuItem };
  }

  async removeMenuItem(id: string): Promise<MenuItemRemovedResponse> {
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
        err = new NotFoundException(`menu item with id ${id} not found`);
      } else {
        err = new HttpException(error.meta.cause, HttpStatus.FAILED_DEPENDENCY);
      }

      Logger.error(err);
      throw err;
    }

    return { menuItem };
  }
}
