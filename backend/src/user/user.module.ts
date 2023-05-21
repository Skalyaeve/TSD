import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    PrismaModule,
    MulterModule,
  ],
  exports: [UserService],
})
export class UserModule {}