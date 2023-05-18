import React, { useCallback, useMemo } from 'react'
import { useEffect, useState } from 'react'
import io, { Socket } from "socket.io-client"
import MessageInput from './MessageInput.tsx'
import Messages from './Messages.tsx'
import { Link } from 'react-router-dom'
import "../../css/Chat/ChatMainGrid.css"
import ChatHeader from './ChatHeader.tsx'

function Chat({}) {
    const [allMessages, setAllMessages] = useState<{user: string; message: string; type: string}[]>([]);
    const [user, setUser] = useState(() => `User${Math.floor(Math.random() * 10)}`); // this will change 
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const socket = useMemo(()=>{
        console.log("NEW CONNECTION")
        return io("http://localhost:8001", { 
            transports: ["websocket"], 
            withCredentials: true
        })
    }, []);

    const send = useCallback((value: string, user: string) => {
            console.log("value: ", value);
            console.log("user: ", user);
            const message = {user, message: value, type: "sent"};
            setAllMessages((allMessages)=>[...allMessages, message]);
            socket.emit('message', message);
        }, [socket]);

    const messageListener = useCallback((message: { user: string; message: string}) => {
        console.log("i received");
        const newMessage = {...message, type: "received"};
        setAllMessages((allMessages)=>[...allMessages, newMessage]);
    }, []);

    const connectionResult = (message: { msg: string}) => {
        const newMessage = {...message};
        console.log(newMessage);
    }

    useEffect(() => {
        if (socket){
            console.log('messagelistener');
            socket.on("message", messageListener)
            return () => {
                socket.off("message", messageListener)
            }
        }
    },[socket])

    useEffect(() => {
        const chatMessages = document.getElementById("chat-messages");
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, [allMessages]);

    

    return (
        <div className={`chat-main-grid ${isOpen?"open":"close"}`}>
            <div className="manage-rooms">
                <div className='channels'>
                  <p>Channels</p>
                </div>
                <div className='direct-messages'>
                    <p>Direct Messages</p>
                </div>
            </div>
            <div className="chatbox">
                <ChatHeader contactName='Shupo' setIsOpen={setIsOpen}/>
                <div className='chat-messages' id="chat-messages">
                    {allMessages.map((message, index) => (
                    <Messages key={index} messages={[message]} currentUser={user} />
                    ))}
                </div>
                <div className='chat-input-text'>
                    <MessageInput send={send} user={user} setUser={setUser} />
                </div>
            </div>
            <div className={`contact-info ${isOpen?"open":"close"}`}>
                <div className='header-contact'>
                    header of the contact info
                </div>
                <div className='body-contact'>
                    body of contact info
                </div>
            </div>
        </div>
      );
}

export default Chat;