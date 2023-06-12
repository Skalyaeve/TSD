import React, {useState} from "react";
import "../../css/Chat/SendMessage.css"
import "../../css/Chat/InputText.css"
import {AiOutlineSend} from 'react-icons/ai';

interface Props {
    sendPrivateMessage: (value: string) => void;
    userInfo: {id: number; email: string; nickname: string; avatarFilename: string} | null;
    selectedContact: {id: number; email: string; nickname: string; avatarFilename: string} | null;
}

export default function MessageInput({
    sendPrivateMessage,
    userInfo,
    selectedContact,
} : Props ) {
    const [value, setValue] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        sendPrivateMessage(value);
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