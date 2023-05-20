import { Controller, Get } from '@nestjs/common';

@Controller('game')
export class GameController {
	@Get('matchmaking')
	getGame(): string {
		// Ajoutez ici le code pour gérer la requête GET
		return 'Hello from the game route!';
	}
}
