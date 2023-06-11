// const socket = useMemo(()=>{
//     console.log("NEW CONNECTION")
//     return io("http://localhost:3000/chat", { 
//         transports: ["websocket"], 
//         withCredentials: true
//     })
// }, []);
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

function Chat({}) {

    // const [allMessages, setAllMessages] = useState<{user: string; message: string; type: string}[]>([]);
    const [allMessages, setAllMessages] = useState<
    {
        sender: number;
        receiver: number;
        message: string;
        type: string;
    }[]
    >([]);

    const [user, setUser] = useState(() => `User${Math.floor(Math.random() * 10)}`); // this will change 
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [userInfo, setUserInfo] = useState<{id: number; email: string; nickname: string; avatarFilename: string} | null>(null);
    const [allUsers, setAllUsers] = useState<{id: number; email: string; nickname: string; avatarFilename: string}[]>([]);
    const [error, setError] = useState<any>(null);
    const [selectedContact, setSelectedContact] = useState<{id: number; email: string; nickname: string; avatarFilename: string} | null>(null);
    const [selectedChannel, setSelectedChannel] = useState("");

    const sendPrivateMessage = useCallback((value: string) => {
        if (!userInfo || !selectedContact) {
            console.log("user or selected contact is not set");
            return;
        }
        const message = {
            sender: userInfo.id,
            receiver: selectedContact.id,
            message: value,
            type: "sent"
        };
        console.log('sendPrivateMessage', { message })
        setAllMessages((allMessages)=>[...allMessages, message]);
        // The message emitted should match with what your server expects
        console.log('going to create private message');
        socket.emit('createPrivateMessage', { senderID: userInfo.id, recipientID: selectedContact.id, content: value });
        console.log('going to send private message');
        socket.emit('sendPrivateMessage', { senderID: userInfo.id, recipientID: selectedContact.id, content: value });
    }, [userInfo, selectedContact]);

    const privateMessageCreatedListener = useCallback((message: {
        sender: number;
        recipient: number;
        content: string;
    }) => {
        // console.log("Received message", message);  // Add this line
        if (message.sender && message.recipient && message.content && (selectedContact?.id === message.sender))
             
                { // Change here
                    const { recipient: receiver, content, ...msg } = message;
                    const formated = { ...msg, receiver, message: content, type: 'received' };
                    console.log('privateMessageCreatedListener', { formated })
                    setAllMessages((allMessages) => {
                        if (!allMessages.find(m => m.message === message.content && 
                            m.sender === message.sender && // Change here
                            m.receiver === message.recipient))
                            return [...allMessages, formated]
                        else return allMessages
                    });
                }
    }, []);




    useEffect(() => {
        const conversationListener = (conversation: { sender: number; recipient: number; timeSent: Date; content: string }[]) => {
            console.log(conversation); 
            // Transform the conversation here to match with your message structure
            const transformedConversation = conversation.map(msg => {
              return {
                sender: msg.sender,
                receiver: msg.recipient,
                message: msg.content,
                type: "received"
              };
            });
            setAllMessages(transformedConversation);
        };
    
        socket.on("foundPrivateConversation", conversationListener);
        socket.on("privateMessageCreated", privateMessageCreatedListener);
        socket.on("privateMessageSent", privateMessageCreatedListener);
    
        return () => {
            socket.off("foundPrivateConversation", conversationListener);
            socket.off("privateMessageCreated", privateMessageCreatedListener);
            socket.off("privateMessageSent", privateMessageCreatedListener);
        };
    }, [privateMessageCreatedListener]);
    
    useEffect(() => {
        if (userInfo && selectedContact) {
            socket.emit('getPrivateConversation', { firstUser: userInfo.id, secondUser: selectedContact.id });
        }
    }, [userInfo, selectedContact]);
    const connectionResult = (message: { msg: string}) => {
        const newMessage = {...message};
        console.log(newMessage);
    }

    useEffect(() => {
        socket.on('userInfo', (userData: {id: number; email: string; nickname: string; avatarFilename: string}) => {
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
        const chatMessages = document.getElementById("chat-messages");
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, [allMessages]);

    return (
        <div className={`chat-main-grid ${isOpen?"open":"close"}`}>
            <div className="manage-rooms">
                <DmHandler allUsers={allUsers} setSelectedContact={setSelectedContact} userInfo={userInfo} setUserInfo={setUserInfo}/>
                <ChatChannels userInfo={userInfo} setUserInfo={setUserInfo}/>
            </div>
            <div className="chatbox">
                <ChatHeader contactName={selectedContact?.nickname || 'No conversation selected'} setIsOpen={setIsOpen}/>
                <div className='chat-messages' id="chat-messages">
                    {selectedContact && <Messages key={selectedContact} messages={allMessages || []} userInfo={userInfo} selectedContact={selectedContact}/>}
                </div>
                <div className='chat-input-text'>
                    <MessageInput sendPrivateMessage={sendPrivateMessage} userInfo={userInfo} selectedContact={selectedContact} />
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