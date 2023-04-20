import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from '../user-old/user.module';

@Module({
  imports: [AuthModule, PrismaModule, UserModule],
})
export class AppModule {}
