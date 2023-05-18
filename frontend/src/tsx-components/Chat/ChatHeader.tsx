import React, { useState } from "react";
import defaultPhoto from "./kitty.png";

interface ChatHeaderProps {
    photo?: string;
    contactName: string;
}

export default function ChatHeader({photo = defaultPhoto, contactName} : ChatHeaderProps) {

    return (
        <div className='chat-header'>
            <button className="chat-header-buton">
                <img className="chat-header-photo" src={photo} alt='contactPhoto'/>
            </button>
            <div>
                <h3 className="chat-header-name">{contactName}</h3>
            </div>
        </div>
    )
}