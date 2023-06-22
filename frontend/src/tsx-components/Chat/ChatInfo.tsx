
import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { GiBootKick } from "react-icons/gi";
import { FaBan } from "react-icons/fa";
import { BiVolumeMute } from "react-icons/bi";
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

// interface UserInfo {
//     id: number; 
//     email: string; 
//     nickname: string; 
//     avatarFilename: string
// }

interface ChatInfoProps {
    userInfo: Contact | null;
    selectedChannel: Channel | null;
    selectedContact: Contact | null;
}

function renderButtons(member: ChanMember, isAdmin: boolean, userInfo: Contact){

    // const [muteDuration, setMuteDuration] = useState<number>(0);

    console.log("RENDERBUTTONS");
    const handleKick = () => {
        socket.emit('kickMember', {chanId: member.chanId, memberToKickId: member.member, adminId: userInfo.id});
    }

    const handleBan = () => {
        socket.emit('banMember', {chanId: member.chanId, memberToBanId: member.member, adminId: userInfo.id});
    }

    // const handleMute = () => {
        // socket.emit('muteMember', {chanId: member.chanId, memberToKickId: member.member, adminId: userInfo.id, muteDuration: muteDuration});
    const handleMute = () => {
        socket.emit('muteMember', {chanId: member.chanId, memberToKickId: member.member, adminId: userInfo.id});
    }
    console.log("isAdmin: ", isAdmin);
    if (isAdmin) {
        return (
            <div className="admin-action-button">
                <button className="member-action-btn" onClick={handleKick}>
                    <GiBootKick/>
                </button>
                <button className="member-action-btn" onClick={handleBan}>
                    <FaBan/>
                </button>
                <button className="member-action-btn" onClick={handleMute}>
                    <BiVolumeMute/>
                </button>
            </div>
        )
    }
    return null;


}

function renderMemberStatus(member: ChanMember, membersStatus: Map<number, boolean>, isAdmin: boolean, userInfo: Contact) {
    const status = membersStatus.get(member.member);
    
    return (
      <div className="member-status">
        <span className={`status-indicator ${status ? 'online' : 'offline'}`}></span>
        {member.memberRef.nickname}
        {renderButtons(member, isAdmin, userInfo)}
      </div>
    );
  }
  

export default function ChatInfo({ userInfo, selectedChannel, selectedContact}: ChatInfoProps)
{
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [members, setMembers] = useState<ChanMember[]>([]);
    const [contactStatus, setContactStatus] = useState<boolean>(false);
    const [membersStatus, setMembersStatus] = useState<Map<number, boolean>>(new Map());

    const fetchMemberStatus = () => {
        if (selectedChannel && !selectedContact) {
            members.forEach((member: ChanMember) => {
                socket.emit('getUserStatus', {userId: userInfo?.id, memberId: member.member})
            });
            socket.on('foundUserStatus', (data) => {
                setMembersStatus((prevStatus) => new Map(prevStatus).set(data.memberId, data.status));
            });
        }
        return () => {
            socket.off('foundUserStatus');
        };
    }

    useEffect(() => {
        if (userInfo) {
            socket.emit('isMemberAdmin', {chanId: selectedChannel?.id, memberId: userInfo.id});
            socket.on('foundAdminStatus', (data) => {
                setIsAdmin(data);
            })
        }
    }, [userInfo, selectedChannel]);

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
        <div className="members-title">
            <h1>
                Members
            </h1>
            <button className="Chan-refresh-btn" onClick={fetchMemberStatus}>
                <FiRefreshCw/>
            </button>
        </div>
        <div>
            {selectedChannel && userInfo && members.map(member => renderMemberStatus(member, membersStatus, isAdmin, userInfo))}
            {/* ... other components */}
        </div>
    </div>
);

}