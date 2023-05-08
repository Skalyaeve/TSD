import React from 'react'
import { useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client"
import MessageInput from './MessageInput.tsx'
import Messages from './Messages.tsx'
import { Link } from 'react-router-dom'

function Chat({ name }: { name: string }) {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<{ user: string; message: string }[]>([]);
    const [user, setUser] = useState(name);

    const send = (value: string, user: string) => {
        console.log(value);
        console.log(user);
        socket?.emit('message', {user, message: value});
    };

    useEffect(() => {
        console.log("NEW CONNECTION")
        const newSocket = io("http://localhost:8001")
        setSocket(newSocket)
    }, [setSocket])

    const messageListener = (message: { user: string; message: string}) => {
        setMessages([...messages, message])
    }

    useEffect(() => {
        console.log('messagelistener');
        socket?.on("message", messageListener)
        return () => {
            socket?.off("message", messageListener)
        }
    }, [messageListener])

    return (
        <div className='chat-container'>
            <div className='messages'>
                <Messages messages={messages}/>
            </div>
            <div className='input'>
                <MessageInput send={send} user={user} setUser={setUser} />
            </div>
        </div>
    )
}

export default Chat;