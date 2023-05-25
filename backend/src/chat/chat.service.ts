import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';
import { UserSocketsService } from './chat.userSocketsService.js';
import { PrismaService } from 'nestjs-prisma';
import { ChanType } from '@prisma/client';

@Injectable()
export class ChatService {

    constructor(
        private readonly authservice: AuthService,
        private prismaService: PrismaService
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

    async createChannel(channelData: { name: string, type: ChanType, passwd?: string, chanOwnerRef: { connect: { id: number } } }){
        const channel = await this.prismaService.channel.create({
          data: channelData,
        });
        return channel;
      }
    // async createChannel(channelData: { name: string, type: string, passwd?: string, chanOwner: number}){
    //     const channel = await this.prismaService.channel.create({
    //         data: {
    //             ...channelData,
    //             chanOwnerRef: {
    //                 connect: {
    //                     id: channelData.chanOwner,
    //                 }
    //             },
    //         },
    //     });
    //     return channel;
    // }
}
