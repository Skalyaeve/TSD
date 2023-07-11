import React, { useState, useEffect } from "react";
import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css";
import { socket } from '../Root.tsx';
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

interface RenderButtonsProps {
	member: ChanMember;
	userIsAdmin: boolean;
	isOwner: boolean
	userInfo: Contact
}

export default function RenderButtons({ member, userIsAdmin, isOwner, userInfo }: RenderButtonsProps) {

	console.log("RenderButtons props: member, isAdmin, isOwner, userInfo: ", { member, userIsAdmin, isOwner, userInfo });

	const [muteDuration, setMuteDuration] = useState<number>(0);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [memberIsUser, setMemberIsUser] = useState<boolean>(false);
	const [isKicked, setIsKicked] = useState<boolean>(false);
	const [isBanned, setIsBanned] = useState<boolean>(false);
	const [isMuted, setIsMuted] = useState<boolean>(false);
	const [memberIsChanAdmin, setMemberIsChanAdmin] = useState<boolean>(member.isAdmin);

	useEffect(() => {
		setMemberIsUser(member.member === userInfo.id);
	}, [member, userInfo]);

	const handleMakeAdmin = () => {
		console.log("MAKEADMINBUTTONPRESSED");
		if (!memberIsChanAdmin) {
			if (!socket) return
			socket.emit('makeMemberAdmin', { chanOwnerId: userInfo.id, chanId: member.chanId, memberId: member.member });
			socket.once('newAdminInRoom', () => {
				setMemberIsChanAdmin(true);
				toast.success(`Member has been made admin`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					className: 'custom-toast',
				});
				// alert('Member has been made admin');
			});
		}
		else {
			toast.error(`Member is already admin`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert('Member is already admin');
		}
	}

	const handleRemoveAdmin = () => {
		console.log("REMOVEADMINPRESSED");
		if (memberIsChanAdmin) {
			if (!socket) return
			socket.emit('removeAdminPriv', { chanOwnerId: userInfo.id, chanId: member.chanId, memberId: member.member });
			socket.once('adminRemoved', () => {
				setMemberIsChanAdmin(false);
				toast.info(`Member lost admin privileges`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					className: 'custom-toast',
				});
				// alert('Member lost admin privileges');
			});
		}
		else {
			toast.error(`Member doesn't have admin privileges`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert('Member doesn not have admin privileges');
		}

	}

	const handleKick = () => {
		if (!socket) return
		socket.emit('kickMember', { chanId: member.chanId, memberToKickId: member.member, adminId: userInfo.id });
		socket.once('memberKicked', () => {
			setIsKicked(true);
			toast.info(`Member has been kicked`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert('Member has been kicked');
		});
	}

	const handleBan = () => {
		if (!socket) return
		socket.emit('banMember', { chanId: member.chanId, memberToBanId: member.member, adminId: userInfo.id });
		socket.once('memberBanned', () => {
			toast.info(`Member has been banned`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert('Member has been banned');
		});

	}

	const handleMute = () => {
		setIsModalOpen(true);
	}

	const confirmMute = () => {
		setIsModalOpen(false);
		if (!socket) return
		socket.emit('muteMember', { chanId: member.chanId, memberToMuteId: member.member, adminId: userInfo.id, muteDuration: muteDuration });
		socket.once('memberMuted', () => {
			toast.info(`Member has been muted for ${muteDuration} minutes`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert('Member has been muted');
		});

	}

	const handleDurationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value, 10);

		if (value >= 0) {
			setMuteDuration(value);
		}
		else {
			toast.error(`Mute duration is not valid, only positive values`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert("mute duration is negative");
		}
	}


	console.log("isAdmin: ", userIsAdmin);
	if (userIsAdmin || isOwner) {
		return (
			<div className="admin-action-button">
				<button className="member-action-btn" onClick={handleKick}>
				</button>
				<button className="member-action-btn" onClick={handleBan}>
				</button>
				<button className="member-action-btn" onClick={handleMute}>
				</button>
				{isOwner && !memberIsUser && !member.isAdmin &&
					<button className="word-btn" onClick={handleMakeAdmin}>
						MakeAdmin
					</button>
				}
				{isOwner && !memberIsUser && member.isAdmin &&
					<button className="word-btn" onClick={handleRemoveAdmin}>
						RemoveAdmin
					</button>
				}
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
						</button>
						<button className="member-action-btn" onClick={() => setIsModalOpen(false)}>
						</button>
					</div>
				</Modal>
			</div>
		)
	}
	return null;
}