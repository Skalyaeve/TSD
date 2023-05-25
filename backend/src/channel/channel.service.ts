import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { ChanMember, Channel } from "@prisma/client";

@Injectable()
export class ChannelService {
    constructor(private prisma: PrismaService) {}

    async createOneChannel(name:string, chanOwner: number): Promise<Channel> {
        const channel = this.prisma.channel.create({
            data: {
                name,
                chanOwner,
            },
        });
        return channel;
    }

    async createOneChanMember(chanId: number, memberId: number): Promise<ChanMember> {
        const chanMember: ChanMember = await this.prisma.chanMember.create({
            data: {
                chanId,
                member: memberId,
            },
        });
        return chanMember;
    }

    async findAllMembersByChanID(chanId: number): Promise<ChanMember[]> {
        const members: ChanMember[] = await this.prisma.chanMember.findMany({
            where: {
                chanId,
            },
        });
        return members;
    }

    async findAllChannelsByMember(member: number): Promise<ChanMember[]> {
        const channels: ChanMember[] = await this.prisma.chanMember.findMany({
            where: {
                member,
            },
        });
        return channels;
    }
}