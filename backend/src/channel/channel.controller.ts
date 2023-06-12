import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { JwtGuard } from "../auth/guards/JwtGuard.js";
import { ChannelService } from "./channel.service.js";
import { ChanMember, ChanMessage, Channel } from "@prisma/client";
import { ChannelMemberGuard } from "./channel-message.guard.js";

@Controller('channels')
export class ChannelController {
    constructor(private channelService: ChannelService) {}

    @Get('own')
    @UseGuards(JwtGuard)
    async getAllChansByMember(@Req() req: any): Promise<ChanMember[]> {
        return this.channelService.findAllChannelsByMember(req.user.id);
    }

    @Post(':id/members')
    @UseGuards(JwtGuard)
    async addMemberToChannel(@Req() req: any, @Param('id', ParseIntPipe) chanId: number): Promise<ChanMember> {
        return this.channelService.createOneChanMember(chanId, req.user.id);
    }

    // @Post(':id/messages')
    // @UseGuards(JwtGuard, ChannelMemberGuard)
    // async addMessageToChannel(@Req() req: any, @Param('id', ParseIntPipe) chanId: number, @Body('content') content: string): Promise<ChanMessage> {
    //    return this.channelService.createOneChanMessage(req.user.id, chanId, content);
    // }

    @Get(':id/messages/:count')
    @UseGuards(JwtGuard, ChannelMemberGuard)
    async getLastChanMessages(@Param('id') chanId: number, @Param('count') count: number): Promise<ChanMessage[]> {
        return this.channelService.findManyChanMessages(chanId, count);
    }

    @Get(':id/messages')
    @UseGuards(JwtGuard, ChannelMemberGuard)
    async getAllChanMessages(@Param('id') chanId: number): Promise<ChanMessage[]> {
        return this.channelService.findAllChanMessages(chanId);
    }

    @Get(':id/members')
    @UseGuards(JwtGuard)
    async getAllMembersByChan(@Param('id', ParseIntPipe) chanId: number): Promise<ChanMember[]> {
        return this.channelService.findAllMembersByChanID(chanId);
    }

    @Post(':name')
    @UseGuards(JwtGuard)
    async createChannel(@Req() req: any, @Param('name') name: string): Promise<Channel> {
        return this.channelService.createOneChannel(name, req.user.id);
    }

}