import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { EmployeeModule } from '../employee/employee.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule, EmployeeModule],
})
export class AppModule {}
