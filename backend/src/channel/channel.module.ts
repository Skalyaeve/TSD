import { Module } from "@nestjs/common";
import { ChannelService } from "./channel.service.js";
import { ChannelController } from "./channel.controller.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
    controllers: [ChannelController],
    providers: [ChannelService, PrismaService],
    imports: [PrismaModule],
})
export class ChannelModule {}