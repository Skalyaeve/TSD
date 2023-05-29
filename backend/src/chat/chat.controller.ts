import { Body, Controller, Post, Req } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';
import { UserService } from '../user/user.service.js';
import { JwtGuard } from '../auth/guards/JwtGuard.js';
// import { ChatService } from './chat.service.js';
import { ChatService } from './service/index.js'
import { channel } from 'diagnostics_channel';

@Controller('chat')
export class ChatController {
    constructor(
        private chatService: ChatService
    ) {}

}
