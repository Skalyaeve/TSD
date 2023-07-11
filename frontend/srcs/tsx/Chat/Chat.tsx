// const socket = useMemo(()=>{
//     console.log("NEW CONNECTION")
//     return io("http://localhost:3000/chat", { 
//         transports: ["websocket"], 
//         withCredentials: true
//     })
// }, []);
import React, { useCallback } from 'react'
import { useEffect, useState } from 'react'
import { socket } from '../Root.tsx'
import MessageInput from './MessageInput.tsx'
import Messages from './Messages.tsx'
import "../../css/Chat/ChatMainGrid.css"
import ChatHeader from './ChatHeader.tsx'
import HeaderContactInfo from './HeaderContactInfo.tsx'
import ChatChannels from './ChatChannels.tsx'
import DmHandler from './DmHandler.tsx'
import ChatInfo from './ChatInfo.tsx'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createPortal } from 'react-dom';

function Chat({ }) {

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
    const [userInfo, setUserInfo] = useState<{ id: number; email: string; nickname: string; avatarFilename: string } | null>(null);
    const [allUsers, setAllUsers] = useState<{ id: number; email: string; nickname: string; avatarFilename: string }[]>([]);

    //PrivateMessage
    const [selectedContact, setSelectedContact] = useState<{ id: number; email: string; nickname: string; avatarFilename: string } | null>(null);
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
    const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
    const [userChannelsMember, setUserChannelsMember] = useState<ChanMember[]>([]);
    const [channelMessages, setChannelMessages] = useState<{ [key: number]: ChanMessage[] }>({});
    const [chanMembers, setChanMembers] = useState<ChanMember[]>([]);

    /**
     * Users Info
     */
    useEffect(() => {
        if (!socket) return

        socket.on('userInfo', (userData: { id: number; email: string; nickname: string; avatarFilename: string }) => {
            setUserInfo(userData);
            const { nickname } = userData;
            console.log(' nickname ', nickname);
        });

        socket.emit('getUserInfo', () => { });

        return () => {
            if (socket) socket.off('userInfo');
        };
    }, []);

    useEffect(() => {
        if (!socket) return

        socket.on('allUsersFound', (userData: { id: number; email: string; nickname: string; avatarFilename: string }[]) => {
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
        if (!selectedContact && !selectedChannel) {
            console.log("selected contact or selected channel are not set");
            return;
        }
        if (!socket) return
        if (selectedContact) {
            const message = {
                sender: userInfo.id,
                receiver: selectedContact.id,
                message: value,
                type: "sent"
            };
            console.log('sendPrivateMessage', { message })
            setAllMessages((allMessages) => [...allMessages, message]);
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
            setChannelMessages((currentMessages) => {
                const channelMessages = currentMessages[selectedChannel.id] || [];
                return {
                    ...currentMessages,
                    [selectedChannel.id]: [...channelMessages, message],
                };
            });
            // setAllChannelMessages((allChannelMessages) => [...allChannelMessages, message]);
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
        if (message.sender && message.recipient && message.content && (selectedContact?.id === message.sender)) { // Change here
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

        if (!socket) return
        socket.on("foundPrivateConversation", conversationListener);
        socket.on("privateMessageCreated", privateMessageCreatedListener);
        socket.on("privateMessageSent", privateMessageCreatedListener);

        return () => {
            if (socket) {
                socket.off("foundPrivateConversation", conversationListener);
                socket.off("privateMessageCreated", privateMessageCreatedListener);
                socket.off("privateMessageSent", privateMessageCreatedListener);
            }
        };
    }, [privateMessageCreatedListener]);

    useEffect(() => {
        if (userInfo && selectedContact) {
            if (socket)
                socket.emit('getPrivateConversation', { firstUser: userInfo.id, secondUser: selectedContact.id });
        }
    }, [userInfo, selectedContact]);

    useEffect(() => {
        const chatMessages = document.getElementById("chat-messages");
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }, [allMessages, channelMessages]);

    //   }, [allMessages, allChannelMessages]);

    /**
     * Channel
     */

    const channelMessageCreatedListener = useCallback((message: {
        sender: number,
        senderNick: string,
        chanId: number,
        content: string,
    }) => {
        if (message.sender && message.senderNick && message.content && (selectedChannel?.id === message.chanId)) {
            console.log("selectedChannelId: ", selectedChannel.id);
            console.log("message.chanId: ", message.chanId);
            console.log("CHANNEL MESSAGE CREATED LISTENER");
            const { sender, content, ...msg } = message;
            const formatted = {
                ...msg,
                sender,
                content: content,
                type: sender === userInfo?.id ? 'sent' : 'received' // Determine the type based on sender
            };
            console.log('channelMessageCreatedListener', { formatted });
            setChannelMessages((currentMessages) => {
                const channelMessages = currentMessages[selectedChannel.id] || [];
                const isDuplicate = channelMessages.find(m => m.content === formatted.content && m.sender === formatted.sender && m.chanId === formatted.chanId);
                if (!isDuplicate) {
                    return {
                        ...currentMessages,
                        [selectedChannel.id]: [...channelMessages, formatted],
                    };
                } else {
                    return currentMessages;
                }
            });
        }
    }, [userInfo, selectedChannel]);


    useEffect(() => {
        const channelMessageListener = ({ messages, chanId }: { messages: ChannelMessage[], chanId: number }) => {
            console.log("HERE");
            console.log("messages: ", messages);
            setChannelMessages((currentMessages) => {
                return { ...currentMessages, [chanId]: messages };
            });
        };
        if (!socket) return
        socket.on("channelMessagesFound", channelMessageListener);
        socket.on("SentChanMessage", channelMessageCreatedListener);

        return () => {
            if (socket) {
                socket.off("channelMessagesFound", channelMessageListener);
                socket.off("channelMessageCreated", channelMessageCreatedListener);
            }
        };
    }, [channelMessageCreatedListener]);


    useEffect(() => {
        if (userInfo && selectedChannel &&
            !allChannelsNotJoined.some(notJoinedChannel => notJoinedChannel.id === selectedChannel.id)) {
            console.log("getting channel messages first if");
            if (socket) socket.emit('GetChannelMessages', { chanId: selectedChannel.id, userId: userInfo.id });
        }
        else if (selectedChannel) {
            console.log("getting channel messages second if");
            setChannelMessages((currentMessages) => {
                return { ...currentMessages, [selectedChannel?.id]: [] };
            });
        }
    }, [userInfo, selectedChannel]);



    //retrieving joined channels
    useEffect(() => {
        if (!userInfo) {
            console.log("user is not set");
            return;
        }

        const userId = userInfo.id;

        if (!socket) return
        socket.on('channelsByUserFound', (channels: Channel[]) => {
            setAllChannelsbyUser(channels);
            console.log("channels of the user: ", channels);
        });

        socket.emit('GetChannelsByUser', userId);

        return () => {
            if (socket) socket.off('channelsByUserFound');
        };
    }, [userInfo]);

    //retrieving not joined channels
    useEffect(() => {
        if (!userInfo) {
            console.log("user is not set");
            return;
        }

        const userId = userInfo.id;

        if (!socket) return
        socket.on('notJoinedChannelsFound', (channels: Channel[]) => {
            setAllChannelsNotJoined(channels);
            console.log("not joined channels: ", channels);
        });

        socket.emit('GetNotJoinedChannels', userId);

        return () => {
            if (socket) socket.off('notJoinedChannelsFound');
        };
    }, [userInfo]);


    //listen for notification events

    useEffect(() => {
        if (!socket) return
        socket.on('youHaveBeenKicked', (channelName) => {
            toast.error(`You have been kicked from the channel '${channelName}', you can contact the channel admin to ask why and refresh your channels to see the change`, {
                position: "top-right",
                autoClose: 5000,
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
                autoClose: 5000,
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
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        socket.on('youWereMadeAdmin', (channelName) => {
            toast.success(`You have been granted admin privileges of the channel '${channelName}', congrats! Now you can ban, mute and kick members`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        socket.on('youWereRemovedAsAdmin', (channelName) => {
            toast.info(`You have lost admin privileges of the channel '${channelName}', contact the channel owner to ask why`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        });
        return () => {
            if (!socket) return
            socket.off('youHaveBeenKicked');
            socket.off('youHaveBeenMuted');
            socket.off('youWereBanned');
            socket.off('youWereMadeAdmin');
            socket.off('youWereRemovedAsAdmin');
        }
    }, []);
    return (
        <div className={`chat-main-grid ${isOpen ? "open" : "close"}`}>
            {createPortal(<ToastContainer />, document.body)}
            <div className="manage-rooms">
                <DmHandler allUsers={allUsers} setAllUsers={setAllUsers} setSelectedContact={setSelectedContact} setSelectedChannel={setSelectedChannel} />
                <ChatChannels userInfo={userInfo} allChannelsbyUser={allChannelsbyUser} allChannelsNotJoined={allChannelsNotJoined} setAllChannelsNotJoined={setAllChannelsNotJoined} setAllChannelsbyUser={setAllChannelsbyUser} setSelectedChannel={setSelectedChannel} setSelectedContact={setSelectedContact} />
            </div>
            <div className="chatbox">
                <ChatHeader
                    chatName={selectedContact?.nickname || selectedChannel?.name || 'No conversation selected'}
                    setIsOpen={setIsOpen} />
                <div className='chat-messages' id="chat-messages">
                    {selectedContact && <Messages
                        messages={allMessages || []}
                        userInfo={userInfo}
                        selectedChannel={selectedChannel}
                        selectedContact={selectedContact} />}
                    {selectedChannel && <Messages
                        messages={channelMessages[selectedChannel.id] || []}
                        userInfo={userInfo}
                        selectedChannel={selectedChannel}
                        selectedContact={selectedContact} />}
                </div>
                <div className='chat-input-text'>
                    <MessageInput sendMessage={SendMessage} userInfo={userInfo} selectedContact={selectedContact} selectedChannel={selectedChannel} />
                </div>
            </div>
            <div className={`contact-info ${isOpen ? "open" : "close"}`}>
                <HeaderContactInfo userInfo={userInfo} selectedChannel={selectedChannel} selectedContact={selectedContact} />
                <div className='body-contact'>
                    {(selectedContact || selectedChannel) && <ChatInfo userInfo={userInfo} selectedChannel={selectedChannel} selectedContact={selectedContact} />}
                </div>
            </div>
        </div>
    );
}

export default Chat;