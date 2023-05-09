import React from 'react'
import { useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client"
import MessageInput from './MessageInput.tsx'
import Messages from './Messages.tsx'
import { Link } from 'react-router-dom'

function Chat({ name }: { name: string }) {
    const [socket, setSocket] = useState<Socket>()
    const [sentMessages, setSentMessages] = useState<{user: string; message: string }[]>([]);
    const [receivedMessages, setReceivedMessages] = useState<{user: string; message: string } []>([]);
    // const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
    const [user, setUser] = useState(() => `User${Math.floor(Math.random() * 10)}`);// this will change 

    const send = (value: string, user: string) => {
        console.log("value: ", value);
        console.log("user: ", user);
        const message = { user, message: value };
        setSentMessages([...sentMessages, message]);
        socket?.emit('message', message);
        // socket?.emit('message', {user, message: value});
    };

    useEffect(() => {
        console.log("NEW CONNECTION")
        const newSocket = io("http://localhost:8001")
        setSocket(newSocket)
    }, [setSocket])

    const messageListener = (message: { user: string; message: string}) => {
        if (message.user == user) {
            // setSentMessages([...sentMessages, message]);
        } else {
            setReceivedMessages([...receivedMessages, message]);
        }
    };

    useEffect(() => {
        console.log('messagelistener');
        socket?.on("message", messageListener)
        return () => {
            socket?.off("message", messageListener)
        }
    }, [send])

    return (
        <div className='chat-container'>
            <div className='messages'>
                <Messages messages={receivedMessages} currentUser={user} />
                <Messages messages={sentMessages} currentUser={user} ownMessages />
            </div>
            <div className='input'>
                <MessageInput send={send} user={user} setUser={setUser} />
            </div>
        </div>
    )
}

export default Chat;