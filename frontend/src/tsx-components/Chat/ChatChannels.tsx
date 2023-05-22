import React, { useState } from "react";
import { BsSearchHeart } from "react-icons/bs";

export default function ChatChannels()
{

    const [channel, setChannel] = useState("");

    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault();
        //here send the value;
        setChannel("");
    }

    return (
    <div className='channels'>
        <div className="Chan-title">
            <h1>
               [Channels] 
            </h1>
        </div>
        <div className="Chan-find">
            <div className="Chan-find-text">
                <input 
                    onChange={(e)=>setChannel(e.target.value)}
                    placeholder="Search channel"
                    value={channel}
                />
            </div>
            <button className="Chan-find-btn">
                <BsSearchHeart/>
            </button>
        </div>
        <div className="Chan-all-channels">
            <div className="channel-convo">Channel 1</div>
            <div className="channel-convo">Channel 2</div>
            <div className="channel-convo">Channel 3</div>
            <div className="channel-convo">Channel 4</div>
        </div>
    </div>
    )
}