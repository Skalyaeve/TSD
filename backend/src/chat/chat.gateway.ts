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
import { UserService } from '../user/user.service.js';
import { ChatService } from './chat.service.js';
import { Logger } from '@nestjs/common';
// import { UserSockets } from './chat.userSockets.js';


@WebSocketGateway({cors:
  {
    origin: '*',
    methods: ['GET', 'POST']
  }
  , namespace: 'chat'})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
 {
  constructor(
    private readonly userService: UserService,
    private readonly chatService: ChatService,
    // private readonly userSocket: UserSockets,
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

  afterInit(server: any) {
    this.logger.log('initialized');
  }

  async handleConnection(client: Socket, ...args:any[])
  {
    console.log('success');
    const userData = await this.chatService.getUserFromSocket(client);
    if (!userData)
      client.disconnect();
    // console.log(userData.id);
    // this.userSocket.setUser(userData.id, client.id);
    client.emit('connectionResult', { msg: 'helloworld'})
  }

  async handleDisconnect(client: Socket)
  {
    console.log('client disconnected: ', client.id);
  }
}
