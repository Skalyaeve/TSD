import React, { useState, useEffect } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import Modal from 'react-modal';
import "../../css/Chat/ChannelCreate.css"
import { socket } from '../Root.tsx'


export default function ChatChannels()
{   
    const [channel, setChannel] = useState("");
    const [newChannel, setNewChannel] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [members, setMembers] = useState("");
    const [members, setMembers] = useState<{id: number; nickname: string; avatarFilename: string}[]>([]);
    const [matchedUsers, setMatchedUsers] = useState<{id: number; nickname: string; avatarFilename: string}[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [channelType, setChannelType] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: any) =>
    {
        e.preventDefault();
        //here send the value;
        setChannel("");
    }

    const handleSubmitNewChannel = (e: any) =>
    {
        e.preventDefault();
        //here send the value
        setNewChannel("");
        setIsModalOpen(false);
    }

    const handleOpenModal = () => {
        setIsModalOpen(true);
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
        socket.emit('getUserStartsBy', e.target.value);
    }

    const handleSelectUser = (user: {id: number; nickname: string; avatarFilename: string}) => {
        console.log('adding selected member to channel');
        setMembers([...members, user]);  // Add selected user to members
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
                    onChange={(e)=>setNewChannel(e.target.value)}
                    placeholder="Type new channel name"
                    value={newChannel}
                />
            </div>
            <button className="Chan-find-btn" onClick={handleOpenModal}>
                <BsPlusCircle/>
            </button>
        </div>
        <div className="Chan-all-channels">
            <div className="channel-convo">Channel 1</div>
            <div className="channel-convo">Channel 2</div>
            <div className="channel-convo">Channel 3</div>
            <div className="channel-convo">Channel 4</div>
        </div>

        <Modal 
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
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
                            onChange={(e)=>setNewChannel(e.target.value)}
                            placeholder="New channel name..."
                            value={newChannel}
                        />
                    </div>
                    <div className="select-members">
                        <input 
                            //onChange={(e)=>setMembers(e.target.value)}
                            onChange={handleMembersChange}
                            placeholder="Add members"
                            value={searchQuery}
                        />
                        {/* Dropdown */}
                        {matchedUsers.length > 0 && (
                            <div className="dropdown">
                                {matchedUsers.map(user => (
                                    <div className="dropdown-item" onClick={() => handleSelectUser(user)}>
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
                </form>
                <div className="chan-create-submit">
                    <button className="chan-create-btn" type="submit">Create Channel</button>
                </div>
            </div>
        </Modal>
    </div>
    )
}