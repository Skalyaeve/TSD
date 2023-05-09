import React from "react";

interface ChatProps {
    messages: {user: string; message: string}[];
    currentUser: string;
    ownMessages?: boolean;
}

export default function Messages({messages, currentUser} : ChatProps)
{
    return (
        <div>
            {messages.map((message, index) => {
            console.log("=============================");
            console.log("User:", message.user);
            console.log("Message:", message.message);
            console.log("message.user", message.user);
            console.log("currentUsser", currentUser);
            console.log("=============================");
            const isCurrentUSer = message.user == currentUser;
            const messageClass = isCurrentUSer ? "sent" : "received";
            return (
                <div key={index} className={`message ${messageClass}`}>
                    <strong>{message.user}:</strong> {message.message}
                </div>
            )

            })}
        </div>
    )
}
