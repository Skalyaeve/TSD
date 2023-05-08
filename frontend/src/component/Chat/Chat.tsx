import React from 'react'
import { useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client"
import MessageInput from './MessageInput.tsx'
import Messages from './Messages.tsx'
import { Link } from 'react-router-dom'

function Chat({ name }: { name: string }) {
    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<string[]>([])


    const send = (value: string) => {
        socket?.emit('message', value)
    }

    useEffect(() => {
        const newSocket = io("http://localhost:8001")
        setSocket(newSocket)
    }, [setSocket])

    const messageListener = (message: string) => {
        setMessages([...messages, message])
    }

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
                <Messages messages={messages} />
            </div>
            <div className='input'>
                <MessageInput send={send} />
            </div>
        </div>
    )
}

export default Chat;