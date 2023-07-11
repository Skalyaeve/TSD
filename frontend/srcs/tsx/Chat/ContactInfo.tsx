import React, { useState, useEffect } from "react";

import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css";
import { socket } from '../Root.tsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPortal } from 'react-dom';

interface Contact {
	id: number;
	email: string;
	nickname: string;
	avatarFilename: string
}

interface ContactInfoProps {
	selectedContact: Contact;
	userInfo: Contact | null;
}

export default function ContactInfo({ selectedContact, userInfo }: ContactInfoProps) {

	const [isBlocked, setIsBlocked] = useState<boolean>(false);

	useEffect(() => {
		if (selectedContact && userInfo && selectedContact.id != userInfo.id) {
			console.log("ENTERED IS BLOCKED IF");
			function fetchData() {
				if (!socket) return
				socket.emit('userIsBlocked', { blockerID: userInfo?.id, blockeeID: selectedContact.id });
				socket.once('blockInfo', (data) => {
					setIsBlocked(data);
				});
			}
			fetchData();
		}
		console.log("isBlocked: ", isBlocked);
	}, [selectedContact]);

	const handleInvite = () => {
		console.log("WILL INVITE TO PLAY");
	};

	const handleBlock = () => {
		if (selectedContact && userInfo && !isBlocked) {
			if (!socket) return
			socket.emit('blockUser', { blockerID: userInfo.id, blockeeID: selectedContact.id })
			socket.on('userBlocked', () => {
				setIsBlocked(true);
				toast.info(`${selectedContact.nickname} was blocked`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					className: 'custom-toast',
				});
				// alert("user was blocked");
			});
		}
		else {
			toast.error(`${selectedContact.nickname} could not be blocked`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert("user could not be blocked");
		}

	};

	const handleUnblock = () => {
		console.log("isBlocked: ", isBlocked);
		if (selectedContact && userInfo && isBlocked) {
			if (!socket) return
			socket.emit('unblockUser', { blockerID: userInfo.id, blockeeID: selectedContact.id })
			socket.on('userUnblocked', () => {
				setIsBlocked(false);
				toast.success(`${selectedContact.nickname} was unblocked :)`, {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					className: 'custom-toast',
				});
			});
		}
		else {
			toast.error(`${selectedContact.nickname} could not be unblocked`, {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				className: 'custom-toast',
			});
			// alert("user could not be unblocked");
		}

	};

	const handleProfile = () => {
		console.log("Here will put a link to profile page");
	};

	return (
		<div className="selected-contact-info">
			<div className="block-unblock">
				{isBlocked ? (
					<button className="profile-icon-btn" onClick={handleUnblock}>
					</button>
				) : (
					<button className="profile-icon-btn" onClick={handleBlock}>
					</button>
				)}
			</div>
			<div className="profile-view">
				<button className="profile-word-btn" onClick={handleProfile}>
					View Profile
				</button>
			</div>
			<div className="invite-play">
				<button className="profile-word-btn" onClick={handleInvite}>
					Invite to Play
				</button>
			</div>
		</div>
	)
}