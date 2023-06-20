import { ChanMember, ChanMessage, Channel, User } from "@prisma/client";

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
      include: {
        memberRef: {
          select: {
            nickname: true,
          },
        },
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
      throw new Error('channels by member not found');
    }
    return channels;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}


export async function findAllChannelsNonMember(member: number): Promise<Channel[]> {
  try {
    const memberChannels: ChanMember[] = await this.prisma.chanMember.findMany({
      where: {
        member,
      },
    });

    const memberChannelIds = memberChannels.map(channel => channel.chanId);

    const nonMemberChannels: Channel[] = await this.prisma.channel.findMany({
      where: {
        id: {
          notIn: memberChannelIds,
        },
      },
    });
    if (!nonMemberChannels) {
      throw new Error('channels user is not member not found');
    }
    return nonMemberChannels;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}


export async function findAllChannelsByUserId(member: number): Promise<Channel[]> {
  try {
    const channels: Channel[] = await this.prisma.chanMember.findMany({
      where: {
        member,
      },
      include: {
        chanRef: true, // Assuming that this is the correct relation field name
      },
    }).then(chanMembers => chanMembers.map(chanMember => chanMember.chanRef));

    if (!channels || channels.length === 0) {
      throw new Error('channels by member not found');
    }

    return channels;
  } catch (error) {
    console.error(error);
    throw error;
  }
}



export async function findChannelsthatStartby(startBy:string): Promise<Channel[]> {
  try {
    const channels: Channel[] = await this.prisma.channel.findMany({
      where: {
        startsWith: startBy,
      }
    });
    if (!channels) {
      throw new Error('channels by member not found');
    }
    return channels;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findAllPublicChannels(): Promise<Channel[]>{
  try {
    const channels: Channel[] = await this.prisma.channel.findMany(
      {
        where: {
          type: 'PUBLIC'
        }
      }
    );
    if (!channels) {
      throw new Error('no public channels');
    }
    return channels;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findAllProtectedChannels(): Promise<Channel[]>{
  try {
    const channels: Channel[] = await this.prisma.channel.findMany(
      {
        where: {
          type: 'PROTECTED'
        }
      }
    );
    if (!channels) {
      throw new Error('no protected channels');
    }
    return channels;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function findAllChannelsNotMember(): Promise<Channel[]>{
  try {
    const channels: Channel[] = await this.prisma.channel.findMany(
      {
        where: {
          type: 'PROTECTED'
        }
      }
    );
    if (!channels) {
      throw new Error('no protected channels');
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


export async function findUserStartsby(startBy:string, userId:number): Promise<User[]> {
  try {
    const users: User[] = await this.prisma.user.findMany({
      where: {
        AND: [
          {
            nickname: {
              startsWith: startBy,
            }
          },
          {
            id: {
              not: userId,
            }
          }
        ]
      }
    });
    if (!users) {
      throw new Error('users by member not found');
    }
    return users;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
