import React, { useState, useEffect } from "react";
import { BsSearchHeart } from "react-icons/bs";
import { BsPlusCircle } from "react-icons/bs";
import Modal from 'react-modal';

export default function ChatChannels()
{
    // useEffect(() => {
    //     setIsModalOpen(true);
    //   }, []);
    
    const [channel, setChannel] = useState("");
    const [newChannel, setNewChannel] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [members, setMembers] = useState("");
    const [channelType, setChannelType] = useState("");

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
        >
            <h2>Create a new channel</h2>
            <form onSubmit={handleSubmitNewChannel}>
                <input 
                    onChange={(e)=>setNewChannel(e.target.value)}
                    placeholder="Type new channel name"
                    value={newChannel}
                />
                <input 
                    onChange={(e)=>setMembers(e.target.value)}
                    placeholder="Type members"
                    value={members}
                />
                <select 
                    onChange={(e)=>setChannelType(e.target.value)}
                    value={channelType}
                >
                    <option value="">Select channel type</option>
                    <option value="private">Private</option>
                    <option value="public">Public</option>
                </select>
                <button type="submit">Create Channel</button>
            </form>
        </Modal>
    </div>
    )
}


// import React, { useState } from "react";
// import { BsSearchHeart } from "react-icons/bs";
// import { BsPlusCircle } from "react-icons/bs";
// import Modal from 'react-modal';

// export default function ChatChannels()
// {

//     const [channel, setChannel] = useState("");
//     const [newChannel, setNewChannel] = useState("");
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [members, setMembers] = useState("");
//     const [channelType, setChannelType] = useState("");

//     const handleSubmit = (e: React.FormEvent) =>
//     {
//         e.preventDefault();
//         //here send the value;
//         setChannel("");
//     }

//     const handleSubmitNewChannel = (e: React.FormEvent) =>
//     {
//         e.preventDefault();
//         //here send the value
//         setNewChannel("");
//     }

//     const handleOpenModal = () => {
//         setIsModalOpen(true);
//     }

//     return (
//     <div className='channels'>
//         <div className="Chan-title">
//             <h1>
//                [Channels] 
//             </h1>
//         </div>
//         <div className="Chan-find">
//             <div className="Chan-find-text">
//                 <input 
//                     onChange={(e)=>setChannel(e.target.value)}
//                     placeholder="Search channel"
//                     value={channel}
//                 />
//             </div>
//             <button className="Chan-find-btn">
//                 <BsSearchHeart/>
//             </button>
//             <div className="Chan-find-text">
//                 <input 
//                     onChange={(e)=>setNewChannel(e.target.value)}
//                     placeholder="Type new channel name"
//                     value={newChannel}
//                 />
//             </div>
//             <button className="Chan-find-btn" onClick={handleOpenModal}>
//                 <BsPlusCircle/>
//             </button >
//         </div>
//         <div className="Chan-all-channels">
//             <div className="channel-convo">Channel 1</div>
//             <div className="channel-convo">Channel 2</div>
//             <div className="channel-convo">Channel 3</div>
//             <div className="channel-convo">Channel 4</div>
//         </div>

//         <Modal
//             isOpen={isModalOpen}
//             onRequestClose={() => setIsModalOpen(false)}
//         >
//             <h2>Create a new channel</h2>
//             <form onSubmit={handleSubmitNewChannel}>
//                 <input 
//                     onChange={(e)=>setNewChannel(e.target.value)}
//                     placeholder="Type new channel name"
//                     value={newChannel}
//                 />
//                 <input
//                     onChange={(e)=>setMembers(e.target.value)}
//                     placeholder="Type members"
//                     value={members}
//                 />
//                 <select
//                     onChange={(e)=>setChannelType(e.target.value)}
//                     value={channelType}
//                 >
//                     <option value="">select channel type</option>
//                     <option value="private">Private</option>
//                     <option value="public">Public</option>
//                     <option value="protected">Protected</option>
//                 </select>
//                 <button type="submit">Create Channel</button>
//             </form>
//         </Modal>
//     </div>
//     )
// }