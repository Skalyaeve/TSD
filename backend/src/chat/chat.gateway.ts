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
import { Socket, Server } from "socket.io";
import { User } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import { ChatService } from './chat.service';
import { Logger } from '@nestjs/common';


@WebSocketGateway(8001, {cors: "*"})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect
 {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService
    ){}

  private logger: Logger = new Logger('ChatGateway');
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: { user: string, message: string }, @ConnectedSocket() client: Socket): void {
    console.log(data.user);
    console.log(data.message);
    client.broadcast.emit('message', data); // Use broadcast.emit() to send the message to all clients except the sender
  }

  // afterInit(server: any) {
  //   this.logger.log('initialized');
  // }

  async handleConnection(client: Socket, ...args:any[])
  {
    console.log('success');
    // console.log('handshake: ', client.handshake);
    const userData = await this.chatService.getUserFromSocket(client);

    client.emit('connectionResult', { msg: 'helloworld'})
  }

  async handleDisconnect(client: Socket)
  {
    console.log('client disconnected: ', client.id);
  }
}
