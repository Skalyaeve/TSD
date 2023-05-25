import { Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { ChannelService } from "./channel.service.js";
import { ChanMember, Channel } from "@prisma/client";

@Controller('channels')
export class ChannelController {
    constructor(private channelService: ChannelService) {}

    @Post(':id/members')
    @UseGuards(JwtGuard)
    async addMemberToChannel(@Req() req: any, @Param('id', ParseIntPipe) chanId: number): Promise<ChanMember> {
        return this.channelService.createOneChanMember(chanId, req.user.id);
    }

    @Post(':name')
    @UseGuards(JwtGuard)
    async createChannel(@Req() req: any, @Param('name') name: string): Promise<Channel> {
        return this.channelService.createOneChannel(name, req.user.id);
    }

    @Get(':id/members')
    @UseGuards(JwtGuard)
    async getAllMembersByChan(@Param('id', ParseIntPipe) chanId: number): Promise<ChanMember[]> {
        return this.channelService.findAllMembersByChanID(chanId);
    }

    @Get('own')
    @UseGuards(JwtGuard)
    async getAllChansByMember(@Req() req: any): Promise<ChanMember[]> {
        return this.channelService.findAllChannelsByMember(req.user.id);
    }
}