import React from "react";

export default function Messages({messages} : {messages: { user: string, message: string } [] })
{
    return (
        <div>
            {messages.map((message, index) => {
            console.log("User:", message.user);
            console.log("Message:", message.message);
            return (
                <div key={index}>
                    <strong>{message.user}:</strong> {message.message}
                </div>
            )

            })}
        </div>
    )
}
