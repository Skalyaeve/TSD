import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway.js';
/*import { UserSocketsService } from '../chat/chat.userSocketsService.js';
import { ChatService } from '../chat/chat.service.js';*/

@Module({
	providers: [
		GameGateway,
		/*UserSocketService,
		ChatService*/
	]
})
export class GameModule { }
