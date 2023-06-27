import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { UserGameModule } from './user_game/user_game.module.js';
import { GameModule } from './game/game.module.js';
import { ChatModule } from './chat/chat.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ChannelModule } from './channel/channel.module.js';
import { UserGameModule } from './user_game/user_game.module.js';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.jwtSecret,
    }),
    AuthModule,
    PrismaModule,
    UserModule,
    UserGameModule,
    ChatModule,
    ConfigModule,
    GameModule,
    ChannelModule,
	UserGameModule
  ]
})
export class AppModule { }
