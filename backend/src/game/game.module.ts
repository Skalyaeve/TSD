import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway.js';

@Module({
	providers: [
		GameGateway,
	]
})
export class GameModule { }
