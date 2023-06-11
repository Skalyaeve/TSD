import React from "react";

interface MessageProps {
    messages: {
        sender: number;
        receiver: number;
        message: string;
        type: string;
    }[];
    userInfo: {id: number; email: string; nickname: string; avatarFilename: string};
    selectedContact: {id: number; email: string; nickname: string; avatarFilename: string};
}

export default function Messages({messages, userInfo, selectedContact} : MessageProps)
{
    console.log("messages", messages);
    return (
        <div>
            {messages.map((messages, index) => {
            console.log('messages:', messages);
            let isCurrentUSer = false;
            console.log("userInfo:", userInfo);
            console.log("selectedContact:", selectedContact);
            if (messages.sender === userInfo?.id)
            {
                isCurrentUSer = true;
            }
            // const itsMe = messages.type === "sent";
            // const isCurrentUSer = messages?.sender?.id == userInfo?.id;
            const messageClass = isCurrentUSer === true ? "sent" : "received";
            return (
                <div key={index} className={`message ${messageClass}`}>
                    {isCurrentUSer ? (
                        <strong className="message_user">You:</strong>
                    ) : (
                        <strong className="message_user">{selectedContact?.nickname}:</strong>
                    )}{" "}
                    {messages.message}
                </div>
            );
            })}
        </div>
    );
}

// interface MessageProps {
//     messages: {user: string; message: string; type: string}[];
//     currentUser: string;
// }

// export default function Messages({messages, currentUser} : MessageProps)
// {
//     return (
//         <div>
//             {messages.map((messages, index) => {
//             const isCurrentUSer = messages.user == currentUser;
//             const messageClass = messages.type === "sent" ? "sent" : "received";
//             return (
//                 <div key={index} className={`message ${messageClass}`}>
//                     {isCurrentUSer ? (
//                         <strong>You:</strong>
//                     ) : (
//                         <strong>{messages.user}:</strong>
//                     )}{" "}
//                     {messages.message}
//                 </div>
//             );
//             })}
//         </div>
//     );
// }