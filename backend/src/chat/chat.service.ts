import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
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
        const cookie = client.handshake.headers.cookie;
        const { access_token: authenticationToken} = parse(cookie);
        console.log('authentication token', authenticationToken);
        const user = await this.authservice.getUserfromAuthenticationToken(authenticationToken);
        if (!user){
            throw new WsException('Invalid credentials');
        }
        return user;
    }

}
