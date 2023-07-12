import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway.js';
import { UserModule } from '../user/user.module.js';
import { ChatModule } from '../chat/chat.module.js';
import { UserGameModule } from '../user_game/user_game.module.js';


@Module({
	imports: [
		UserModule,
		ChatModule,
		UserGameModule
	],
	providers: [
		GameGateway
	]
})
export class GameModule { }
