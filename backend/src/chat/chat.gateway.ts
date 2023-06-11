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
import { ChatService } from './service/index.js';
import { Logger } from '@nestjs/common';
import { UserSocketsService } from './chat.userSocketsService.js';
import { cli } from 'webpack';
import { promises } from 'dns';
import { channel } from 'diagnostics_channel';
import { type } from 'os';
import * as bcrypt from 'bcrypt';


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
  //                                                        PRIV MESSAGE EVENTS                                                              //
  //*****************************************************************************************************************************************//
  //*****************************************************************************************************************************************//

  //GET ALL MESSAGES OF A CONVERSATION

  @SubscribeMessage('getPrivateConversation')
  async handleGetPrivateConversation(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: {firstUser: number; secondUser: number}) : Promise<void>
  {
    try {
      const { firstUser, secondUser} = data;
      const conversation = await this.chatService.getPrivateConversation(firstUser, secondUser);
      console.log("conversation:", conversation); // Add this line
      const firstUserChatRoom = 'userID_' + firstUser.toString() + '_room';
      const secondUserChatRoom = 'userID_' + secondUser.toString() + '_room';
      this.server.to(firstUserChatRoom).to(secondUserChatRoom).emit('foundPrivateConversation', conversation);
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not get private conversation');
    }
  }

  //SEND A MESSAGE

  @SubscribeMessage('createPrivateMessage')
  async handleCreateMessage(
      @ConnectedSocket() client: Socket, 
      @MessageBody() data: {senderID: number; recipientID: number; content: string}) : Promise<void>
  {
      try {
          const { senderID, recipientID, content} = data;
          const privateMessage = await this.chatService.createOnePrivMessage(senderID, recipientID, content);
          const senderUserChatRoom = 'userID_' + senderID.toString() + '_room';
          const recipientUserChatRoom = 'userID_' + recipientID.toString() + '_room';
          this.server.to(senderUserChatRoom).to(recipientUserChatRoom).emit('privateMessageCreated', privateMessage);
      } catch (error) {
          console.log(error);
          throw new WsException(error.message || 'Could not create private message');
      }
  }
  

  @SubscribeMessage('sendPrivateMessage')
  async handleSendPrivateMessage(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: {senderID: number; recipientID: number; content: string}) : Promise<void>
  {
    try {
      const { senderID, recipientID, content} = data;
      const isBlocked = await this.chatService.isBlocked(senderID, recipientID);
      if (!isBlocked)
      {
        const senderUserChatRoom = 'userID_' + senderID.toString() + '_room';
        this.server.to(senderUserChatRoom).emit('privateMessageSent', data);
      }
      else {
        const senderUserChatRoom = 'userID_' + senderID.toString() + '_room';
        const recipientUserChatRoom = 'userID_' + recipientID.toString() + '_room';
        this.server.to(senderUserChatRoom).to(recipientUserChatRoom).emit('privateMessageSent', data);
      }
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not send private message');
    }
  }


  //BLOCK

  @SubscribeMessage('blockUser')
  async handleBlockUser(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: {blockerID: number; blockeeID: number}) : Promise<void>
  {
    try {
      const { blockerID, blockeeID} = data;
      const blockeEntity = await this.chatService.blockUser(blockerID, blockeeID);
      client.emit('userBlocked');
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not block user');
    }
  }

  //UNBLOCK

  @SubscribeMessage('unblockUser')
  async handleUnblockUser(
    @ConnectedSocket() client: Socket, 
    @MessageBody() data: {blockerID: number; blockeeID: number}) : Promise<void>
  {
    try {
      const { blockerID, blockeeID} = data;
      await this.chatService.unblockUser(blockerID, blockeeID);
      client.emit('userUnblocked');
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not unblock user');
    }
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
    @MessageBody() data: {name: string; userId: number, type: string, psswd?: string}) : Promise<void>
  {
    try {
      const { name, userId, type, psswd } = data;
  
      const channel = await this.chatService.createOneChannel(name, userId);
      const chanID = channel.id;
      await this.chatService.createOneChanMember(chanID, userId);
      await this.chatService.makeOwnerAdmin(userId, chanID);
      if (!Object.values(ChanType).includes(type as ChanType)){
        throw new WsException('Invalid channel type');
      }
      await this.chatService.setChannelType(userId, chanID, ChanType[type as keyof typeof ChanType]);
      if (type == 'PROTECTED') {
        await this.chatService.setChanPassword(chanID, userId, psswd);
      }
      const userSockets = this.userSocketsService.getUserSocketIds(userId);
      console.log('this.server', this.server);
      console.log('this.server.sockets', this.server.sockets);
      for (const socket of userSockets) {
        if (socket){
          const ChanRoomId = 'chan_'+ chanID + '_room';
          socket.join(ChanRoomId);
        }
      }
      // userSockets.forEach(SocketID =>{
      //   const socket = this.server.sockets.sockets.get(SocketID);
      //   if (socket) {
      //     socket.join(chanRoomId);
      //   }
      // })
      this.server.emit('channelCreated', channel);
    }
    catch (error)
    {
      console.log(error);
      throw new WsException(error.message || 'Could not create channel');
    }
    // this.server.emit('created channel');
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
      client.emit('channelFound', channel);
    }
    catch (error){
      console.log(error);
      throw new WsException(error.message || 'Could find channel');
    }
  }

  @SubscribeMessage('GetChannelsByUser')
  async handleGetChannelbyUser(
      @ConnectedSocket() client: Socket,
      @MessageBody() userId: number) : Promise<void>
  {
    try{
      const channels = await this.chatService.findAllChannelsByMember(userId);
      client.emit('channelsByUserFound', channels);
    }
    catch (error){
      console.log(error);
      throw new WsException(error.message || 'Could not get user`s channels');
    }
  }

  @SubscribeMessage('GetChannelMembers')
  async handleChannelMembers(
      @ConnectedSocket() client: Socket,
      @MessageBody() chanId: number) : Promise<void>
  {
    try{
      const members = await this.chatService.findAllMembersByChanID(chanId);
      client.emit('MembersofChannelFound', members);
    }
    catch (error){
      console.log(error);
      throw new WsException(error.message || 'Could not get channel members');
    }
  }

  @SubscribeMessage('GetPublicChannels')
  async handleGetPublicChannels(
    @ConnectedSocket() client: Socket) : Promise<void> {
      try {
        const channels = await this.chatService.findAllPublicChannels();
        this.server.emit('publicChannelsfound', channels);
      }
      catch (error) {
        console.log(error);
        throw new WsException(error.message || 'Could not get public channels');
      }
  }

  @SubscribeMessage('GetProtectedChannels')
  async handleGetProtectedChannels(
    @ConnectedSocket() client: Socket) : Promise<void> {
      try {
        const channels = await this.chatService.findAllProtectedChannels();
        this.server.emit('protectedChannelsfound', channels);
      }
      catch (error) {
        console.log(error);
        throw new WsException(error.message || 'Could not get protected channels');
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
    @MessageBody() data: {senderId: number; chanId: number; content: string}) : Promise<void>
  {
    try {
      const {senderId, chanId, content} = data;
      //check if i am in the channel
      const isMember = await this.chatService.isMember(chanId, senderId);
      if (!isMember) {
        const userRoomId = 'userID_' + senderId.toString() + '_room';
        this.server.to(userRoomId).emit('userIsNotMember');
        throw new WsException('user not in channel');
      }
      //check if i am not muted
      const isMuted = await this.chatService.isMuted(chanId, senderId);
      if (isMuted){
        const userRoomId = 'userID_' + senderId.toString() + '_room';
        this.server.to(userRoomId).emit('userIsMuted');
        throw new WsException('user is muted');
      }
      const chanMessage = await this.chatService.createOneChanMessage(senderId, chanId, content);
      const ChanRoomId = 'chan_'+ chanId + '_room';
      // client.to(ChanRoomId).emit('SentChanMessage', chanMessage);

      this.server.in(ChanRoomId).emit('SentChanMessage', chanMessage);
      // Remember that client.to(room) targets all sockets in a room, but not the sender. If you also want to include the sender, you could use:
    }
    catch (error)
    {
      console.log(error);
      throw new WsException(error.message || 'Could not send message to channel');
    }
  }

  @SubscribeMessage('GetChannelMessages')
  async handleGetChannelMessages(
      @ConnectedSocket() client: Socket,
      @MessageBody() chanId: number) : Promise<void>
  {
    try{
      const messages = await this.chatService.findAllChanMessages(chanId);
      client.emit('channelMessagesFound', channel);
    }
    catch (error){
      console.log(error);
      throw new WsException(error.message || 'Could not channel messages');
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

  //check user has not been banned
  @SubscribeMessage('joinChannel')
  async handleJoinChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {chanID: number, userID: number}) : Promise<void>
  {
    try {
      const {chanID, userID} = data;
      console.log("chanID: ", chanID);
      const isBanned = await this.chatService.isBanned(chanID, userID);
      if (isBanned) {
        const userRoomId = 'userID_' + userID.toString() + '_room';
        this.server.to(userRoomId).emit('userIsBanned');
        throw new WsException('Chan member is banned');
      }
      const chanMember = await this.chatService.createOneChanMember(chanID, userID);
      const userSockets = this.userSocketsService.getUserSocketIds(userID);
      for (const socket of userSockets) {
        if (socket){
          const ChanRoomId = 'chan_'+ chanID + '_room';
          socket.join(ChanRoomId);
        }
      }
      const userRoomId = 'userID_' + userID.toString() + '_room';
      this.server.to(userRoomId).emit('joinnedRoom', chanID);
      // client.emit('userJoinedChannel', chanMember);
      // In the above code, this.server.to(userRoomId).emit('joinRoom', String(chanID)); will emit a 'joinRoom' event to all sockets in the user-specific room. You will then need to handle this 'joinRoom' event on the client-side, where each socket will join the channel room upon receiving the 'joinRoom' event.
    }
    catch (error){
      console.log(error);
      throw new WsException(error.message || 'Could not public or private channel');
    }
  }

  @SubscribeMessage('joinProtectedChannel')
  async handleJoinProtectedChannel(
      @ConnectedSocket() client: Socket,
      @MessageBody() data: {chanID: number, userID: number, password: string}) : Promise<void>
  {
    try {
      const {chanID, userID, password} = data;
      const isBanned = await this.chatService.isBanned(chanID, userID);
      if (isBanned) {
        const userRoomId = 'userID_' + userID.toString() + '_room';
        this.server.to(userRoomId).emit('userIsBanned');
        return;
      }
      const passwordMatches = this.chatService.psswdMatch(chanID, password);
      if (!passwordMatches) {
        throw new WsException('password does not match');
      }
      const chanMember = await this.chatService.createOneChanMember(chanID, userID);
      const userSockets = this.userSocketsService.getUserSocketIds(userID);
      // userSockets.forEach(SocketID =>{
      //   const socket = this.server.sockets.sockets.get(SocketID);
      //   if (socket) {
      //     const ChanRoomId = 'chan_'+ chanID + '_room';
      //     socket.join(ChanRoomId);
      //   }
      // })
      const userRoomId = 'userID_' + userID.toString() + '_room';
      this.server.to(userRoomId).emit('joinRoom', String(chanID));
      // client.emit('userJoinedChannel', chanMember);
      // In the above code, this.server.to(userRoomId).emit('joinRoom', String(chanID)); will emit a 'joinRoom' event to all sockets in the user-specific room. You will then need to handle this 'joinRoom' event on the client-side, where each socket will join the channel room upon receiving the 'joinRoom' event.
    }
    catch (error){
      console.log(error);
      throw new WsException(error.message || 'Could not join protected channel');
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
      @MessageBody() data: {chanOwnerId:number, chanId: number, memberId: number}) : Promise<void>
  {
    try {
    const {chanId, memberId, chanOwnerId} = data;
      const updatedChanMember = await this.chatService.makeChanAdmin(data);
      const ChanRoomId = 'chan_'+ chanId + '_room';
      this.server.to(ChanRoomId).emit('newAdminInRoom');
      // client.emit('MemberisAdmin', updatedChanMember);
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not make member admin');
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
    @MessageBody() data: {chanId: number, memberToMuteId: number, adminId: number, muteDuration: number}) : Promise<void>
  {
    try {
      const {chanId, memberToMuteId, adminId, muteDuration} = data;
      const mutedMember = await this.chatService.muteMember(data);
      const ChanRoomId = 'chan_'+ chanId + '_room';
      this.server.to(ChanRoomId).emit('memberMuted');
      // client.emit('memberIsMuted', mutedMember);
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not mute member');
    }
  }

  @SubscribeMessage('banMember')
  async handleBanMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {chanId: number, memberToBanId: number, adminId: number}) : Promise<void>
  {
    try {
      const {chanId, memberToBanId, adminId} = data;
      const bannedMember = await this.chatService.banMember(data);
        const ChanRoomId = 'chan_'+ chanId + '_room';
        //leave room 
        const userSockets = this.userSocketsService.getUserSocketIds(memberToBanId);
        for (const socket of userSockets) {
          if (socket){
            const ChanRoomId = 'chan_'+ chanId + '_room';
            socket.leave(ChanRoomId);
          }
        }
        this.server.to(ChanRoomId).emit('memberBanned');
        // client.emit('memberIsBanned', bannedMember);
    } 
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not ban Member');
    }
  }

  @SubscribeMessage('kickMember')
  async handleKickMember(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {chanId: number, memberToKickId: number, adminId: number}) : Promise<void>
  {
    try {
      const {chanId, memberToKickId, adminId} = data;
      await this.chatService.kickMember(data);
      const ChanRoomId = 'chan_'+ chanId + '_room';
      const userSockets = this.userSocketsService.getUserSocketIds(memberToKickId);
      for (const socket of userSockets) {
        if (socket){
          const ChanRoomId = 'chan_'+ chanId + '_room';
          socket.leave(ChanRoomId);
        }
      }
      this.server.to(ChanRoomId).emit('memberKicked');
    } 
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not kick member');
    }
  }

  @SubscribeMessage('leaveChannel')
  async handleLeaveChannel(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {chanId: number, userId: number}) : Promise<void>
  {
    try {
      const {chanId, userId} = data;
      await this.chatService.leaveChannel(chanId, userId);
      const ChanRoomId = 'chan_'+ chanId + '_room';
      const userSockets = this.userSocketsService.getUserSocketIds(userId);
      // userSockets.forEach(SocketID =>{
      //   const socket = this.server.sockets.sockets.get(socket);
      //   if (socket) {
      //     socket.leave(ChanRoomId);
      //   }
      // })
      this.server.to(ChanRoomId).emit('user left channel');
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'user could not leave channel');
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
    @MessageBody() data: {chanMember:number, chanId:number, newChanName:string}) : Promise<void>
  {
    try {
      const {chanMember, chanId, newChanName} = data;
      const updatedChannel = await this.chatService.setChanName(data);
      const ChanRoomId = 'chan_'+ chanId + '_room';
      const chanName = updatedChannel.name;
      this.server.to(ChanRoomId).emit('chanNameChanged', chanName);
      // client.emit('channelNameChanged', updatedChannel);
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not set channel name');
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
      @MessageBody() data: {chanId: number; userId: number; newPasswd: string}): Promise<void>
  {
    try {
      const {chanId, userId, newPasswd} = data;
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPasswd, saltRounds);
      const updatedChannel = await this.chatService.setChanPassword(chanId, userId, hashedPassword);
      client.emit('chanPasswdChanged', updatedChannel);
    }
    catch (error)
    {
      console.log(error);
      throw new WsException(error.message || 'Could not set new password');
    }
  }

  @SubscribeMessage('setChannelType')
  async handleSetChannelType(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {userId:number, chanId:number, newChanType:string, password?: string})
  {
    try {
      const {userId, chanId, newChanType, password} = data;
      if (!Object.values(ChanType).includes(newChanType as ChanType)){
        throw new WsException('Invalid channel type');
      }

      if (newChanType == 'PROTECTED' && password) {
        if (password == '') {
          throw new WsException('Password cannot be empty');
        }
        await this.chatService.setChanPassword(chanId, userId, password);
      }
      const updatedChannel = await this.chatService.setChannelType(userId, chanId, ChanType[newChanType as keyof typeof ChanType]);
      const ChanRoomId = 'chan_'+ chanId + '_room';
      const chanType = updatedChannel.type;
      this.server.to(ChanRoomId).emit('chanTypeChanged');
      // this.server.to(ChanRoomId).emit('chanTypeChanged', chanType);
      // client.emit('channelNameChanged', updatedChannel);
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not set channel type');
    }
  }

  //--------------------------------------------------------------------------//
  //                                 USER EVENTS                              //
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

      const userRoomId = 'userID_' + id.toString() + '_room';
      this.server.to(userRoomId).emit('userInfo', {
        id,
        email,
        nickname,
        avatarFilename,
      });
  
      // client.emit('userInfo', {
      //   id,
      //   email,
      //   nickname,
      //   avatarFilename,
      // });
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could get user info');
    }
  }

  @SubscribeMessage('getUserStartsBy')
  async handleGetUsersStartBy(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: {startBy:string, userId:number}) : Promise<void>
  {
    try {
      const {startBy, userId} = data;
      console.log('calling startsby event');
      console.log('startby:', startBy);
      console.log('userid:',userId);
      const users = await this.chatService.findUserStartsby(startBy, userId);
      // const userData = await this.chatService.getUserFromSocket(client);
      // if (!userData){
      //   throw new WsException('user was not found');
      // }
      const userRoomId = 'userID_' + userId.toString() + '_room';
      this.server.to(userRoomId).emit('usersStartByFound', users);
      // client.emit('channelNameChanged', updatedChannel);
    }
    catch (error) {
      console.log(error);
      throw new WsException(error.message || 'Could not set channel name');
    }
  }
  
  //--------------------------------------------------------------------------//
  //                        CONNECTION SET UP EVENTS                          //
  //--------------------------------------------------------------------------//
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
      this.userSocketsService.setUser(userID, client);
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
      this.userSocketsService.deleteUserSocket(userID, client);
      const userWithSocket = this.userSocketsService.getUserSocketIds(userID);
      console.log('userWithSocket: ',userWithSocket);
      const userRoomId = 'userID_' + userID.toString() + '_room';
      client.leave(userRoomId);
      const userChannels = await this.chatService.findAllChannelsByMember(userID);
      userChannels.forEach(chanMember => {
        const chanRoomId = 'chan_' + chanMember.chanId + '_room';
        client.leave(chanRoomId);
      });
    }
  }
}
