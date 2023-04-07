import React, { useState } from 'react';

// Types
function Chat() {
	// Variables
	const [state, setState] = useState("hidden");

	// Modifieurs
	const switchStat = () => {
		setState(state === "open" ? "hidden" : "open");
	};

	// Retour
	return (
		<div className="chat">

			<div className={`chat__content ${state === "hidden" ? "chat__content--hidden" : ""}`}>
				Content
			</div>

			<div className="chat__button" onClick={switchStat}>
				[ CHAT ]
			</div>

		</div>
	);
};
export default Chat;