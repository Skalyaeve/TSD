import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer
} from '@nestjs/websockets';

import { Socket, Server } from "socket.io";

@WebSocketGateway(8001, {cors: "*"})
export class ChatGateway {
  @WebSocketServer()
  server
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { user: string, message: string }): void {
    console.log(data.user);
    console.log(data.message);
    this.server.emit('message', data);
  }
}
