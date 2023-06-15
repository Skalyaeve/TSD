import React from "react";
import defaultPhoto from "./kitty.png";

interface HeaderContactInfoProps {
        photo?: string;
        chatName: string;
    }

export default function HeaderContactInfo ({photo = defaultPhoto, chatName,}: HeaderContactInfoProps) {
    return(
        <div className='header-contact'>
            <div className="header-contact">
                <img className="chat-header-photo" src={photo} alt='contactPhoto'/>
            </div>
            <div>
                <h3 className="header-contact">{chatName}</h3>
            </div>
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