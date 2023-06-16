import { Module } from "@nestjs/common";
import { CharacterService } from "./character.service.js";
import { CharacterController } from "./character.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
	providers: [CharacterService],
	controllers: [CharacterController],
	imports: [PrismaModule],
})
export class CharacterModule {}