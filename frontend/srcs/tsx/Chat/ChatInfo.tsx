
import React, { useState, useEffect, useCallback } from "react";
import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css";
import { socket } from '../Root.tsx';
import RenderButtons from './RenderButtons.tsx';
import ContactInfo from "./ContactInfo.tsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPortal } from 'react-dom';

interface User {
	nickname: string;
}

interface Channel {
	id: number;
	name: string;
	chanOwner: number;
	type: string;
	passwd: string | null;
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
	muteTime: string;
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
			{member.member != userInfo.id && <RenderButtons member={member} userIsAdmin={userIsAdmin} isOwner={isOwner} userInfo={userInfo} />}
		</div>
	);
}

export default function ChatInfo({ userInfo, selectedChannel, selectedContact }: ChatInfoProps) {
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
			if (!socket) return
			socket.emit('GetChannelMembers', { chanId: selectedChannel.id, userId: userInfo?.id });

			socket.on('MembersofChannelFound', (members) => {
				setChannelState(prevState => ({ ...prevState, members }));

				members.forEach((member: ChanMember) => {
					if (!socket) return
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
			return () => { // clean up function
				if (!socket) return
				socket.off('MembersofChannelFound');
				socket.off('foundUserStatus');
				socket.off('foundAdminStatus');
				socket.off('foundOwnerStatus');
				socket.off('foundIsMember');
			}
		}
	}, [selectedChannel, userInfo, selectedContact]);

	useEffect(() => {
		fetchMembersData();
	}, [fetchMembersData]);


	const handleLeaveChannel = () => {
		if (selectedChannel && userInfo) {
			if (!socket) return
			socket.emit('leaveChannel', { chanId: selectedChannel.id, userId: userInfo.id });
			socket.on('youLeftChannel', (data) => {
				toast.info(`'${data.user_nickname}', you have left the channel '${data.chan_name}'`, {
					position: "top-right",
					autoClose: 50000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					className: 'custom-toast',
				})
				fetchMembersData();
			});
			return () => {
				if (!socket) return
				socket.off('youLeftChannel');
			}
		}
	}

	const handleAddMembers = () => {
		//i need to open a modal 
		//then i need to get all users
		//filter the users that are not members
		//display those users
		//select users to make members
		//then i need to trigger the socket event to add all these users
		//on my chat have a listener for the event youHaveBeenAddedToChannel
		//on success display notification members were added to channel
		console.log("WILL ADD MEMBERS");
	}


	return (
		<div className="chat-info">
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
			{selectedChannel && <div className="members-title">
				<h1>
					{selectedChannel.name}'s Members
				</h1>
				<button className="Chan-refresh-btn" onClick={fetchMembersData}>
				</button>
			</div>}
			<div className="conversation-info">
				{channelState.isMember && !selectedContact && selectedChannel && userInfo && channelState.members.map(member =>
					<div className="grow-child">
						{renderMemberStatus(member, channelState.membersStatus, channelState.userIsAdmin, channelState.isOwner, userInfo)}
					</div>
				)
				}
				{selectedContact &&
					<div>
						<ContactInfo selectedContact={selectedContact} userInfo={userInfo} />
					</div>
				}
			</div>
		</div>
	);

}