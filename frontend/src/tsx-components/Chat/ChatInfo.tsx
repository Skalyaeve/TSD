
import React, { useState, useEffect } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";

import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css"
import { socket } from '../Root.tsx'

interface User {
    nickname: string;
}

interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string; // Or your ChanType if defined
    passwd: string | null;
    // Add more fields as necessary
}

interface Contact {
    id: number; 
    email: string;
    nickname: string;
    avatarFilename: string
}

interface ChanMember {
    chanId: number;
    member: number;
    isAdmin: boolean;
    muteTime: string; // or Date, depending on how you want to handle it
    memberRef: User;
}

interface ChatInfoProps {
    userInfo: Contact | null;
    selectedChannel: Channel | null;
    selectedContact: Contact | null;
}


function renderMemberStatus(member: ChanMember, membersStatus: Map<number, boolean>) {
    // console.log("GOING TO RENDER MEMBER STATUS");
    // console.log(member);
    // console.log(membersStatus);
    const status = membersStatus.get(member.member);
    
    return (
      <div className="member-status">
        <span className={`status-indicator ${status ? 'online' : 'offline'}`}></span>
        {member.memberRef.nickname}
      </div>
    );
  }
  

export default function ChatInfo({ userInfo, selectedChannel, selectedContact}: ChatInfoProps)
{
    const [members, setMembers] = useState<ChanMember[]>([]);
    const [contactStatus, setContactStatus] = useState<boolean>(false);
    const [membersStatus, setMembersStatus] = useState<Map<number, boolean>>(new Map());


    useEffect(() => {

        if (selectedContact && !selectedChannel){
            socket.emit('getUserStatus', { userId: userInfo?.id, memberId: selectedContact?.id });
    
            socket.on('foundUserStatus', (data) => {
                if (data.memberId === selectedContact?.id) {
                    setContactStatus(data.status);
                }
            });
        }
        else if (selectedChannel && !selectedContact){
            console.log("GETTING CHANNEL MEMBERS");
            socket.emit('GetChannelMembers', {chanId: selectedChannel.id, userId: userInfo?.id});
            socket.on('MembersofChannelFound', (members) => {
                setMembers(members);

                members.forEach((member: ChanMember) => {
                    socket.emit('getUserStatus', { userId: userInfo?.id, memberId: member.member })
                })
            });
            socket.on('foundUserStatus', (data) => {
                setMembersStatus((prevStatus) => new Map(prevStatus).set(data.memberId, data.status));
            });
        }

        return () => {
            socket.off('foundUserStatus');
            socket.off('MembersofChannelFound');
        };
    }, [userInfo, selectedContact, selectedChannel]);

return (
    <div>
        {selectedChannel && members.map(member => renderMemberStatus(member, membersStatus))}
        {/* ... other components */}
    </div>
);

}