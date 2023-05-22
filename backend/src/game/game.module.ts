import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway.js';

@Module({
	providers: [GameGateway],
	controllers: [GameController]
})
export class GameModule { }
