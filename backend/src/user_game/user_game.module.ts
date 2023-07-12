import { Module } from "@nestjs/common";
import { UserGameController } from "./user_game.controller.js";
import { UserGameService } from "./user_game.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";

@Module({
    controllers: [UserGameController],
    providers: [UserGameService],
    imports: [PrismaModule],
	exports: [UserGameService]
})
export class UserGameModule {}