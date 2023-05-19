import React from "react";
import { BsSearchHeart } from "react-icons/bs";

export default function DmHandler()
{
    return (
    <div className='direct-messages'>
        <div className="DM-title">
            <h1>
                Direct Messages
            </h1>
        </div>
        <div className="DM-find">
            <div className="DM-find-text">
                Search/Start Chat
            </div>
            <button className="DM-find-btn">
                <BsSearchHeart/>
            </button>
        </div>
        <div className="DM-conversations">
            <div className="conversation">Conversation 1</div>
            <div className="conversation">Conversation 2</div>
            <div className="conversation">Conversation 3</div>
            <div className="conversation">Conversation 4</div>
        </div>
    </div>
    )
}