import React, {useState} from "react";
import "../../css/Chat/SendMessage.css"
import "../../css/Chat/InputText.css"
import {AiOutlineSend} from 'react-icons/ai';

export default function MessageInput({send} : {send: (val: string) => void})
{
    const [value, setValue] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // send(value, "bla");
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input_text">
                <input
                onChange={(e)=>setValue(e.target.value)}
                placeholder="Type your message"
                value={value}
                />
                <button className="submit-btn" type="submit">
                        <AiOutlineSend />
                </button>
            </div>
        </form>
    );
}