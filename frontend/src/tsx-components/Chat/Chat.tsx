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
import ChatInfo from './ChatInfo.tsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPortal } from 'react-dom';

function Chat({}) {

    interface ChanMember {
        chanId: number;
        member: number;
        isAdmin: boolean;
        muteTime: string; // or Date, depending on how you want to handle it
    }

    interface Channel {
        id: number;
        name: string;
        chanOwner: number;
        type: string; // Or your ChanType if defined
        passwd: string | null;
    }

    interface ChanMessage {
        sender: number;
        senderNick: string;
        chanId: number;
        timeSent?: string;
        content: string;
    }

    type ChannelMessage = {
        sender: number;
        senderNick: string;
        chanId: number;
        content: string;
        type: string;
        };

    // const [allMessages, setAllMessages] = useState<{user: string; message: string; type: string}[]>([]);
    
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [error, setError] = useState<any>(null);
    
    //Users
    const [userInfo, setUserInfo] = useState<{id: number; email: string; nickname: string; avatarFilename: string} | null>(null);
    const [allUsers, setAllUsers] = useState<{id: number; email: string; nickname: string; avatarFilename: string}[]>([]);
    
    //PrivateMessage
    const [selectedContact, setSelectedContact] = useState<{id: number; email: string; nickname: string; avatarFilename: string} | null>(null);
    const [allMessages, setAllMessages] = useState<
    {
        sender: number;
        receiver: number;
        message: string;
        type: string;
    }[]
    >([]);

    //Channel
    const [allChannelsbyUser, setAllChannelsbyUser] = useState<Channel[]>([]);
    const [allChannelsNotJoined, setAllChannelsNotJoined] = useState<Channel[]>([]);
    const [selectedChannel, setSelectedChannel] = useState<Channel | null >(null);
    const [userChannelsMember, setUserChannelsMember] = useState<ChanMember[]>([]);
    const [allChannelMessages, setAllChannelMessages] = useState<ChanMessage[]>([]);
    const [chanMembers, setChanMembers] = useState<ChanMember[]>([]);

    /**
     * Users Info
     */
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

    useEffect(() => {
        socket.on('allUsersFound', (userData: {id: number; email: string; nickname: string; avatarFilename: string}[]) => {
            setAllUsers(userData);
            console.log('getting all the users')
        });
        socket.emit('getAllUsers')
    }, []);

    /**
     * Private message
     */

    const SendMessage = useCallback((value: string) => {
        if (!userInfo) {
            console.log("user is not set");
            console.log("user:", userInfo);
            console.log("selectedContact:", selectedContact);
            console.log("selectedChannel:", selectedChannel);
            return;
        }
        if (!selectedContact && !selectedChannel)
        {
            console.log("selected contact or selected channel are not set");
            return;
        }
        if (selectedContact) {
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
            socket.emit('sendPrivateMessage', { senderID: userInfo.id, recipientID: selectedContact.id, content: value })
        }
        else if (selectedChannel) {
            const message = {
                sender: userInfo.id,
                senderNick: userInfo.nickname,
                chanId: selectedChannel.id,
                content: value,
                type: "sent",
            };
            console.log('sendMessage', { message });
            setAllChannelMessages((allChannelMessages) => [...allChannelMessages, message]);
            console.log('going to send channel message');
            socket.emit('sendChanMessage', { senderId: userInfo.id, senderNick: userInfo.nickname, chanId: selectedChannel.id, content: value });
        }
        else {
            console.log("Neither user nor channel is selected for the message to be sent");
        }
    }, [userInfo, selectedContact, selectedChannel]);

    const privateMessageCreatedListener = useCallback((message: {
        sender: number;
        recipient: number;
        content: string;
    }) => {
        if (message.sender && message.recipient && message.content && (selectedContact?.id === message.sender))
             
                { // Change here
                    console.log("entering here");
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
                console.log("after if statement");
    }, [selectedContact]);

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

    useEffect(() => {
        const chatMessages = document.getElementById("chat-messages");
        if (chatMessages) {
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }
      }, [allMessages, allChannelMessages]);

    /**
     * Channel
     */

    const channelMessageCreatedListener = useCallback((message: {
        sender: number,
        senderNick: string,
        chanId: number,
        content: string,
    }) => {
        if (message.sender && message.senderNick && message.content) {
            console.log("entering here");
            const { sender, content, ...msg } = message;
            const formatted = { 
                ...msg, 
                sender, 
                content: content, 
                type: sender === userInfo?.id ? 'sent' : 'received' // Determine the type based on sender
            };
            console.log('channelMessageCreatedListener', { formatted })
            setAllChannelMessages((allChannelMessages) => {
                if (!allChannelMessages.find(m => m.content === message.content && 
                    m.sender === message.sender && 
                    m.chanId === message.chanId)) {
                    return [...allChannelMessages, formatted]
                } else {
                    return allChannelMessages
                }
            });
        }
    }, [userInfo]);

    useEffect(() => {
        const channelMessageListener = (messages: ChannelMessage[]) => {
            setAllChannelMessages(messages);
        }
        socket.on("channelMessagesFound", channelMessageListener);
        socket.on("SentChanMessage", channelMessageCreatedListener);

        return () => {
            socket.off("channelMessagesFound", channelMessageListener);
            socket.off("channelMessageCreated", channelMessageCreatedListener);
        };
    }, [channelMessageCreatedListener]);

    useEffect(() => {
        if (userInfo && selectedChannel &&
            !allChannelsNotJoined.some(notJoinedChannel => notJoinedChannel.id === selectedChannel.id)) {
            socket.emit('GetChannelMessages', {chanId: selectedChannel.id, userId: userInfo.id});
        }
        else{
            setAllChannelMessages([]);
        }
    }, [userInfo, selectedChannel]);
    
    //retrieving joined channels
    useEffect(() => {
        if (!userInfo) {
        console.log("user is not set");
        return;
        }
    
        const userId = userInfo.id;
    
        socket.on('channelsByUserFound', (channels: Channel[]) => {
            setAllChannelsbyUser(channels);
        console.log("channels of the user: ", channels);
        });
    
        socket.emit('GetChannelsByUser', userId);
    
        return () => {
        socket.off('channelsByUserFound');
        };
    }, [userInfo]);

    //retrieving not joined channels
    useEffect(() => {
        if (!userInfo) {
        console.log("user is not set");
        return;
        }
    
        const userId = userInfo.id;
    
        socket.on('notJoinedChannelsFound', (channels: Channel[]) => {
            setAllChannelsNotJoined(channels);
        console.log("not joined channels: ", channels);
        });
    
        socket.emit('GetNotJoinedChannels', userId);
    
        return () => {
        socket.off('notJoinedChannelsFound');
        };
    }, [userInfo]);


    //listen for notification events

    useEffect(() => {
        socket.on('youHaveBeenKicked', (channelName) => {
            toast.error(`You have been kicked from the channel '${channelName}', you can contact the channel admin to ask why and refresh your channels to see the change`, {
                position: "top-right",
                autoClose: 50000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        socket.on('youHaveBeenMuted', (channelName) => {
            toast.error(`You have been muted in the channel '${channelName}', you can contact the channel admin to ask why and refresh your channels to see the change`, {
                position: "top-right",
                autoClose: 50000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        socket.on('youWereBanned', (channelName) => {
            toast.error(`You have been banned from the channel '${channelName}', contact the channel admin to ask why and refresh your channels to see the change`, {
                position: "top-right",
                autoClose: 50000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        socket.on('youWereMadeAdmin', (channelName) => {
            toast.error(`You have been granted admin privileges of the channel '${channelName}', congrats! Now you can ban, mute and kick members`, {
                position: "top-right",
                autoClose: 50000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        socket.on('youWereRemovedAsAdmin', (channelName) => {
            toast.error(`You have lost admin privileges of the channel '${channelName}', contact the channel owner to ask why`, {
                position: "top-right",
                autoClose: 50000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        return () => {
            socket.off('youHaveBeenKicked');
            socket.off('youHaveBeenMuted');
            socket.off('youWereBanned');
            socket.off('youWereMadeAdmin');
            socket.off('youWereRemovedAsAdmin');
        }
    }, []);


    return (
        <div className={`chat-main-grid ${isOpen?"open":"close"}`}>
            {createPortal(<ToastContainer/>, document.body)}
            <div className="manage-rooms">
                <DmHandler allUsers={allUsers} setAllUsers={setAllUsers} setSelectedContact={setSelectedContact} setSelectedChannel={setSelectedChannel}/>
                <ChatChannels userInfo={userInfo} allChannelsbyUser={allChannelsbyUser} allChannelsNotJoined={allChannelsNotJoined} setAllChannelsNotJoined={setAllChannelsNotJoined} setAllChannelsbyUser={setAllChannelsbyUser }setSelectedChannel={setSelectedChannel} setSelectedContact={setSelectedContact}/>
            </div>
            <div className="chatbox">
                <ChatHeader chatName={selectedContact?.nickname || selectedChannel?.name ||'No conversation selected' } setIsOpen={setIsOpen}/>
                <div className='chat-messages' id="chat-messages">
                    {selectedContact && <Messages key={selectedContact} messages={allMessages || []} userInfo={userInfo} selectedContact={selectedContact}/>}
                    {selectedChannel && <Messages key={selectedChannel} messages={allChannelMessages || []} userInfo={userInfo} selectedChannel={selectedChannel}/>}
                </div>
                <div className='chat-input-text'>
                    <MessageInput sendMessage={SendMessage} userInfo={userInfo} selectedContact={selectedContact} selectedChannel={selectedChannel}/>
                </div>
            </div>
            <div className={`contact-info ${isOpen?"open":"close"}`}>
                <HeaderContactInfo chatName={selectedContact?.nickname || selectedChannel?.name ||'No conversation selected' }/>
                <div className='body-contact'>
                    {(selectedContact || selectedChannel) && <ChatInfo userInfo={userInfo} selectedChannel={selectedChannel} selectedContact={selectedContact}/>}
                </div>
            </div>
        </div>
      );
}

export default Chat;