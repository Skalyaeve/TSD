import React, { useState, useEffect } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css"
import { socket } from '../Root.tsx'


interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string; // Or your ChanType if defined
    passwd: string | null;
    // Add more fields as necessary
}

interface ChatChannelsProps {
    userInfo: {id: number; email: string; nickname: string; avatarFilename: string} | null;
    allChannelsbyUser: Channel[];
    setSelectedChannel: React.Dispatch<React.SetStateAction<Channel | null>>
    setSelectedContact: React.Dispatch<React.SetStateAction<{id: number; email: string; nickname: string; avatarFilename: string} | null>>
}
export default function ChatChannels({userInfo, allChannelsbyUser, setSelectedChannel, setSelectedContact} : ChatChannelsProps)
{   
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [channel, setChannel] = useState("");
    const [incompleteFormMessage, setIncompleteFormMessage] = useState("");
    /*members*/
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState<{id: number; nickname: string; avatarFilename: string} | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<{id: number; nickname: string; avatarFilename: string}[]>([]);
    const [matchedUsers, setMatchedUsers] = useState<{id: number; nickname: string; avatarFilename: string}[]>([]);
    const [members, setMembers] = useState<{id: number; nickname: string; avatarFilename: string}[]>([]);
    /*name*/
    const [newChannelName, setNewChannelName] = useState("");
    const [nameConfirmed, setNameConfirmed] = useState(false);
    const [confirmedChannelName, setConfirmedChannelName] = useState("");
    /*type*/
    const [channelType, setChannelType] = useState("");
    const [password, setPassword] = useState("");



    const handleSubmitNewChannelName = (e: any) =>
    {
        e.preventDefault();
        setConfirmedChannelName(newChannelName);
        console.log('confirmed channel name insideSubmitChannelName: ', confirmedChannelName);
        setNameConfirmed(true);
        setNewChannelName("");
    }

    const handleSubmitNewChannel = (e: any) =>
    {
        e.preventDefault();
        //here send the value
        if (confirmedChannelName === "" || channelType === "" || members.length === 0 || (channelType === 'PROTECTED' && password === "")) {
            setIncompleteFormMessage("There are missing fields");
            return;
        }
        setIncompleteFormMessage("");
        if (!userInfo) {
            console.log("handleSubmitNewChannel: no userInfo");
            return;
        }
        console.log('channel name: ', confirmedChannelName);
        console.log('userID: ', userInfo.id);
        console.log('type: ', channelType);
        console.log('password: ', password);
        console.log('members:', members);
        socket.emit('createChannel', {
            name: confirmedChannelName,
            userId: userInfo.id,
            type: channelType,
            psswd: password
        });

        socket.once('channelCreated', (channel: any) => {
            console.log("channel received: ", channel);
            const channelId = channel.id;
            console.log('channelid sent from front: ', channelId )
            // Emit 'joinChannel' event for each member to server
            members.forEach((member) => {
                socket.emit('joinChannel', { chanID: channelId, userID: member.id });
            });
        });
        setConfirmedChannelName("");
        setSelectedUsers([]);
        setMembers([]);
        setIsModalOpen(false);
        setNameConfirmed(false);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setSelectedUser(null);
    }

    useEffect(() => {
        console.log('receiving users that start by');
        socket.on('usersStartByFound', (users: {id: number; nickname: string; avatarFilename: string}[]) => {
            setMatchedUsers(users);
        });

        // Clean up when component unmounts
        return () => {
            socket.off('usersStartByFound');
        };
    }, []);

    const handleMembersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        // Emit 'getUserStartsBy' event with the input value
        console.log('getting users that start by');
        if (!userInfo) {
            console.log('handleMembersChange:  no userInfo');
            return;
        }
        console.log('user.id: ', userInfo.id);
        socket.emit('getUserStartsBy', {startBy: e.target.value, userId: userInfo.id});
    }

    const handleSelectUser = (user: {id: number; nickname: string; avatarFilename: string}) => {
        console.log('adding or removing selected member from channel');
      
        // Check if user is already selected
        if (members.some(member => member.id === user.id)) {
            // If user is already selected, remove them from the members
            setMembers(members.filter(member => member.id !== user.id));
        } else {
            // If user is not selected, add them to the members
            setMembers([...members, user]);
        }
      
        // Handle selectedUsers state
        if (selectedUsers.some(selectedUser => selectedUser.id === user.id)) {
            // If user is already selected, remove them from the selectedUsers
            setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        } else {
            // If user is not selected, add them to the selectedUsers
            setSelectedUsers([...selectedUsers, user]);
        }
        console.log('channel members: ', members);
    }

    return (
    <div className='channels'>
        <div className="Chan-title">
            <h1>
               [Channels] 
            </h1>
        </div>
        <div className="Chan-find">
            <div className="Chan-find-text">
                <input 
                    onChange={(e)=>setChannel(e.target.value)}
                    placeholder="Search channel"
                    value={channel}
                />
            </div>
            <button className="Chan-find-btn">
                <BsSearchHeart/>
            </button>
            <div className="Chan-find-text">
                <input 
                    onChange={(e)=>setNewChannelName(e.target.value)}
                    placeholder="Type new channel name"
                    value={newChannelName}
                />
            </div>
            <button className="Chan-find-btn" onClick={handleOpenModal}>
                <BsPlusCircle/>
            </button>
        </div>
        <div className="Chan-all-channels">
            {allChannelsbyUser.map((channel) => (
                <button className="channel-btn" key={channel.id} onClick={() => {
                    setSelectedChannel(channel);
                    setSelectedContact(null);
                }}>
                    {channel.name}
                </button>
            ))}
        </div>
        <Modal 
            isOpen={isModalOpen}
            onRequestClose={() => {
                setIsModalOpen(false);
                setSelectedUsers([]);
                setMembers([]);
            }}
            className="modal-chan-create"
            overlayClassName="overlay-chan-create"
        >
            <div className="chan-create-grid">
                <div className="create-title">
                    <h2>Create a new channel</h2>
                </div>
                <form className="create-form" onSubmit={handleSubmitNewChannel}>
                    <div className="create-name">
                        <input 
                            onChange={(e)=>setNewChannelName(e.target.value)}
                            placeholder="New channel name..."
                            value={newChannelName}
                            onKeyDown={(e)=>{
                                if(e.key === 'Enter') {
                                    handleSubmitNewChannelName(e);
                                }
                            }}
                        />
                        {nameConfirmed && (
                            <div className="chan-name-confirmation">
                                channel name set: {confirmedChannelName}
                            </div>
                        )}
                    </div>
                    <div className="select-members">
                        <input 
                            onChange={handleMembersChange}
                            placeholder="Add members"
                            value={searchQuery}
                        />
                        {/* Dropdown */}
                        {matchedUsers.length > 0 && (
                            <div className="select-members-dropdown">
                                {matchedUsers.map(user => (
                                    <div 
                                        className={`select-members-dropdown-item ${selectedUsers.find(selectedUser => selectedUser.id == user.id)? 'selected' : ''}`}
                                        onClick={() => handleSelectUser(user)}
                                    >
                                        {user.nickname}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="select-type">
                        <select 
                            onChange={(e)=>setChannelType(e.target.value)}
                            value={channelType} >
                            <option value="" selected disabled>Select channel type</option>
                            <option value="PRIVATE">Private</option>
                            <option value="PUBLIC">Public</option>
                            <option value="PROTECTED">Protected</option>
                        </select>
                        {channelType === 'PROTECTED' && 
                        <div className="chan-password-input">
                            <input 
                                type="password"
                                onChange={(e)=>setPassword(e.target.value)}
                                placeholder="Enter password"
                                value={password}
                            />
                        </div>}
                    </div>
                    {incompleteFormMessage && (
                        <div className="form-error-message">
                            {incompleteFormMessage}
                        </div>
                        )}
                </form>
                <div className="chan-create-submit">
                    <button className="chan-create-btn" type="submit" onClick={handleSubmitNewChannel}>Create Channel</button>
                </div>
            </div>
        </Modal>
    </div>
    )
}


