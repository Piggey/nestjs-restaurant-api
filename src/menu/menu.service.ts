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

}
