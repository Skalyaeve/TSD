import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ChatGateway } from './chat/chat.gateway';
import { UserModule } from './user/user.module';
import { ChatService } from './chat/chat.service';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    UserModule,
  ],
  providers: [ChatGateway, ChatService],
})
export class AppModule {}
