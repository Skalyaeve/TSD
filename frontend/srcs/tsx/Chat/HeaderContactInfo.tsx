import React, { useState, useEffect } from "react";
import defaultPhoto from "./kitty.png";
import { socket } from "../Root.tsx";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string;
    passwd: string | null;
}

interface Contact {
    id: number;
    email: string;
    nickname: string;
    avatarFilename: string;
}


interface HeaderContactInfoProps {
    photo?: string;
    userInfo: Contact | null;
    selectedContact: Contact | null;
    selectedChannel: Channel | null;
}

export default function HeaderContactInfo({ photo = defaultPhoto, userInfo, selectedChannel, selectedContact }: HeaderContactInfoProps) {

    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [newChatType, setNewChatType] = useState<string>("");
    const [password, setPassword] = useState<string | null>(null);
    const [showPasswordPrompt, setShowPasswordPrompt] = useState<boolean>(false);
    const [showDropdown, setShowDropdown] = useState<boolean>(false);
    const [chatName, setChatName] = useState<string>("No conversation selected");

    // let chatName = "No conversation selected"
    // if (selectedContact) {
    //     chatName = selectedContact.nickname;
    // }
    // else if (selectedChannel) {
    //     chatName = selectedChannel.name;
    // }

    useEffect(() => {
        if (selectedChannel) {
            console.log("channelType: ", selectedChannel.type);
            setChatName(selectedChannel.name);
        }
        else if (selectedContact) {
            setChatName(selectedContact.nickname);
        }
    }, [selectedChannel, selectedContact]);

    useEffect(() => {
        if (!socket) return
        if (selectedChannel && userInfo) {
            socket.emit('isChanOwner', { chanId: selectedChannel.id, memberId: userInfo.id, userId: userInfo.id });
            if (showDropdown) {
                setShowDropdown(false);
            }
        }
        socket.on('foundOwnerStatus', (data) => {
            setIsOwner(data);
        });
        return () => {
            if (!socket) return
            socket.off('foundOwnerStatus');
        }
    }, [userInfo, selectedChannel, showDropdown]);

    const handleEditChatName = () => {
        console.log('will change channel name');
    }

    const handleEditChatType = (newType: string) => {
        if (newType === "protected") {
            setShowPasswordPrompt(true);
        } else {
            setNewChatType(newType);
            setChannelType(newType);
        }
    }

    const setChannelType = (newType: string) => {
        if (!socket) return
        if (selectedChannel && userInfo && isOwner) {
            console.log('meow');
            socket.emit('setChannelType', { userId: userInfo.id, chanId: selectedChannel.id, newChanType: newType, password: password });
            setShowDropdown(false);
        }
        socket.on('chanTypeChanged', (confirmedChanType) => {
            setNewChatType(confirmedChanType);
            toast.success(`You have changed the channel type to '${confirmedChanType} :D`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                className: 'custom-toast',
            });
        })
    }

    const handleEditPassword = () => {
        if (selectedChannel && userInfo && selectedChannel.type === 'PROTECTED') {

        }
    }

    return (
        <div className='header-contact'>
            <div className="chat-info-photo">
                <img className="chat-photo" src={photo} alt='contactPhoto' />
            </div>
            <div className="chat-name">
                <h3>{chatName}</h3>
                {/* {selectedChannel && isOwner &&
                <button className="edit-btn" onClick={handleEditChatName}>
                    < AiOutlineEdit/>
                </button>} */}
            </div>
            {selectedChannel && isOwner && <div className="chat-type">
                <span className="chat-type-text">
                    Chat Type: {selectedChannel.type}
                </span>
                {showDropdown ?
                    <div className="dropdown">
                        {["PUBLIC", "PRIVATE", "PROTECTED"].filter(type => type !== selectedChannel.type).map(type =>
                            <div onClick={() => handleEditChatType(type)}>{type}</div>
                        )}
                    </div>
                    :
                    <button className="edit-btn" onClick={() => setShowDropdown(true)}>
                    </button>}
            </div>}
            {selectedChannel && isOwner && (selectedChannel.type === 'PROTECTED') && <div className="password-change">
                <span className="password-change-text">
                    Change Password
                </span>
                <button className="edit-btn" onClick={handleEditPassword}>
                </button>
            </div>}
        </div>
    )
}

// import React from "react";

// export default function HeaderContactInfo () {
//     return(
//         <div className='header-contact'>
//                 header of the contact info
//         </div>
//     )
// }