import { WsException } from '@nestjs/websockets';
import { ChanMember, Channel } from "@prisma/client";
import { ChanType } from '@prisma/client';
import * as bcrypt from 'bcrypt';


export async function setChanPassword(chanId: number, userId: number, newPasswd: string): Promise<Channel | null> {
  try {
    // const {chanId, userId, newPasswd} = data;

    if (this.isAdmin(chanId, userId)) {
      const updatedChannel = await this.prisma.channel.update({
        where: { id: chanId },
        data: { passwd: newPasswd }
      }
      );
      if (!updatedChannel) {
        throw new Error("Error in setting new passwd");
      }
      return updatedChannel;
    }
    else {
      throw new Error("User is not admin");
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setChanName(data: { chanMember: number; chanId: number, newChanName: string }): Promise<Channel | null> {
  try {
    const { chanMember, chanId, newChanName } = data;
    const isAdmin = await this.isAdmin(chanId, chanMember);
    if (!isAdmin) {
      throw new Error('Member does not have channel privileges')
    }
    else {
      const updatedChannel = await this.prisma.channel.update(
        {
          where: { id: chanId },
          data: { name: newChanName }
        }
      );
      if (!updatedChannel) {
        throw new Error("Could not change name");
      }
      return updatedChannel;
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setChannelType(userId: number, chanID: number, type: ChanType): Promise<Channel> {
  try {
    const isOwner = await this.isOwner(chanID, userId);
    if (!isOwner) {
      throw new Error('not an owner, cannot set type')
    }
    const channel = await this.prisma.channel.update({
      where: { id: chanID },
      data: { type }
    });
    if (!channel) {
      throw new Error('could not change channel type')
    }
    return channel;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

// Make the owner user of the channel the admin of it
export async function makeOwnerAdmin(userId: number, chanId: number): Promise<ChanMember | null> {
  try {
    const updatedMember: ChanMember | null = await this.prisma.chanMember.update({
      where: {
        chanId_member: {
          chanId,
          member: userId,
        },
      },
      data: {
        isAdmin: true,
      }
    });
    if (!updatedMember) {
      throw new Error('could not make user admin of channel');
    }
    return updatedMember;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

// Making a user an admin
export async function makeChanAdmin(data: { chanOwnerId: number, chanId: number, memberId: number }): Promise<ChanMember | null> {
  try {
    const { chanOwnerId, chanId, memberId } = data;

    const isOwner = await this.isOwner(chanId, chanOwnerId);
    if (!isOwner) {
      throw new WsException('not channel owner');
    }
    else {
      const updatedMember: ChanMember | null = await this.prisma.chanMember.update({
        where: {
          chanId_member: {
            chanId,
            member: memberId,
          },
        },
        data: {
          isAdmin: true,
        }
      });

      if (!updatedMember) {
        throw new Error('could not make user admin of channel');
      }
      return updatedMember;
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
