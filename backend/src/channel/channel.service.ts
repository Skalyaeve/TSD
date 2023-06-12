import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service.js";
import { ChanMember, ChanMessage, Channel } from "@prisma/client";

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

    // async createOneChanMessage(senderId: number, chanId: number, content: string): Promise<ChanMessage> {
    //     const message: ChanMessage = await this.prisma.chanMessage.create({
    //         data: {
    //             senderRef: {
    //                 connect: {
    //                     id: senderId,
    //                 },
    //             },
    //             chanRef: {
    //                 connect: {
    //                     id: chanId,
    //                 },
    //             },
    //             content,
    //         },
    //     });
    //     return message;
    // }

    async findManyChanMessages(chanId: number, count: number): Promise<ChanMessage[]> {
        const messages: ChanMessage[] = await this.prisma.chanMessage.findMany({
            where: {
                chanId,
            },
            orderBy: {
                timeSent: "asc",
            },
            take: count,
        });
        return messages;
    }

    async findAllChanMessages(chanId: number): Promise<ChanMessage[]> {
        const messages: ChanMessage[] = await this.prisma.chanMessage.findMany({
            where: {
                chanId,
            },
            orderBy: {
                timeSent: "asc",
            },
        });
        return messages;
    }

    async isMember(chanId: number, memberId: number): Promise<boolean> {
        const member: ChanMember = await this.prisma.chanMember.findUnique({
            where: {
                chanId_member: {
                    chanId,
                    member: memberId,
                },
            },
        });
        if (member) {
            return true;
        }
        return false;
    }

    async isAdmin(chanId: number, memberId: number): Promise<boolean> {
        const member: ChanMember = await this.prisma.chanMember.findUnique({
            where: {
                chanId_member: {
                    chanId,
                    member: memberId,
                },
            },
        });
        if (member?.isAdmin) {
            return true;
        }
        return false;
    }

    async isOwner(chanId: number, memberId: number): Promise<boolean> {
        const channel: Channel = await this.prisma.channel.findUnique({
            where: {
                id: chanId,
            },
        });
        return channel.chanOwner === memberId;
    }

}