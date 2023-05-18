import React, { useState } from "react";
import defaultPhoto from "./kitty.png";

interface ChatHeaderProps {
    photo?: string;
    contactName: string;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ChatHeader({photo = defaultPhoto, contactName, setIsOpen} : ChatHeaderProps) {

    return (
        <div className='chat-header'>
            <button className="chat-header-buton" onClick={() => {setIsOpen(current => !current)}}>
                <img className="chat-header-photo" src={photo} alt='contactPhoto'/>
            </button>
            <div>
                <h3 className="chat-header-name">{contactName}</h3>
            </div>
        </div>
    )
}