import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { Character } from "@prisma/client";

@Injectable()
export class CharacterService {
	constructor(private prisma: PrismaService) {}

	async findAll(): Promise<Character[]> {
		const characters: Character[] = await this.prisma.character.findMany();
		return characters;
	}
}