import { Module } from '@nestjs/common';
import { ChatService } from './chat.service.js';
import { UserModule } from '../user/user.module.js';
import { ChatGateway } from './chat.gateway.js';
import { AuthService } from '../auth/auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { UserSocketsService } from './chat.userSocketsService.js';
@Module({
    imports: [
        JwtModule.register({
            secret: process.env.jwtSecret,
        }),
        UserModule,
        ConfigModule
    ],
    providers: [
        ChatService,
        ChatGateway,
        AuthService,
        UserSocketsService
    ],
})
export class ChatModule {}
