import React, { useState } from 'react';

const Chat = () => {
	const [activeContent, setActiveContent] = useState("closed");
	const switchChat = () => {
		if (activeContent === 'open')
			setActiveContent("closed");
		else
			setActiveContent("open");
	}
	return (
		<div id="chat">
			{activeContent === 'open' &&
				(<div id="chatContent">Content</div>)}
			{activeContent === 'closed' &&
				(<div></div>)}
			<div id="chatButton" onClick={switchChat}>[ CHAT ]</div>
		</div>
	);
};
export default Chat;