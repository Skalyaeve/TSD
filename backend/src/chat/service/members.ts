import { ChanMember } from "@prisma/client";

export async function muteMember(data: { chanId: number, memberToMuteId: number, adminId: number, muteDuration: number }): Promise<ChanMember | null> {

  try {
    const { chanId, memberToMuteId, adminId, muteDuration } = data;
    const checkAdmin = await this.isAdmin(chanId, adminId);
    if (!checkAdmin) {
      throw new Error('user does not have privileges');
    }
    else {
      const isOwner = await this.isOwner(chanId, memberToMuteId);
      if (isOwner) {
        throw new Error('Cannot mute a channel owner');
      }
      else {
        const muteEnd = new Date();
        // muteEnd.setSeconds(muteEnd.getSeconds() + muteDuration);
        muteEnd.setMinutes(muteEnd.getMinutes() + muteDuration);

        const mutedMember = await this.prisma.chanMember.update({
          where: { chanId_member: { chanId, member: memberToMuteId } },
          data: { muteTime: muteEnd },
        });
        if (!mutedMember) {
          throw new Error('could not mute member');
        }
        return mutedMember;
      }
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function kickMember(data: { chanId: number, memberToKickId: number, adminId: number }): Promise<void> {

  try {
    const { chanId, memberToKickId, adminId } = data;
    const checkAdmin = await this.isAdmin(chanId, adminId);
    if (!checkAdmin) {
      throw new Error('User does not have privileges');
    }
    else {
      const isOwner = await this.isOwner(chanId, memberToKickId);
      if (isOwner) {
        throw new Error('Cannot kick a channel owner');
      }
      else {
        const kickedMember = await this.prisma.chanMember.delete({
          where: { chanId_member: { chanId, member: memberToKickId } }
        });
      }
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function banMember(data: { chanId: number, memberToBanId: number, adminId: number }): Promise<ChanMember | null> {

  try {
    const { chanId, memberToBanId, adminId } = data;
    const checkAdmin = await this.isAdmin(chanId, adminId);
    if (!checkAdmin) {
      throw new Error('user does not have privileges');
    }
    else {
      const isOwner = await this.isOwner(chanId, memberToBanId);
      if (isOwner) {
        throw new Error('Cannot mute a channel owner');
      }
      else {
        const bannedMember = await this.prisma.chanMember.delete({
          where: { chanId_member: { chanId, member: memberToBanId } }
        });

        await this.prisma.chanBan.create({
          data: {
            chanId,
            bannedUser: memberToBanId,

          }
        })
        return bannedMember;
      }
    }
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}

export async function leaveChannel(chanId:number, memberId: number): Promise<void> {
  try {
    //check if i am member
    const isMember = await this.isMember(chanId, memberId);
    if (!isMember) {
      throw new Error('user is not in channel');
    }
    await this.prisma.chanMember.delete({
      where: {
        chanId_member: {
          chanId, member: memberId
        }
      }
    })
  }
  catch (error){
    console.error(error);
    throw error;
  }
}