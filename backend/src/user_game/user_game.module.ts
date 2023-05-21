import { Module } from "@nestjs/common";
import { UserGameController } from "./user_game.controller";
import { UserGameService } from "./user_game.service";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers: [UserGameController],
    providers: [UserGameService],
    imports: [PrismaModule],
})
export class UserGameModule {}