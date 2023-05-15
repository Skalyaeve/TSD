import React from 'react'
import { useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client"
import MessageInput from './MessageInput.tsx'
import Messages from './Messages.tsx'
import { Link } from 'react-router-dom'
import "../../css/Chat/ChatMainGrid.css"

function Chat({ name }: { name: string }) {
    const [socket, setSocket] = useState<Socket>();
    const [allMessages, setAllMessages] = useState<{user: string; message: string; type: string}[]>([]);
    const [user, setUser] = useState(() => `User${Math.floor(Math.random() * 10)}`);// this will change 

    const send = (value: string, user: string) => {
        console.log("value: ", value);
        console.log("user: ", user);
        const message = {user, message: value, type: "sent"};
        setAllMessages([...allMessages, message]);
        socket?.emit('message', message);
    };

    useEffect(() => {
        console.log("NEW CONNECTION")
        const newSocket = io("http://localhost:8001", { transports: ["websocket"], withCredentials: true })
        setSocket(newSocket)
    }, [setSocket])

    const messageListener = (message: { user: string; message: string}) => {
        const newMessage = {...message, type: "received"};
        setAllMessages([...allMessages, newMessage]);
    };

    const connectionResult = (message: { msg: string}) => {
        const newMessage = {...message};
        console.log(newMessage);
    }


    useEffect(() => {
        // console.log('heree');
        socket?.on("connectionResult", connectionResult);
        return () => {
            socket?.off("connectionResult");
          };
    });

    useEffect(() => {
        console.log('messagelistener');
        socket?.on("message", messageListener)
        return () => {
            socket?.off("message", messageListener)
        }
    }, [send])


    return (
        <div className="chat-main-grid">
            <div className="manage-rooms">
                <div className='channels'>
                  <p>Channels</p>
                </div>
                <div className='direct-messages'>
                    <p>Direct Messages</p>
                </div>
            </div>
            <div className="chatbox">
                <div className='chat-header'>
                    <p>chat header</p>
                </div>
                <div className='chat-messages'>
                    {allMessages.map((message, index) => (
                    <Messages key={index} messages={[message]} currentUser={user} />
                    ))}
                </div>
                <div className='chat-input-text'>
                    <MessageInput send={send} user={user} setUser={setUser} />
                </div>
            </div>
            <div className="contact-info">
                <div className='header-contact'>
                    <p>header of the contact info</p>
                </div>
                <div className='body-contact'>
                    <p>body of contact info</p>
                </div>
            </div>
        </div>
      );
}

export default Chat;