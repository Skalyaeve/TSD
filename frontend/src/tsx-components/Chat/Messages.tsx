import React, {useEffect, useRef, useState} from "react";

interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string; // Or your ChanType if defined
    passwd: string | null;
    // Add more fields as necessary
}

interface Contact {
    id: number; 
    email: string;
    nickname: string;
    avatarFilename: string;
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
    userInfo: Contact | null;
    selectedContact: Contact;
    selectedChannel: Channel | null;
}
export default function Messages({messages, userInfo, selectedContact, selectedChannel} : MessagesProps) {
    // const endOfMessagesRef = useRef<HTMLDivElement>(null);
    // const [firstRender, setFirstRender] = useState(true);

    // const scrollToBottom = () => {
    //     endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
    // }

    // useEffect(() => {
    //     scrollToBottom();
    // }, [messages]);

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
                        <strong className="message-user">{senderName}:</strong>
                        <div className="message-text">
                            {messageContent}
                        </div>
                    </div>
                );
            })}
            {/* <div ref={endOfMessagesRef}/> */}
        </div>
    );
}
