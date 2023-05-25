import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { UserSocketsService } from './chat.userSocketsService.js';
import { PrismaService } from 'nestjs-prisma';
import { ChanType } from '@prisma/client';
import { ChanMember, ChanMessage, Channel } from "@prisma/client";

@Injectable()
export class ChatService {

    constructor(
        private readonly authservice: AuthService,
        private prisma: PrismaService
    )
    {}

    async getUserFromSocket (client: Socket) {
        const cookie:string = client.handshake.headers.cookie;
        if (cookie)
        {
            const { access_token: authenticationToken} = parse(cookie);
            console.log('authentication token', authenticationToken);
            const user = await this.authservice.getUserfromAuthenticationToken(authenticationToken);
            if (!user){
                throw new WsException('Invalid credentials');
            }
            return user;
        }
        console.log('there is no cookie :(')
    }

    //Creation methods, equivalent of setters

    async createChannel(channelData: { name: string, type: ChanType, passwd?: string, chanOwnerRef: { connect: { id: number } } }) :Promise<Channel>{
        const channel = await this.prisma.channel.create({
          data: channelData,
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
    
    async createOneChanMessage(senderId: number, chanId: number, content: string): Promise<ChanMessage> {
        const message: ChanMessage = await this.prisma.chanMessage.create({
            data: {
                senderRef: {
                    connect: {
                        id: senderId,
                    },
                },
                chanRef: {
                    connect: {
                        id: chanId,
                    },
                },
                content,
            },
        });
        return message;
    }

    //setters that don't create but change values

    async setChanPassword(chanId: number, userId: number, content: string)
    {
        if (this.isAdmin(chanId, userId))
        {
            
        }
    }
    //Find methods, equivalent of getters

    async findChannelbyId(id: number): Promise<Channel|null> {
        const foundChannel: Channel|null = await this.prisma.channel.findUnique({
            where: {id},
        })
        return foundChannel;
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

    //Verification methods

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
