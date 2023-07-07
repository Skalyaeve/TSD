
import { ChanType } from '@prisma/client';
import { ChanMember, ChanMessage, Channel } from "@prisma/client";

// Creation methods, equivalent of setters

export async function createChannel(channelData: { name: string, type: ChanType, passwd?: string, chanOwnerRef: { connect: { id: number } } }): Promise<Channel> {
  try {
    const channel: Channel = await this.prisma.channel.create({
      data: channelData,
    });
    if (!channel) {
      throw new Error('could not create channel');
    }
    return channel;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createOneChannel(name: string, chanOwner: number): Promise<Channel> {
  try {
    const channel = this.prisma.channel.create({
      data: {
        name,
        chanOwner,
      },
    });
    if (!channel) {
      throw new Error('could not create channel');
    }
    return channel;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createOneChanMember(chanId: number, memberId: number): Promise<ChanMember> {
  try {
    const chanMember: ChanMember = await this.prisma.chanMember.create({
      data: {
        chanId,
        member: memberId,
      },
    });
    if (!chanMember) {
      throw new Error('channel member could not be created');
    }
    return chanMember;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function addUserToChannel(userId: number, chanID: number): Promise<{userId: number, joinMessage: string}> {
  let isBanned = await this.isBanned(chanID, userId);
  if (isBanned) {
    throw new Error('Chan member is banned');
  }

  await this.createOneChanMember(chanID, userId);

  const user = await this.userService.findOneById(userId);
  const content = 'I just joined the channel';
  const joinMessage = await this.createOneChanMessage(userId, user.nickname, chanID, content);

  return {userId,joinMessage};
}


export async function createOneChanMessage(senderId: number, senderNick: string, chanId: number, content: string): Promise<ChanMessage> {

  try {
    const message: ChanMessage = await this.prisma.chanMessage.create({
      data: {
        senderRef: {
          connect: {
            id: senderId,
          },
        },
        chanRef: {
          connect: {
            id: chanId,
          },
        },
        content,
        senderNick,
      },
    });
    if (!message) {
      throw new Error('could not create chan message');
    }
    return message;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
