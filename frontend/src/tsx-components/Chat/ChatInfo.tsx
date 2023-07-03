
import React, { useState, useEffect, useCallback } from "react";
import { FiRefreshCw } from "react-icons/fi";

import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css";
import { socket } from '../Root.tsx';
import RenderButtons from './RenderButtons.tsx';
import ContactInfo from "./ContactInfo.tsx";

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

function renderMemberStatus(member: ChanMember, membersStatus: Map<number, boolean>, userIsAdmin: boolean, isOwner: boolean, userInfo: Contact) {
    const status = membersStatus.get(member.member);
    
    return (
      <div className="member-status">
        <span className={`status-indicator ${status ? 'online' : 'offline'}`}></span>
        {member.memberRef.nickname}
        {member.member != userInfo.id && <RenderButtons member={member} userIsAdmin={userIsAdmin} isOwner={isOwner} userInfo={userInfo}/>}
      </div>
    );
  }

export default function ChatInfo({ userInfo, selectedChannel, selectedContact}: ChatInfoProps)
{
    const [userIsAdmin, setUserIsAdmin] = useState<boolean>(false);
    const [isMember, setIsMember] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [members, setMembers] = useState<ChanMember[]>([]);
    const [contactStatus, setContactStatus] = useState<boolean>(false);
    const [membersStatus, setMembersStatus] = useState<Map<number, boolean>>(new Map());
    const [channelState, setChannelState] = useState({
        userIsAdmin: false,
        isMember: false,
        isOwner: false,
        members: [] as ChanMember[],
        membersStatus: new Map<number, boolean>(),
    });

    const fetchMembersData = useCallback(() => {
        if (selectedChannel && userInfo && !selectedContact) {
            socket.emit('GetChannelMembers', { chanId: selectedChannel.id, userId: userInfo?.id });
    
            socket.on('MembersofChannelFound', (members) => {
                setChannelState(prevState => ({ ...prevState, members }));
    
                members.forEach((member: ChanMember) => {
                    socket.emit('getUserStatus', { userId: userInfo?.id, memberId: member.member });
                });
            });
    
            socket.on('foundUserStatus', (data) => {
                setChannelState(prevState => ({
                    ...prevState,
                    membersStatus: new Map(prevState.membersStatus).set(data.memberId, data.status)
                }));
            });
    
            socket.emit('isMemberAdmin', { chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id });
    
            socket.on('foundAdminStatus', (data) => {
                console.log('isAdmin?: ', data);
                setChannelState(prevState => ({
                    ...prevState,
                    userIsAdmin: data
                }));
            });
    
            socket.emit('isChanOwner', { chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id });
    
            socket.on('foundOwnerStatus', (data) => {
                setChannelState(prevState => ({
                    ...prevState,
                    isOwner: data
                }));
            });
    
            socket.emit('isMember', { chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id });
    
            socket.on('foundIsMember', (data) => {
                setChannelState(prevState => ({
                    ...prevState,
                    isMember: data
                }));
            });
        }
    }, [selectedChannel, userInfo, selectedContact]);

    useEffect(() => {
        fetchMembersData();
        return () => {
          socket.off('MembersofChannelFound');
          socket.off('foundUserStatus');
          socket.off('foundAdminStatus');
          socket.off('foundOwnerStatus');
          socket.off('foundIsMember');
        };
      }, [fetchMembersData]);


    const handleLeaveChannel = () => {
        console.log("WILL LEAVE CHANNEL");
    }

    const handleAddMembers = () => {
        console.log("WILL ADD MEMBERS");
    }


    return (
        <div className="chat-info">
            {selectedChannel && <div className="members-title">
                <h1>
                    {selectedChannel.name}'s Members
                </h1>
                <button className="Chan-refresh-btn" onClick={fetchMembersData}>
                    <FiRefreshCw/>
                </button>
            </div>}
            <div className="conversation-info">
                {channelState.isMember && !selectedContact && selectedChannel && userInfo && channelState.members.map(member => renderMemberStatus(member, channelState.membersStatus, channelState.userIsAdmin, channelState.isOwner, userInfo))}
                {selectedContact && <ContactInfo selectedContact={selectedContact} userInfo={userInfo}/>}
            </div>
            {selectedChannel && channelState.isMember && (<div className="add-members-channel">
                <button className="word-btn" onClick={handleAddMembers}>
                    Add Members
                </button>
            </div>)}
            {selectedChannel && channelState.isMember && (<div className="leave-channel">
                <button className="word-btn" onClick={handleLeaveChannel}>
                    Leave Channel
                </button>
            </div>)}
        </div>
    );

}



    // const fetchMembersData = () => {
    //     if (selectedChannel && userInfo && !selectedContact) {
    //         socket.emit('GetChannelMembers', {chanId: selectedChannel.id, userId: userInfo?.id});
    //         socket.on('MembersofChannelFound', (members) => {
    //             setMembers(members);

    //             members.forEach((member: ChanMember) => {
    //                 socket.emit('getUserStatus', { userId: userInfo?.id, memberId: member.member })
    //             })
    //         });
    //         socket.on('foundUserStatus', (data) => {
    //             setMembersStatus((prevStatus) => new Map(prevStatus).set(data.memberId, data.status));
    //         });
    //         socket.emit('isMemberAdmin', {chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id});
    //         socket.on('foundAdminStatus', (data) => {
    //             setUserIsAdmin(data);
    //         });
    //         socket.emit('isChanOwner', {chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id});
    //         socket.on('foundOwnerStatus', (data) => {
    //             setIsOwner(data);
    //         });
    //         socket.emit('isMember', {chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id});
    //         socket.on('foundIsMember', (data) => {
    //             setIsMember(data);
    //         });
    //     }
    //     return () => {
    //         socket.off('MembersofChannelFound');
    //         socket.off('foundUserStatus');
    //         socket.off('foundAdminStatus');
    //         socket.off('foundOwnerStatus');
    //         socket.off('foundIsMember');

    //     };
    // }

    // useEffect(() => {
    //     if (selectedChannel && userInfo) {
    //         socket.off('foundAdminStatus');
    //         socket.emit('isMemberAdmin', {chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id});
    //         socket.on('foundAdminStatus', (data) => {
    //             setUserIsAdmin(data);
    //         });
    //     }
    //     return () => {
    //         socket.off('foundAdminStatus');
    //     };
    // }, [userInfo, selectedChannel]);


    // useEffect(() => {
    //     if (selectedChannel && userInfo) {
    //         socket.emit('isMember', {chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id});
    //         socket.on('foundIsMember', (data) => {
    //             setIsMember(data);
    //         });
    //     }
    //     return () => {
    //         socket.off('foundIsMember');
    //     };

    // }, [userInfo, selectedChannel]);

    // useEffect(() => {
    //     if (selectedChannel && userInfo) {
    //         console.log("going to emit isChanOwner");
    //         socket.emit('isChanOwner', {chanId: selectedChannel?.id, memberId: userInfo.id, userId: userInfo.id});
    //         socket.on('foundOwnerStatus', (data) => {
    //             setIsOwner(data);
    //             console.log("isOwner: ", data);
    //             console.log("userInfo: ", userInfo);
    //             console.log("selectedChannel: ", selectedChannel);
    //         })
    //     }
    //     return () => {
    //         socket.off('foundIsChanOwner');
    //     };
    // }, [userInfo, selectedChannel]);

    // useEffect(() => {

    //     if (selectedContact && !selectedChannel){
    //         socket.emit('getUserStatus', { userId: userInfo?.id, memberId: selectedContact?.id });
    
    //         socket.on('foundUserStatus', (data) => {
    //             if (data.memberId === selectedContact?.id) {
    //                 setContactStatus(data.status);
    //             }
    //         });
    //     }
    //     else if (selectedChannel && !selectedContact){
    //         console.log("GETTING CHANNEL MEMBERS");
    //         socket.emit('GetChannelMembers', {chanId: selectedChannel.id, userId: userInfo?.id});
    //         socket.on('MembersofChannelFound', (members) => {
    //             setMembers(members);

    //             members.forEach((member: ChanMember) => {
    //                 socket.emit('getUserStatus', { userId: userInfo?.id, memberId: member.member })
    //             })
    //         });
    //         socket.on('foundUserStatus', (data) => {
    //             setMembersStatus((prevStatus) => new Map(prevStatus).set(data.memberId, data.status));
    //         });
    //     }

    //     return () => {
    //         socket.off('foundUserStatus');
    //         socket.off('MembersofChannelFound');

    //     };
    // }, [userInfo, selectedContact, selectedChannel]);
