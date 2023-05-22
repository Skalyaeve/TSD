import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { PrismaModule } from 'nestjs-prisma';
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