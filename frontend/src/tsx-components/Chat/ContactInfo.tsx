import React, { useState, useEffect } from "react";
import { GrUserExpert } from "react-icons/gr";
import { FaUserSlash } from "react-icons/fa";

import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css";
import { socket } from '../Root.tsx';

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

export default function ContactInfo({selectedContact, userInfo}: ContactInfoProps) {

    const [isBlocked, setIsBlocked] = useState<boolean>(true);

    useEffect(() => {
        if(selectedContact && userInfo) {
            socket.emit('userIsBlocked', {blockerID: userInfo.id, blockeeID:selectedContact.id});
            socket.once('blockInfo', (data) => {
                setIsBlocked(data);
            })
        }
    }), [userInfo, selectedContact];

    const handleInvite = () => {
        console.log("WILL INVITE TO PLAY");
    };

    const handleBlock = () => {
        if (selectedContact && userInfo && !isBlocked) {
            socket.emit('blockUser', {blockerID: userInfo.id, blockeeID: selectedContact.id})
            socket.once('userBlocked', () => {
                setIsBlocked(true);
                alert("user was blocked");
            });
        }
        else {
            alert("user could not be blocked");
        }

    };

    const handleUnblock = () => {
        console.log("isBlocked: ", isBlocked);
        if (selectedContact && userInfo && isBlocked) {
            socket.emit('unblockUser', {blockerID: userInfo.id, blockeeID: selectedContact.id})
            socket.once('userUnblocked', () => {
                setIsBlocked(false);
                alert("user was unblocked");
            });
        }
        else {
            alert("user could not be unblocked");
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
                        <GrUserExpert/> Unblock {selectedContact.nickname}
                    </button>
                ) : (
                    <button className="profile-icon-btn" onClick={handleUnblock}>
                        <FaUserSlash/> Block {selectedContact.nickname}
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
