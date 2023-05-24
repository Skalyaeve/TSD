import {
  SubscribeMessage,
  WebSocketGateway,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WsException
} from '@nestjs/websockets';  
import { Socket, Server } from "socket.io";
import { User } from '@prisma/client';
import { UserService } from '../user/user.service.js';
import { ChatService } from './chat.service.js';
import { Logger } from '@nestjs/common';
import { UserSocketsService } from './chat.userSocketsService.js';


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
    private readonly userSocketsService: UserSocketsService,
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

  @SubscribeMessage('getUserInfo')
  async handleUserInfo(@ConnectedSocket() client: Socket): Promise<void> {
    const userData = await this.chatService.getUserFromSocket(client);
    if (!userData) return;
    const { id, email, nickname, avatarFilename } = userData;

    client.emit('userInfo', {
      id,
      email,
      nickname,
      avatarFilename,
    });
  }

  afterInit(server: any) {
    this.logger.log('initialized');
  }

  async handleConnection(client: Socket, ...args:any[])
  {
    console.log('success connected with client id', client.id);
    const userData = await this.chatService.getUserFromSocket(client);
    if (!userData)
    {
      client.disconnect();
     
      // throw new WsException('Invalid token.')
    }
    else{
      // const { id, email, nickname, avatarFilename } = userData;

      // client.emit('userInfo', {
      //   id,
      //   email,
      //   nickname,
      //   avatarFilename,
      // });

      console.log('userData: ', userData);
      const userID = userData.id;
      console.log('userID: ', userID);
      this.userSocketsService.setUser(userID, client.id);
      const userWithSocket = this.userSocketsService.getUserSocketIds(userID);
      console.log('userWithSocket: ',userWithSocket);
      const userRoomId = 'userID_' + userID.toString() + '_room';
      client.join(userRoomId);

      // const userChannels = 
      // Function that retrieve channels where in member;
      // const userDM = 
      // Function that retrieve private discussions;


      client.emit('connectionResult', { msg: 'connected successfully'});


      // client.emit('connectionResult', { msg: 'helloworld', userChannels: userChannels, userDM: userDM});

     //  userDM.senderRef.nickname == userData.nickname ? userDM.receiptRef.nickname :  userDM.senderRef.nickname

    }
  }

  async handleDisconnect(client: Socket)
  {
    console.log('client disconnected: ', client.id);
    const userData = await this.chatService.getUserFromSocket(client);
    if (userData)
    {
      const userID = userData.id;
      this.userSocketsService.deleteUserSocket(userID, client.id);
      const userWithSocket = this.userSocketsService.getUserSocketIds(userID);
      console.log('userWithSocket: ',userWithSocket);
    }
  }
}
