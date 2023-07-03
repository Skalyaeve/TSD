import React, { useState, useEffect } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FiRefreshCw } from "react-icons/fi";

import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css"
import { socket } from '../Root.tsx'


interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string;
    passwd: string | null;
}

interface ChatChannelsProps {
    userInfo: {id: number; email: string; nickname: string; avatarFilename: string} | null;
    allChannelsbyUser: Channel[];
    allChannelsNotJoined: Channel[];
    setAllChannelsNotJoined: React.Dispatch<React.SetStateAction<Channel[]>>
    setAllChannelsbyUser: React.Dispatch<React.SetStateAction<Channel[]>>
    setSelectedChannel: React.Dispatch<React.SetStateAction<Channel | null>>
    setSelectedContact: React.Dispatch<React.SetStateAction<{id: number; email: string; nickname: string; avatarFilename: string} | null>>
}
export default function ChatChannels({
    userInfo,
    allChannelsbyUser,
    allChannelsNotJoined,
    setAllChannelsNotJoined,
    setAllChannelsbyUser,
    setSelectedChannel,
    setSelectedContact} : ChatChannelsProps)
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
    /*channelsDisplay*/
    const [showChannelsbyUser, setShowChannelsByUser] = useState(true);
    /*channel join*/
    const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
    const [passwordInput, setPasswordInput] = useState("");
    const [channelToJoin, setChannelToJoin] = useState<Channel | null>(null);

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

    //Channel Joining

    const handleJoinChannel = (channel: Channel) => {
        setChannelToJoin(channel);
        if (channel.type === 'PUBLIC'){
            if(userInfo){
                socket.emit("joinChannel", {chanID: channel.id, userID: userInfo.id});
            }
        }
        else if (channel.type == "PROTECTED") {
            setIsPasswordPromptOpen(true);
        }
        else if (channel.type == "PRIVATE") {
            alert("cannot join private channel");
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("inside handlePasswordSubmit");
        if(channelToJoin && userInfo) {
            console.log("going to emit socket event to join private channel")
            socket.emit("joinProtectedChannel", {
                chanID: channelToJoin.id,
                userID: userInfo.id,
                password: passwordInput
            });
        }
        setIsPasswordPromptOpen(false);
        setPasswordInput("");
    };
    
    /**
     * 
     */

    const fetchChannels = () => {
        if (!userInfo) {
            console.log("user is not set");
            return;
        }
    
        const userId = userInfo.id;
    
        // Retrieving channels by user
        const getChannelsByUser = () => {
            socket.on('channelsByUserFound', (channels: Channel[]) => {
                setAllChannelsbyUser(channels);
                console.log("channels of the user: ", channels);
            });
    
            socket.emit('GetChannelsByUser', userId);
        };
    
        // Retrieving not joined channels
        const getNotJoinedChannels = () => {
            socket.on('notJoinedChannelsFound', (channels: Channel[]) => {
                setAllChannelsNotJoined(channels);
                console.log("not joined channels: ", channels);
            });
    
            socket.emit('GetNotJoinedChannels', userId);
        };
    
        getChannelsByUser();
        getNotJoinedChannels();
    };
    
    useEffect(() => {
        fetchChannels();
    
        return () => {
            socket.off('channelsByUserFound');
            socket.off('notJoinedChannelsFound');
        };
    }, [userInfo]);
    

    return (
    <div className='channels'>
        <div className="Chan-title">
            <h1>
               [Channels] 
            </h1>
            <button className="Chan-refresh-btn" onClick={fetchChannels}>
                <FiRefreshCw/>
            </button>
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
            {/* <div className="Chan-find-text">
                <input 
                    onChange={(e)=>setNewChannelName(e.target.value)}
                    placeholder="Type new channel name"
                    value={newChannelName}
                />
            </div> */}
            <button className="Chan-find-btn" onClick={handleOpenModal}>
                <BsPlusCircle/>
            </button>
        </div>
        <div className="Chan-all-channels">
            <button className="chan-create-btn" onClick={() => setShowChannelsByUser(!showChannelsbyUser)}>
                {showChannelsbyUser ? 'Joined': 'Not joined'}
            </button>
            {(showChannelsbyUser ? allChannelsbyUser : allChannelsNotJoined).map((channel) => (
                <div key={channel.id} className="channel-container">
                    <button className="channel-btn" key={channel.id} onClick={() => {
                        setSelectedChannel(channel);
                        setSelectedContact(null);
                    }}>
                        {channel.name}
                    </button>
                    {!showChannelsbyUser && (
                        <button className="Chan-find-btn" onClick={() => handleJoinChannel(channel)}>
                                <AiOutlinePlusCircle/>
                        </button>
                    )}
                </div>
            ))}
        </div>
        <Modal
          isOpen={isPasswordPromptOpen}
          onRequestClose={() => setIsPasswordPromptOpen(false)}
          className="modal-chan-psswd"
          overlayClassName="overlay-chan-psswd"
        >
          <div className="chan-psswd">
            <div className="title-chan-psswd">
                <h2>Enter Password</h2>
            </div>
            <div className="form-chan-psswd">
                <form onSubmit={handlePasswordSubmit}>
                    <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    required
                    />
                    <button className="chan-create-btn" type="submit">Join</button>
                </form>
            </div>
            <div className="close-chan-psswd">
                <button className="chan-create-btn" onClick={() => setIsPasswordPromptOpen(false)}>Close</button>
            </div>
          </div>
        </Modal>
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


