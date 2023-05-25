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
import { ChanType, User } from '@prisma/client';
import { ChatService } from './chat.service.js';
import { Logger } from '@nestjs/common';
import { UserSocketsService } from './chat.userSocketsService.js';
import { cli } from 'webpack';
import { promises } from 'dns';


@WebSocketGateway({cors:
  {
    origin: '*',
    methods: ['GET', 'POST']
  }
  , namespace: 'chat'})

export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
 {
  constructor(
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

  /**
   * 'createChannel' event that creates a channel on the db
   * and emits to the client an event 'channelCreated' with the created channel
   * @param client 
   * @param data 
   */

  @SubscribeMessage('createChannel')
  async onCreateChannel(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: {name: string; type: string; password?: string}) : Promise<void>
  {
    const user = await this.chatService.getUserFromSocket(client);
    const { name, type, password } = data;

    if (!user){
      throw new WsException('Invalid credentials');
    }

    if (!Object.values(ChanType).includes(type as ChanType)){
      throw new WsException('Invalid channel type');
    }

    const channelType: ChanType = type as ChanType;

    const channel = await this.chatService.createChannel({
      name, 
      type: channelType, 
      passwd: password,
      chanOwnerRef: {connect: {id: user.id}}
    });

    client.emit('channelCreated', channel);
  }

  /**
   * Event to find a channel by id and emit it to the client
   * as 'channelFound'
   * @param client 
   * @param data 
   */
  @SubscribeMessage('GetChannel')
  async handleGetChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {chanId: number}) : Promise<void>
  {
    try{
      const channel = await this.chatService.findChannelbyId(data.chanId);
  
      if (!channel){
        throw new WsException('Channel not found');
      }
  
      client.emit('channelFound', channel);
    }
    catch (error){
      console.log(error);
    }
  }

  /**
   * JoinChannel event, will make the giver user join the givne channel
   * and emit an event 'userJoinedChannel' 
   * @param client 
   * @param data 
   */
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {chanID: number, userID: number})
  {
    try {
      const {chanID, userID} = data;
      const chanMember = await this.chatService.createOneChanMember(chanID, userID);
      
      if (!chanMember)
      {
        throw new WsException('Chan member did not joined');
      }
      
      client.emit('userJoinedChannel', chanMember);
    }
    catch (error){
      console.log(error);
    }
  }

  /**
   * sendChanMessageEvent will create a message for the required channel
   * and emit a 'sentChanMessage' back to the client with the chanMessage as data
   * @param client 
   * @param data 
   */
  @SubscribeMessage('sendChanMessage')
  async handleSendChanMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {senderId: number; chanId: number; content: string})
  {
    try {
      const {senderId, chanId, content} = data;
      const chanMessage = await this.chatService.createOneChanMessage(senderId, chanId, content);
  
      if (!chanMessage)
      {
        throw new WsException('Channel message was not sent');
      }
      client.emit('SentChanMessage', chanMessage);
    }
    catch (error)
    {
      console.log(error);
    }
  }

  /**
   * 'getUserInfo: event to get the user information of current client
   * emits an event 'userInfo' to client with the user info,
   * @param client 
   * @returns 
   */
  @SubscribeMessage('getUserInfo')
  async handleUserInfo(@ConnectedSocket() client: Socket): Promise<void> {

    try {

      const userData = await this.chatService.getUserFromSocket(client);
      if (!userData){
        throw new WsException('user was not found');
      }
      const { id, email, nickname, avatarFilename } = userData;
  
      client.emit('userInfo', {
        id,
        email,
        nickname,
        avatarFilename,
      });
    }
    catch (error) {
      console.log(error);
    }
  }

  /**
   * Still don't know the purpose of this :|
   * @param server 
   */
  afterInit(server: any) {
    this.logger.log('initialized');
  }

  /**
   * Handling connection of the socket
   * @param client 
   * @param args 
   */
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

  /**
   * Handling the disconnection of the socket
   * @param client 
   */
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
      const userRoomId = 'userID_' + userID.toString() + '_room';
      client.leave(userRoomId);
    }
  }
}
