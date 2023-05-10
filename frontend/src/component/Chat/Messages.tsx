import React from "react";

interface MessageProps {
    messages: {user: string; message: string; type: string}[];
    currentUser: string;
}

export default function Messages({messages, currentUser} : MessageProps)
{
    return (
        <div>
            {messages.map((messages, index) => {
            const isCurrentUSer = messages.user == currentUser;
            const messageClass = messages.type === "sent" ? "sent" : "received";
            return (
                <div key={index} className={`message ${messageClass}`}>
                    {isCurrentUSer ? (
                        <strong>You:</strong>
                    ) : (
                        <strong>{messages.user}:</strong>
                    )}{" "}
                    {messages.message}
                </div>
            );
            })}
        </div>
    );
}