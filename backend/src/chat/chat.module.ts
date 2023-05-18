import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { UserModule } from 'src/user/user.module';
import { ChatGateway } from './chat.gateway';
import { AuthService } from 'src/auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

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
        AuthService
    ],
})
export class ChatModule {}
