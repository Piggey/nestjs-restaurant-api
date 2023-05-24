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
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JobModule } from '../job/job.module';
import { JobApplicationModule } from '../job-application/job-application.module';

@Module({
  imports: [
    PostgresModule,
    MongoModule,
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({ global: true }),
    AuthModule,
    UserModule,
    EmployeeModule,
    ManagerModule,
    MenuModule,
    RestaurantModule,
    CategoryModule,
    OrderModule,
    JobModule,
    JobApplicationModule,
  ],
})
export class AppModule {}
