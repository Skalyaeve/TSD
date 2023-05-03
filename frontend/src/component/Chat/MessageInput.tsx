import React, {useState} from "react";

export default function MessageInput({send} : {send: (val: string) => void})
{
    const [value, setValue] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        send(value);
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
            onChange={(e)=>setValue(e.target.value)}
            placeholder="Type your message"
            value={value}
            />
            <button type="submit">Send</button>
            {/* <button onClick={() => send(value)}>Send</button> */}
        </form>
    );
}