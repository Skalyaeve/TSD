import React, { useCallback, useMemo } from 'react'
import { useEffect, useState } from 'react'
import { socket } from '../Root.tsx'
import io, { Socket } from "socket.io-client"
import MessageInput from './MessageInput.tsx'
import Messages from './Messages.tsx'
import { Link } from 'react-router-dom'
import "../../css/Chat/ChatMainGrid.css"
import ChatHeader from './ChatHeader.tsx'
import HeaderContactInfo from './HeaderContactInfo.tsx'
import ChatChannels from './ChatChannels.tsx'
import DmHandler from './DmHandler.tsx'
import axios from 'axios'
// const socket = useMemo(()=>{
//     console.log("NEW CONNECTION")
//     return io("http://localhost:3000/chat", { 
//         transports: ["websocket"], 
//         withCredentials: true
//     })
// }, []);

function Chat({}) {

    const [allMessages, setAllMessages] = useState<{user: string; message: string; type: string}[]>([]);
    const [user, setUser] = useState(() => `User${Math.floor(Math.random() * 10)}`); // this will change 
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState(null);
    const [allUsers, setAllUsers] = useState<{id: number; email: string; nickname: string; avatarFilename: string}[]>([]);
    const [error, setError] = useState<any>(null);
    // const [selectedChannel, setSelectedChannel] = useState<any>(null);
    // const [selectedContact, setSelectedContact] = useState<{id: number; email: string; nickname: string; avatarFilename: string} | null>(null);
    
    
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

    // const handleContactSelect = (contact: {id: number; email: string; nickname: string; avatarFilename: string}) => {
    //     setSelectedContact(contact);
    //     setSelectedChannel(null);
    // }

    // const handleChannelSelect = (channel: any) => {
    //     setSelectedChannel(channel);
    //     setSelectedContact(null);
    // }

    useEffect(() => {
        socket.on('userInfo', (userData) => {
          setUserInfo(userData);
          const { nickname } = userData;
          console.log(' nickname ', nickname);
        });

        socket.emit('getUserInfo', () => {});
    
        return () => {
          socket.off('userInfo');
        };
    }, []);

    const axiosInstance = axios.create({
        withCredentials: true,
      });

    useEffect(() => {
        const fetchAllUsers =async () => {
            try {
                const response = await axiosInstance.get('http://localhost:3000/users/all');
                const users = response.data;
                setAllUsers(users);
                console.log(users);
            }
            catch (error) {
                setError(error)
            }
        };
        fetchAllUsers();
    }, []);
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
                {/* <DmHandler allUsers={allUsers} onContactSelect={}/> */}
                <DmHandler allUsers={allUsers}/>
                <ChatChannels/>
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
                <HeaderContactInfo/>
                <div className='body-contact'>
                    body of contact info
                </div>
            </div>
        </div>
      );
}

export default Chat;