import React from "react";

interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string; // Or your ChanType if defined
    passwd: string | null;
    // Add more fields as necessary
}


interface MessagesProps {
    messages: {
        sender: number;
        receiver?: number;
        senderNick?: string;
        chanId?: number;
        message?: string;
        content?: string;
        type?: string;
    }[];
    userInfo: {id: number; email: string; nickname: string; avatarFilename: string} | null;
    selectedContact: {id: number; email: string; nickname: string; avatarFilename: string};
    selectedChannel: Channel | null;
}
export default function Messages({messages, userInfo, selectedContact, selectedChannel} : MessagesProps) {
    return (
        <div>
            {messages.map((message, index) => {
                let isCurrentUSer = false;
                let senderName = "You";
                let messageContent = message.message;
                if (message.sender === userInfo?.id)
                {
                    isCurrentUSer = true;
                    senderName = "You";
                }
                if (selectedContact && !isCurrentUSer){
                    senderName = selectedContact.nickname;
                }
                else if(selectedChannel) {
                    senderName = message.senderNick || senderName;
                    messageContent = message.content;
                }
                const messageClass = isCurrentUSer === true ? "sent" : "received";
                return (
                    <div key={index} className={`message ${messageClass}`}>
                        <strong className="message_user">{senderName}:</strong>
                        <p>{messageContent}</p>
                    </div>
                    // <div key={index} className={`message ${messageClass}`}>
                    //     {isCurrentUSer ? (
                    //         <strong className="message_user">You:</strong>
                    //     ) : (
                    //         <strong className="message_user">{selectedContact?.nickname}:</strong>
                    //     )}{" "}
                    //     <p>{message.message}</p>
                    // </div>
                );
            })}
        </div>
    );
}
