import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit
} from '@nestjs/websockets';  
import { JwtPayload } from 'jsonwebtoken';
import * as jwt from 'jsonwebtoken';
import { Socket, Server } from "socket.io";
import * as cookieParser from 'cookie-parser';
import { parse } from 'cookie';
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';

// const cookieParserMiddleWare = (req, res, next) => {
//   const cookieParser = require('cookie-parser');
//   cookieParser()(req, res, next);
// };

declare module 'cookie-parser' {
  export function parse(cookieHeader: string): { [key: string]: string };
}

@WebSocketGateway(8001, {cors: "*"})
export class ChatGateway implements OnGatewayConnection
 {
  constructor(private userService: UserService){}
  @WebSocketServer()
  server: Server;
  
  configure(consumer) {
    consumer.apply(cookieParser()).forRoutes('*');
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { user: string, message: string }, @ConnectedSocket() client: Socket): void {
    console.log(data.user);
    console.log(data.message);
    client.broadcast.emit('message', data); // Use broadcast.emit() to send the message to all clients except the sender
  }

  async handleConnection(client: Socket, ...args:any[])
  {
    console.log('success');
    console.log('handshake: ', client.handshake);
    const cookies = client.handshake.headers.cookie;
    console.log('type of cookies',typeof cookies);
    // const authenticationToken = parse(cookies);
    // console.log('parsed cookie', authenticationToken);
    // const parsedCookie = cookieParser(cookies)['access_token'];
    // console.log('parsedCookie', parsedCookie);
  
    client.emit('connectionResult', { msg: 'helloworld'})
  }

  async handleDisconnect(client: Socket)
  {

  }
}
