import * as bcrypt from 'bcrypt';
import { ChanMember, Channel, ChanBan, Blocked } from "@prisma/client";


export async function isMember(chanId: number, memberId: number): Promise<boolean> {
  const member: ChanMember = await this.prisma.chanMember.findUnique({
    where: {
      chanId_member: {
        chanId,
        member: memberId,
      },
    },
  });
  if (member) {
    return true;
  }
  return false;
}

export async function isAdmin(chanId: number, memberId: number): Promise<boolean> {
  try {
    const member: ChanMember = await this.prisma.chanMember.findUnique({
      where: {
        chanId_member: {
          chanId,
          member: memberId,
        },
      },
    });
    if (!member) {
      throw new Error('User is not member of channel');
    }
    if (member?.isAdmin) {
      return true;
    }
    return false;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function isOwner(chanId: number, memberId: number): Promise<boolean> {
  try {
    const channel: Channel = await this.prisma.channel.findUnique({
      where: {
        id: chanId,
      },
    });
    if (!channel) {
      throw new Error('Channel does not exist');
    }
    return channel.chanOwner === memberId;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function psswdMatch(chanId: number, password: string): Promise<boolean> {
  try {
    const channel: Channel = await this.prisma.channel.findUnique({
      where: {
        id: chanId,
      },
    });
    if (!channel) {
      throw new Error('Channel not found');
    }
    const hashedPassword = channel.passwd;
    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log("isMatch:", isMatch);
    return isMatch;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function isBanned(chanId:number, userId: number): Promise<boolean> {
  try {
    const channel = await this.prisma.channel.findUnique({
      where: {
        id: chanId,
      }
    });
    
    if (!channel) {
      throw new Error('channel does not exist');
    }
    const banRecord = await this.prisma.chanBan.findFirst({
      where: {
        chanId: chanId,
        bannedUser: userId,
      },
    });
    return banRecord != null;
  }
  catch (error)
  {
    console.error(error);
    throw error;
  }
}

export async function isMuted(chanId:number, userId:number) : Promise<boolean> {
  try {
    const memberRecord = await this.prisma.ChanMember.findFirst({
      where: {
        chanId: chanId,
        member: userId,
      }
    });
    if (!memberRecord) {
      throw new Error('no member record');
    }

    const now = new Date();
    const {muteTime} = memberRecord;
    const isMute = now.valueOf() <= muteTime.valueOf();
    return isMute;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
