import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UserModule } from './user/user.module.js';
import { GameModule } from './game/game.module.js';
import { ChatModule } from './chat/chat.module.js';
import { JwtModule } from '@nestjs/jwt';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
import { UserGameModule } from './user_game/user_game.module.js';

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
=======
import { ConfigModule, ConfigService } from '@nestjs/config';

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
  ]
>>>>>>> chat
})
export class AppModule { }
