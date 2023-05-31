import { Module } from "@nestjs/common";
import { FriendRequestService } from "./friend.service.js";
import { PrismaModule } from "nestjs-prisma";
import { PrismaService } from "../prisma/prisma.service.js";

@Module({
    providers: [PrismaService, FriendRequestService],
    imports: [PrismaModule],
    exports: [FriendRequestService],
})
export class FriendModule {}