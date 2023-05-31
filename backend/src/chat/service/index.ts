import { Injectable } from '@nestjs/common';
import { AuthService } from '../../auth/auth.service.js';
import { UserService } from '../../user/user.service.js';
import { PrismaService } from 'nestjs-prisma';

import {getUserFromSocket} from './getUserFromSocket.js';
import { createChannel, createOneChanMember, createOneChanMessage, createOneChannel } from './createChannel.js';
import { setChanName, setChanPassword, setChannelType, makeChanAdmin, makeOwnerAdmin } from './updateChannel.js';
import { muteMember, banMember, kickMember, leaveChannel } from './members.js';
import { 
  findAllChanMessages,
  findAllChannelsByMember,
  findAllMembersByChanID, 
  findChannelbyId, 
  findManyChanMessages, 
  findAllProtectedChannels, 
  findAllPublicChannels } from './finders.js';
import { isAdmin, isMember, isOwner, psswdMatch, isBanned, isMuted } from './verifications.js'
import { getPrivateConversation, createOnePrivMessage, blockUser, unblockUser, isBlocked} from './private.js'

@Injectable()
export class ChatService {

  constructor(
    private readonly authservice: AuthService,
    private prisma: PrismaService,
    private userService: UserService
  ) { }

  getUserFromSocket = getUserFromSocket;

  // Creation methods, equivalent of setters
  createChannel = createChannel
  createOneChanMember = createOneChanMember
  createOneChanMessage = createOneChanMessage
  createOneChannel = createOneChannel

  // setters that don't create but change values
  setChanName = setChanName
  setChanPassword = setChanPassword
  setChannelType = setChannelType
  makeChanAdmin = makeChanAdmin
  makeOwnerAdmin = makeOwnerAdmin

  // Member methods
  muteMember = muteMember
  banMember = banMember
  kickMember = kickMember
  leaveChannel = leaveChannel

  //Find methods, equivalent of getters
  findAllChanMessages = findAllChanMessages
  findAllChannelsByMember = findAllChannelsByMember
  findAllMembersByChanID = findAllMembersByChanID
  findChannelbyId = findChannelbyId
  findManyChanMessages = findManyChanMessages
  findAllPublicChannels = findAllPublicChannels
  findAllProtectedChannels = findAllProtectedChannels


  //Verification methods
  isAdmin = isAdmin
  isMember = isMember
  isOwner = isOwner
  psswdMatch = psswdMatch
  isBanned = isBanned
  isMuted = isMuted

  //--------------------------------------------------------------------------//
  //                              PRIVATE MESSAGE                             //
  //--------------------------------------------------------------------------//

  getPrivateConversation = getPrivateConversation
  createOnePrivMessage = createOnePrivMessage
  blockUser = blockUser
  unblockUser = unblockUser
  isBlocked = isBlocked;

}