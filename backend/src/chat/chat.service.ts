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
        const channel: Channel = await this.prisma.channel.create({
          data: channelData,
        });
        return channel;
    }

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

    async setChanPassword(data: {chanId: number, userId: number, newPasswd: string }): Promise<Channel|null> {
        try {
            const {chanId, userId, newPasswd} = data;

            if (this.isAdmin(chanId, userId))
            {
                const updatedChannel = await this.prisma.channel.update({
                        where: {id: chanId},
                        data: {passwd: newPasswd}
                    }
                );
                if (!updatedChannel) {
                    throw new Error("Error in setting new passwd");
                }
                return updatedChannel;
            }
            else {
                throw new Error ("User is not admin");
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    async setChanName(data: {chanMember:number; chanId: number, newChanName: string}): Promise<Channel|null>{
        try {
            const {chanMember, chanId, newChanName} = data;
            const isAdmin = await this.isAdmin(chanId, chanMember);
            if (!isAdmin){
                throw new Error('Member does not have channel privileges')
            }
            else {
                const updatedChannel = await this.prisma.channel.update(
                    {
                        where: {id: chanId},
                        data: {name: newChanName}
                    }
                );
                if (!updatedChannel) {
                    throw new Error("Could not change name");
                }
                return updatedChannel;
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    async makeOwnerAdmin( userId: number, chanId: number) : Promise<ChanMember|null>
    {
        try {
            const updatedMember: ChanMember|null = await this.prisma.chanMember.update({
                where: {
                    chanId_member: {
                        chanId,
                        member: userId,
                    },
                },
                data: {
                    isAdmin: true,
                }
            });
            if (!updatedMember) {
                throw new Error('could not make user admin of channel');
            }
            return updatedMember;
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    async makeChanAdmin(data: {chanOwnerId:number, chanId: number, memberId: number}):  Promise<ChanMember|null> {
        try {
            const {chanOwnerId, chanId, memberId} = data;

            const isOwner = await this.isOwner(chanId, chanOwnerId);
            if (!isOwner) {
                throw new WsException('not channel owner');
            }
            else {
                const updatedMember: ChanMember|null = await this.prisma.chanMember.update({
                    where: {
                        chanId_member: {
                            chanId,
                            member: memberId,
                        },
                    },
                    data: {
                        isAdmin: true,
                    }
                });
    
                if (!updatedMember) {
                    throw new Error('could not make user admin of channel');
                }
                return updatedMember;
            }
        }
        catch (error) {
            console.log(error);
            throw error;
        }
    }

    async muteMember(data: {chanId: number, memberToMuteId: number, adminId: number, muteDuration: number}) :Promise<ChanMember|null> {

        try {
            const {chanId, memberToMuteId, adminId, muteDuration} = data;
            const checkAdmin = await this.isAdmin(chanId, adminId);
            if (!checkAdmin) {
                throw new Error('user does not have privileges');
            }
            else {
                const isOwner = await this.isOwner(chanId, memberToMuteId);
                if (isOwner) {
                    throw new Error('Cannot mute a channel owner');
                }
                else {
                    const muteEnd = new Date();
                    // muteEnd.setSeconds(muteEnd.getSeconds() + muteDuration);
                    muteEnd.setMinutes(muteEnd.getMinutes() + muteDuration);
    
                    const mutedMember = await this.prisma.chanMember.update({
                        where: { chanId_member: {chanId, member: memberToMuteId}},
                        data : {muteTime: muteEnd},
                    });
                    if (!mutedMember) {
                        throw new Error('could not mute member');
                    }
                    return mutedMember;
                }
            }
        }
        catch (error)
        {
            console.log(error);
            throw error;
        }
    }

    async kickMember(data: {chanId: number, memberToKickId: number, adminId: number}) : Promise<ChanMember|null>{

        try {
            const {chanId, memberToKickId, adminId} = data;
            const checkAdmin = await this.isAdmin(chanId, adminId);
            if (!checkAdmin) {
                throw new Error('user does not have privileges');
            }
            else {
                const isOwner = await this.isOwner(chanId, memberToKickId);
                if (isOwner) {
                    throw new Error('Cannot kick a channel owner');
                }
                else {
                    const kickedMember = await this.prisma.chanMember.delete({
                        where: {chanId_member: {chanId, member: memberToKickId}}
                    });
                    if (!kickedMember) {
                        throw new Error('could not kick member');
                    }
                    return kickedMember;
                }
            }
        }
        catch (error)
        {
            console.log(error);
            throw error;
        }
    }

    async banMember(data: {chanId: number, memberToBanId: number, adminId: number}) : Promise<ChanMember|null> {

        try {
            const {chanId, memberToBanId, adminId} = data;
            const checkAdmin = await this.isAdmin(chanId, adminId);
            if (!checkAdmin) {
                throw new Error('user does not have privileges');
            }
            else {
                const isOwner = await this.isOwner(chanId, memberToBanId);
                if (isOwner) {
                    throw new Error('Cannot mute a channel owner');
                }
                else {
                    const bannedMember = await this.prisma.chanMember.delete({
                        where: {chanId_member: {chanId, member: memberToBanId}}
                    });

                    await this.prisma.chanBan.create({
                        data: {
                            chanId,
                            bannedUser: memberToBanId,

                        }
                    })
                    return bannedMember;
                }
            }
        }
        catch (error)
        {
            console.log(error);
            throw error;
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
