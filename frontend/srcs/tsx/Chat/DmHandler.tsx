import React, { useState, useEffect } from "react";
import { socket } from '../Root.tsx'


interface Channel {
    id: number;
    name: string;
    chanOwner: number;
    type: string; // Or your ChanType if defined
    passwd: string | null;
    // Add more fields as necessary
}

interface Contact {
    id: number;
    email: string;
    nickname: string;
    avatarFilename: string
}

interface DmHandlerProps {
    allUsers: Contact[];
    setAllUsers: React.Dispatch<React.SetStateAction<Contact[]>>
    setSelectedContact: React.Dispatch<React.SetStateAction<Contact | null>>
    // userInfo: {id: number; email: string; nickname: string; avatarFilename: string} | null;
    // setUserInfo: React.Dispatch<React.SetStateAction<{id: number; email: string; nickname: string; avatarFilename: string} | null>>;
    setSelectedChannel: React.Dispatch<React.SetStateAction<Channel | null>>
}

export default function DmHandler({ allUsers, setAllUsers, setSelectedContact, setSelectedChannel }: DmHandlerProps) {

    const [contact, setContact] = useState("");
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        //here send the value
        setContact("");
    }

    useEffect(() => {
        if (!socket) return
        socket.on('allUsersFound', (userData: { id: number; email: string; nickname: string; avatarFilename: string }[]) => {
            setAllUsers(userData);
            console.log('getting all the users')
        });
        socket.emit('getAllUsers')
    }, []);

    const fetchUsers = () => {

        const getUsers = () => {
            if (!socket) return
            socket.on('allUsersFound', (userData: { id: number; email: string; nickname: string; avatarFilename: string }[]) => {
                setAllUsers(userData);
                console.log('getting all the users')
            });
            socket.emit('getAllUsers')
        }

        getUsers();
    };

    useEffect(() => {
        fetchUsers();

        return () => {
            if (!socket) return
            socket.off('allUsersFound');
        };
    }, []);


    return (
        <div className='direct-messages'>
            <div className="DM-title">
                <h1>
                    [Direct Messages]
                </h1>
                <button className="Chan-refresh-btn" onClick={fetchUsers}>
                </button>
            </div>
            <div className="DM-find">
                <div className="DM-find-text">
                    <input
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Search conversation"
                        value={contact}
                    />
                </div>
                <button className="DM-find-btn">
                </button>
            </div>
            <div className="DM-conversations">
                {allUsers.map((user) => (
                    <button className="conversation-btn" key={user.id} onClick={() => {
                        setSelectedContact(user);
                        setSelectedChannel(null);
                    }}>
                        {user.nickname}
                    </button>
                ))}
            </div>
        </div>
    )
}