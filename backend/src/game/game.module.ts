import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway.js';
import { UserSocketsService } from '../chat/chat.userSocketsService.js';

@Module({
	providers: [
		GameGateway,
		UserSocketsService
	]
})
export class GameModule { }
