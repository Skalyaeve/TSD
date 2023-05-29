import * as bcrypt from 'bcrypt';
import { ChanMember, Channel } from "@prisma/client";

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
  const member: ChanMember = await this.prisma.chanMember.findUnique({
    where: {
      chanId_member: {
        chanId,
        member: memberId,
      },
    },
  });
  if (member?.isAdmin) {
    return true;
  }
  return false;
}

export async function isOwner(chanId: number, memberId: number): Promise<boolean> {
  const channel: Channel = await this.prisma.channel.findUnique({
    where: {
      id: chanId,
    },
  });
  return channel.chanOwner === memberId;
}

export async function psswdMatch(chanId: number, password: string): Promise<boolean> {
  const channel: Channel = await this.prisma.channel.findUnique({
    where: {
      id: chanId,
    },
  });
  const hashedPassword = channel.passwd;
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

