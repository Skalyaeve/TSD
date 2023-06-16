import { Controller, Get } from "@nestjs/common";
import { Character } from "@prisma/client";
import { CharacterService } from "./character.service.js";

@Controller('characters')
export class CharacterController {
	constructor(private characterService: CharacterService) {}

	@Get('all')
	async getAllCharacters(): Promise<Character[]> {
		return this.characterService.findAll();
	}
}