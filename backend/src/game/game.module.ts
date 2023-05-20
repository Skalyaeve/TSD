import { Module } from '@nestjs/common';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';

@Module({
	providers: [GameGateway],
	controllers: [GameController]
})
export class GameModule { }
