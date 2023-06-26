import React, { useState, useEffect } from "react";
import { GrUserExpert } from "react-icons/gr";
import { FaUserSlash } from "react-icons/fa";

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

interface RenderButtonsProps {
    member: ChanMember;
    userIsAdmin:boolean;
    isOwner: boolean
    userInfo: Contact
}

interface ContactInfoProps {
    selectedContact: Contact;
    userInfo: Contact | null;
}

export default function ContactInfo({selectedContact, userInfo}: ContactInfoProps) {

    const [isBlocked, setIsBlocked] = useState<boolean>(false);    

    const handleInvite = () => {
        console.log("WILL INVITE TO PLAY");
    };

    const handleBlock = () => {

    };

    const handleUnblock = () => {
        
    };

    const handleProfile = () => {
        console.log("Here will put a link to profile page");
    };

    return (
        <div>
            <div>
                <button onClick={handleProfile}>
                    View Profile
                </button>
            </div>
            <div>
                {isBlocked ? (
                    <button onClick={handleUnblock}>
                        <GrUserExpert/>
                    </button>
                ) : (
                    <button onClick={handleBlock}>
                        <FaUserSlash/>
                    </button>
                )}
            </div>
            <div>
                <button onClick={handleInvite}>
                        Invite to Play
                </button>
            </div>
        </div>
    )
}
