
import { ChanType } from '@prisma/client';
import { ChanMember, ChanMessage, Channel } from "@prisma/client";

// Creation methods, equivalent of setters

export async function createChannel(channelData: { name: string, type: ChanType, passwd?: string, chanOwnerRef: { connect: { id: number } } }): Promise<Channel> {
  const channel: Channel = await this.prisma.channel.create({
    data: channelData,
  });
  return channel;
}

export async function createOneChannel(name: string, chanOwner: number): Promise<Channel> {
  const channel = this.prisma.channel.create({
    data: {
      name,
      chanOwner,
    },
  });
  return channel;
}

export async function createOneChanMember(chanId: number, memberId: number): Promise<ChanMember> {
  const chanMember: ChanMember = await this.prisma.chanMember.create({
    data: {
      chanId,
      member: memberId,
    },
  });
  return chanMember;
}

export async function createOneChanMessage(senderId: number, chanId: number, content: string): Promise<ChanMessage> {
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
    },
  });
  return message;
}
