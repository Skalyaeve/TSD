import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway.js';
import { UserModule } from '../user/user.module.js';
/*import { UserSocketsService } from '../chat/chat.userSocketsService.js';
import { ChatService } from '../chat/chat.service.js';*/

@Module({
	imports: [
		UserModule
	],
	providers: [
		GameGateway
	]
})
export class GameModule { }
