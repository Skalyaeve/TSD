import React, { useState } from "react";
import { BsSearchHeart } from "react-icons/bs";

export default function DmHandler()
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
            <div className="conversation">Contact 1</div>
            <div className="conversation">Contact 2</div>
            <div className="conversation">Contact 3</div>
            <div className="conversation">Contact 4</div>
        </div>
    </div>
    )
}