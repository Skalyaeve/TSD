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
import { channel } from 'diagnostics_channel';


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

  //*****************************************************************************************************************************************//
  //*****************************************************************************************************************************************//
  //                                                          CHANNEL EVENTS                                                                 //
  //*****************************************************************************************************************************************//
  //*****************************************************************************************************************************************//


  //--------------------------------------------------------------------------//
  //                            CHANNEL SETUP EVENTS                          //
  //--------------------------------------------------------------------------//

  /**
   * 'createChannel' event that creates a channel on the db
   * and emits to the client an event 'channelCreated' with the created channel
   * @param client 
   * @param data 
   */

  @SubscribeMessage('createChannel')
  async onCreateChannel(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: {name: string; userId: number}) : Promise<void>
  {
    const { name, userId } = data;

    const channel = await this.chatService.createOneChannel(name, userId);
    const chanID = channel.id;
    await this.chatService.createOneChanMember(chanID, userId);
    await this.chatService.makeOwnerAdmin(userId, chanID);

    this.server.emit('created channel');
    // client.emit('channelCreated', channel);
  }


  //--------------------------------------------------------------------------//
  //                         CHANNEL RETRIEVE EVENTS                          //
  //--------------------------------------------------------------------------//

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
  

  @SubscribeMessage('GetChannelsByUser')
  async handleGetChannelbyUser(
      @ConnectedSocket() client: Socket,
      @MessageBody() userId: number) : Promise<void>
  {
    try{
      const channels = await this.chatService.findAllChannelsByMember(userId);
      if (!channels){
        throw new WsException('Channels not found');
      }
      client.emit('channelsByUserFound', channels);
    }
    catch (error){
      console.log(error);
    }
  }

  @SubscribeMessage('GetChannelMembers')
  async handleChannelMembers(
      @ConnectedSocket() client: Socket,
      @MessageBody() chanId: number) : Promise<void>
  {
    try{
      const members = await this.chatService.findAllMembersByChanID(chanId);
      if (!members){
        throw new WsException('Members not found');
      }
      client.emit('MembersofChannelFound', members);
    }
    catch (error){
      console.log(error);
    }
  }


  //--------------------------------------------------------------------------//
  //                           CHANNEL MESSAGE EVENTS                         //
  //--------------------------------------------------------------------------//

  //to test the difference between the client.emit and the server.emit 
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
      if (!chanMessage) {
        throw new WsException('Channel message was not sent');
      }
      const ChanRoomId = 'chan_'+ chanId + '_room';
      // client.to(ChanRoomId).emit('SentChanMessage', chanMessage);

      this.server.in(ChanRoomId).emit('SentChanMessage', chanMessage);
      // Remember that client.to(room) targets all sockets in a room, but not the sender. If you also want to include the sender, you could use:
    }
    catch (error)
    {
      console.log(error);
    }
  }

  @SubscribeMessage('GetChannelMessages')
  async handleGetChannelMessages(
      @ConnectedSocket() client: Socket,
      @MessageBody() chanId: number) : Promise<void>
  {
    try{
      const messages = await this.chatService.findAllChanMessages(chanId);
      if (!messages){
        throw new WsException('Channel messages were not found');
      }
      client.emit('channelMessagesFound', channel);
    }
    catch (error){
      console.log(error);
    }
  }

  //--------------------------------------------------------------------------//
  //                           CHANNEL MEMBER EVENTS                          //
  //--------------------------------------------------------------------------//

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
      if (!chanMember) {
        throw new WsException('Chan member did not joined');
      }
      else {
        const userSockets = this.userSocketsService.getUserSocketIds(userID);
        userSockets.forEach(SocketID =>{
          const socket = this.server.sockets.sockets.get(SocketID);
          if (socket) {
            const ChanRoomId = 'chan_'+ chanID + '_room';
            socket.join(ChanRoomId);
          }
        })
        const userRoomId = 'userID_' + userID.toString() + '_room';
        this.server.to(userRoomId).emit('joinRoom', String(chanID));
        // client.emit('userJoinedChannel', chanMember);
        // In the above code, this.server.to(userRoomId).emit('joinRoom', String(chanID)); will emit a 'joinRoom' event to all sockets in the user-specific room. You will then need to handle this 'joinRoom' event on the client-side, where each socket will join the channel room upon receiving the 'joinRoom' event.
      }
    }
    catch (error){
      console.log(error);
    }
  }

  /**
   * makeMemberAdmin event makes a given member admin
   * and returns to the client an event with the updated
   * channel member
   * @param client 
   * @param data 
   */
  @SubscribeMessage('makeMemberAdmin')
  async handleMakeMemberAdmin(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {chanOwnerId:number, chanId: number, memberId: number})
  {
    try {
    const {chanId, memberId, chanOwnerId} = data;
      const updatedChanMember = await this.chatService.makeChanAdmin(data);
      if (!updatedChanMember) {
        throw new WsException('could not make member admin');
      }
      const ChanRoomId = 'chan_'+ chanId + '_room';
      this.server.to(ChanRoomId).emit('newAdminInRoom');
      // client.emit('MemberisAdmin', updatedChanMember);
    }
    catch (error) {
      console.log(error);
    }
  }
  /**
   * muteMember event, will emit to the client an event with the mutedMember
   * @param client 
   * @param data 
   */
  @SubscribeMessage('muteMember')
  async handleMuteMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {chanId: number, memberToMuteId: number, adminId: number, muteDuration: number})
  {
    try {
      const {chanId, memberToMuteId, adminId, muteDuration} = data;
      const mutedMember = await this.chatService.muteMember(data);
      if (!mutedMember) {
        throw new WsException('could not mute member');
      }
      else {
        const ChanRoomId = 'chan_'+ chanId + '_room';
        this.server.to(ChanRoomId).emit('memberMuted');
        // client.emit('memberIsMuted', mutedMember);
      }
    }
    catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('banMember')
  async handleBanMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {chanId: number, memberToBanId: number, adminId: number})
  {
    try {
      const {chanId, memberToBanId, adminId} = data;
      const bannedMember = await this.chatService.banMember(data);
      if (!bannedMember)  {
        throw new WsException('could not ban member')
      }
      else {
        
        const ChanRoomId = 'chan_'+ chanId + '_room';   
        this.server.to(ChanRoomId).emit('memberBanned');
        // client.emit('memberIsBanned', bannedMember);
      }
    } 
    catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('kickMember')
  async handleKickMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {chanId: number, memberToKickId: number, adminId: number})
  {
    try {
      const {chanId, memberToKickId, adminId} = data;
      const kickedMember = await this.chatService.kickMember(data);
      if (!kickedMember)  {
        throw new WsException('could not ban member')
      }
      else {
        const ChanRoomId = 'chan_'+ chanId + '_room';   
        this.server.to(ChanRoomId).emit('memberKicked');
        // client.emit('memberIsBanned', kickedMember);
      }
    } 
    catch (error) {
      console.log(error);
    }
  }

  //--------------------------------------------------------------------------//
  //                           CHANNEL UPDATE EVENTS                          //
  //--------------------------------------------------------------------------//

  /**
   * event setChannelName to change the name of a channel
   * will check the user that is changing the name is admin
   * emit back to the client an event with the updated channel
   * @param client 
   * @param data 
   */
  @SubscribeMessage('setChannelName')
  async handleSetChannelName(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {chanMember:number, chanId:number, newChanName:string})
  {
    try {
      const {chanMember, chanId, newChanName} = data;
      const updatedChannel = await this.chatService.setChanName(data);
      if (!updatedChannel) {
        throw new WsException('could not change name of channel');
      }
      const ChanRoomId = 'chan_'+ chanId + '_room';
      const chanName = updatedChannel.name;
      this.server.to(ChanRoomId).emit('chanNameChanged', chanName);
      // client.emit('channelNameChanged', updatedChannel);
    }
    catch (error) {
      console.log(error);
    }
  }

  /**
   * setNewPasswd event to update the password of a channel
   * returns the client an event with the updated channel
   * @param client 
   * @param data 
   */
  @SubscribeMessage('setNewPasswd')
  async handleSetNewUserPassword(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {chanId: number; userId: number; newPasswd: string})
  {
    try {
      const {chanId, userId, newPasswd} = data;
      const updatedChannel = await this.chatService.setChanPassword(data);

      if (!updatedChannel)
      {
        throw new WsException('Password could not be set');
      }
      client.emit('chanPasswdChanged', updatedChannel);
    }
    catch (error)
    {
      console.log(error);
    }
  }

  //--------------------------------------------------------------------------//
  //                        CONNECTION SET UP EVENTS                          //
  //--------------------------------------------------------------------------//

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
      // const userWithSocket = this.userSocketsService.getUserSocketIds(userID);
      // console.log('userWithSocket: ',userWithSocket);
      const userRoomId = 'userID_' + userID.toString() + '_room';
      const userChannels = await this.chatService.findAllChannelsByMember(userID);

      
      client.join(userRoomId);

      // const userChannels = 
      // Function that retrieve channels where in member;
      // const userDM = 
      // Function that retrieve private discussions;

      userChannels.forEach(channel =>{
        const chanRoomId = 'chan_'+ channel.chanId + '_room';
        client.join(chanRoomId);
      })
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
