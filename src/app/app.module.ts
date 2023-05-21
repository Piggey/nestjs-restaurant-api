import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from '../user/user.module';
import { EmployeeModule } from '../employee/employee.module';
import { ManagerModule } from '../manager/manager.module';
import { MenuModule } from '../menu/menu.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { CategoryModule } from '../category/category.module';
import { OrderModule } from '../order/order.module';
import { PostgresModule } from '../db/postgres/postgres.module';
import { MongoModule } from '../db/mongo/mongo.module';

@Module({
  imports: [
    PostgresModule,
    MongoModule,
    AuthModule,
    UserModule,
    EmployeeModule,
    ManagerModule,
    MenuModule,
    RestaurantModule,
    CategoryModule,
    OrderModule,
  ],
})
export class AppModule {}
