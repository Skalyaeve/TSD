import { ChanMember, ChanMessage, Channel } from "@prisma/client";

export async function findChannelbyId(id: number): Promise<Channel | null> {
  const foundChannel: Channel | null = await this.prisma.channel.findUnique({
    where: { id },
  })
  return foundChannel;
}

export async function findAllMembersByChanID(chanId: number): Promise<ChanMember[]> {
  const members: ChanMember[] = await this.prisma.chanMember.findMany({
    where: {
      chanId,
    },
  });
  return members;
}

export async function findAllChannelsByMember(member: number): Promise<ChanMember[]> {
  const channels: ChanMember[] = await this.prisma.chanMember.findMany({
    where: {
      member,
    },
  });
  return channels;
}

export async function findManyChanMessages(chanId: number, count: number): Promise<ChanMessage[]> {
  const messages: ChanMessage[] = await this.prisma.chanMessage.findMany({
    where: {
      chanId,
    },
    orderBy: {
      timeSent: "asc",
    },
    take: count,
  });
  return messages;
}

export async function findAllChanMessages(chanId: number): Promise<ChanMessage[]> {
  const messages: ChanMessage[] = await this.prisma.chanMessage.findMany({
    where: {
      chanId,
    },
    orderBy: {
      timeSent: "asc",
    },
  });
  return messages;
}
