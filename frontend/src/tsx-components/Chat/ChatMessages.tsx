// import React from "react";

// interface ChanMessage {
//     sender: number;
//     chanId: number;
//     timeSent: string;
//     content: string;
// }

// interface Channel {
//     id: number;
//     name: string;
//     chanOwner: number;
//     type: string; // Or your ChanType if defined
//     passwd: string | null;
//     // Add more fields as necessary
// }

// interface ChanMessagesProps {
//     messages: ChanMessage[];
//     userInfo: {id: number; email: string; nickname: string; avatarFilename: string};
//     selectedChannel: Channel | null;
// }

// export default function ChatMessages({messages, userInfo, selectedChannel} : ChanMessagesProps) {
//     return (
//         <div>
//             {messages.map((message, index) => {
//                 let isCurrentUSer = false;
//                 if (message.sender === userInfo?.id)
//                 {
//                     isCurrentUSer = true;
//                 }
//                 const messageClass = isCurrentUSer === true ? "sent" : "received";
//                 return (
//                     <div key={index} className={`message ${messageClass}`}>
//                         {isCurrentUSer ? (
//                             <strong className="message_user">You:</strong>
//                         ) : (
//                             <strong className="message_user">{message?.sender}:</strong>
//                         )}{" "}
//                         <p>{message.content}</p>
//                     </div>
//                 );
//             })}
//         </div>
//     );
// }
import React from "react";

interface ChanMessage {
    sender: number;
    chanId: number;
    timeSent: string;
    content: string;
}

interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string; // Or your ChanType if defined
    passwd: string | null;
    // Add more fields as necessary
}

interface ChanMessagesProps {
    messages: ChanMessage[];
    userInfo: {id: number; email: string; nickname: string; avatarFilename: string};
    selectedChannel: Channel | null;
}

export default function ChatMessages({messages, userInfo, selectedChannel} : ChanMessagesProps) {
    return (
        <div>
            {messages.map((message, index) => {
                let isCurrentUSer = false;
                if (message.sender === userInfo?.id)
                {
                    isCurrentUSer = true;
                }
                const messageClass = isCurrentUSer === true ? "sent" : "received";
                return (
                    <div key={index} className={`message ${messageClass}`}>
                        {isCurrentUSer ? (
                            <strong className="message-user">YouADAJKsadsadDSA:</strong>
                        ) : (
                            <strong className="message-user">{message?.sender}:</strong>
                        )}{" "}
                        <div className="message-text">
                            {message.content}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// {/* </p> */}
// {/* <p> */}