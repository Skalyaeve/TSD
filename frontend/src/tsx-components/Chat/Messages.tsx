import React from "react";


interface MessagesProps {
    messages: {
        sender: number;
        receiver: number;
        message: string;
        type: string;
    }[];
    userInfo: {id: number; email: string; nickname: string; avatarFilename: string};
    selectedContact: {id: number; email: string; nickname: string; avatarFilename: string};
}
export default function Messages({messages, userInfo, selectedContact} : MessagesProps) {
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
                            <strong className="message_user">You:</strong>
                        ) : (
                            <strong className="message_user">{selectedContact?.nickname}:</strong>
                        )}{" "}
                        <p>{message.message}</p>
                    </div>
                );
            })}
        </div>
    );
}
