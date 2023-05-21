import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { GameModule } from './game/game.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserGameModule } from './user_game/user_game.module';

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
	  GameModule,
    UserGameModule,
  ],
})
export class AppModule {}
