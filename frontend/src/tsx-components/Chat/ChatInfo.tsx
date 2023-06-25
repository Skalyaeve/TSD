
import React, { useState, useEffect } from "react";
import { FiRefreshCw } from "react-icons/fi";
import { GiBootKick } from "react-icons/gi";
import { FaBan } from "react-icons/fa";
import { BiVolumeMute } from "react-icons/bi";
import { GiConfirmed } from "react-icons/gi";
import { GiCancel } from "react-icons/gi";
import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css";
import { socket } from '../Root.tsx';



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

interface RenderButtonsProps {
    member: ChanMember;
    isAdmin:boolean;
    userInfo: Contact
}

function RenderButtons({member, isAdmin, userInfo} : RenderButtonsProps){

    const [muteDuration, setMuteDuration] = useState<number>(0);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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
        setIsModalOpen(true);
        // socket.emit('muteMember', {chanId: member.chanId, memberToKickId: member.member, adminId: userInfo.id});
    }

    const confirmMute = () => {
        setIsModalOpen(false);
        socket.emit('muteMember', {chanId: member.chanId, memberToMuteId: member.member, adminId: userInfo.id, muteDuration: muteDuration});
    }

    const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // update muteDuration when the input value changes
        const value = parseInt(event.target.value, 10);

    // update muteDuration only if value is greater than or equal to 0
        if (value >= 0) {
            setMuteDuration(value);
        }
        else {
            alert("mute duration is negative");
        }
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
                <Modal 
                    isOpen={isModalOpen}
                    className="modal-mute-member"
                    overlayClassName="overlay-mute-member"
                >
                    <div className="title-mute-duration">
                        <h2>Enter mute duration(minutes)</h2>
                    </div>
                    <div className="body-mute-duration">
                        <input 
                            type="number"
                            value={muteDuration}
                            onChange={handleDurationChange}
                        />
                        <button className="member-action-btn" onClick={confirmMute}>
                            <GiConfirmed/>
                        </button>
                        <button className="member-action-btn" onClick={() => setIsModalOpen(false)}>
                            <GiCancel/>
                        </button>
                    </div>
                </Modal>
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
        <RenderButtons member={member} isAdmin={isAdmin} userInfo={userInfo}/>
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