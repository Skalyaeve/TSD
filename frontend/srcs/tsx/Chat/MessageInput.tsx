import React, { useState } from "react";
import "../../css/Chat/SendMessage.css"
import "../../css/Chat/InputText.css"

interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string; // Or your ChanType if defined
    passwd: string | null;
    // Add more fields as necessary
}

interface Props {
    sendMessage: (value: string) => void;
    userInfo: { id: number; email: string; nickname: string; avatarFilename: string } | null;
    selectedContact: { id: number; email: string; nickname: string; avatarFilename: string } | null;
    selectedChannel: Channel | null;
}

export default function MessageInput({
    sendMessage,
    userInfo,
    selectedContact,
    selectedChannel,
}: Props) {
    const [value, setValue] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendMessage(value);
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="input_text">
                <input
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Type your message"
                    value={value}
                />
                <button className="submit-btn" type="submit">
                </button>
            </div>
        </form>
    );
}



// interface Props {
//     send: (val: string, user: string) => void;
//     user: string;
//     setUser: React.Dispatch<React.SetStateAction<string>>;
// }

// export default function MessageInput({
//     send,
//     user,
//     setUser,
// } : Props ) {
//     const [value, setValue] = useState("")

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         send(value, user);
//         setValue("");
//     };

//     return (
//         <form onSubmit={handleSubmit}>
//             <div className="input_text">
//                 <input
//                 onChange={(e)=>setValue(e.target.value)}
//                 placeholder="Type your message"
//                 value={value}
//                 />
//                 <button className="submit-btn" type="submit">
//                         <AiOutlineSend />
//                 </button>
//             </div>
//         </form>
//     );
// }