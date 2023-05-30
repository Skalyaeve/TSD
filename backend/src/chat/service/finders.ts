import { ChanMember, ChanMessage, Channel } from "@prisma/client";

export async function findChannelbyId(id: number): Promise<Channel | null> {
  try {
    const foundChannel: Channel | null = await this.prisma.channel.findUnique({
      where: { id },
    })
    if (!foundChannel) {
      throw new Error('channel with given id not found');
    }
    return foundChannel;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findAllMembersByChanID(chanId: number): Promise<ChanMember[]> {
  try {
    const members: ChanMember[] = await this.prisma.chanMember.findMany({
      where: {
        chanId,
      },
    });
    if (!members) {
      throw new Error('members for given chanID not found');
    }
    return members;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findAllChannelsByMember(member: number): Promise<ChanMember[]> {
  try {
    const channels: ChanMember[] = await this.prisma.chanMember.findMany({
      where: {
        member,
      },
    });
    if (!channels) {
      throw new Error('channels by member not found')
    }
    return channels;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findManyChanMessages(chanId: number, count: number): Promise<ChanMessage[]> {
  try {
    const messages: ChanMessage[] = await this.prisma.chanMessage.findMany({
      where: {
        chanId,
      },
      orderBy: {
        timeSent: "asc",
      },
      take: count,
    });
    if (!messages) {
      throw new Error('could not find the quantity of messages required');
    }
    return messages;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findAllChanMessages(chanId: number): Promise<ChanMessage[]> {
  try {
    const messages: ChanMessage[] = await this.prisma.chanMessage.findMany({
      where: {
        chanId,
      },
      orderBy: {
        timeSent: "asc",
      },
    });
    if (!messages) {
      throw new Error('could not find messages for given channel');
    }
    return messages;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
