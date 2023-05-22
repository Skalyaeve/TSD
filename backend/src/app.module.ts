import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { ChatGateway } from './chat/chat.gateway.js';
import { ChatService } from './chat/chat.service.js';
import { GameModule } from './game/game.module.js';
import { ChatModule } from './chat/chat.module.js';
import { AuthService } from './auth/auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from 'nestjs-prisma';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    ChatModule,
    ConfigModule,
	GameModule
  ],
  providers: [
    ChatService, 
    AuthService,
    ConfigService,
    PrismaService
  ],
})
export class AppModule {}
