import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { GameModule } from './game/game.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
    GameModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}
