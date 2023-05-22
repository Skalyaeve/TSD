import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service.js';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {

    constructor(
        private readonly authservice: AuthService,
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

}
