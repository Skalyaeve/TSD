import React, { useState } from "react";
import defaultPhoto from "./kitty.png";

// interface Channel {
//     id: number;
//     name: string;
//     chanOwner: number;
//     type: string; // Or your ChanType if defined
//     passwd: string | null;
//     // Add more fields as necessary
// }

interface ChatHeaderProps {
    photo?: string;
    chatName: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatHeader({photo = defaultPhoto, chatName, setIsOpen} : ChatHeaderProps) {

    return (
        <div className='chat-header'>
            <button className="chat-header-btn" onClick={() => {setIsOpen(current => !current)}}>
                <img className="chat-header-photo" src={photo} alt='contactPhoto'/>
            </button>
            <div>
                <h3 className="chat-header-name">{chatName}</h3>
            </div>
        </div>
    )
}