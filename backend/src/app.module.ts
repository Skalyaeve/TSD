import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { UserModule } from './user/user.module';
import { ChatService } from './chat/chat.service';
import { GameService } from './game/game.service';
import { ChatModule } from './chat/chat.module';
import { AuthService } from './auth/auth.service';
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
    ConfigModule
  ],
  providers: [
    ChatGateway, 
    ChatService, 
    GameService, 
    AuthService,
    ConfigService,
    PrismaService
  ],
})
export class AppModule {}
