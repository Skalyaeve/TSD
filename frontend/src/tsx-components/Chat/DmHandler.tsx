import React, { useState } from "react";
import { BsSearchHeart } from "react-icons/bs";

interface DmHandlerProps {
    allUsers: {id: number; email: string; nickname: string; avatarFilename: string}[];
}

export default function DmHandler({ allUsers }: DmHandlerProps)
{

    const [contact, setContact] = useState("");
    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault();
        //here send the value
        setContact("");
    }
    return (
    <div className='direct-messages'>
        <div className="DM-title">
            <h1>
                [Direct Messages]
            </h1>
        </div>
        <div className="DM-find">
            <div className="DM-find-text">
                <input
                    onChange={(e)=>setContact(e.target.value)}
                    placeholder="Search conversation"
                    value={contact}
                />
            </div>
            <button className="DM-find-btn">
                <BsSearchHeart/>
            </button>
        </div>
        <div className="DM-conversations">
            {allUsers.map((user) => (
                <button className="conversation-btn" key={user.id}>
                    {user.nickname}
                </button>
            ))}
        </div>
    </div>
    )
}