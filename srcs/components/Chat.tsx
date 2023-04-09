import React, { useEffect, useRef, useState } from 'react'

function Chat() {
	// Variables
	const [chatOpenned, setChatOpenned] = useState("nop");
	const [roomSettings, setRoomSettings] = useState("closed");
	const [roomSettingsPosition, setRoomSettingsPosition] = useState({ left: "100%" });
	const chatRef = useRef<HTMLDivElement | null>(null);

	const updateRoomSettingsPosition = () => {
		if (chatRef.current) {
			const chatRect = chatRef.current.getBoundingClientRect();
			setRoomSettingsPosition({ left: `${chatRect.right}px` });
		}
	};

	const handleResize = () => {
		updateRoomSettingsPosition();
	};

	useEffect(() => {
		window.addEventListener("resize", updateRoomSettingsPosition);

		const resizeObserver = new ResizeObserver(handleResize);
		if (chatRef.current) {
			resizeObserver.observe(chatRef.current);
		}

		return () => {
			window.removeEventListener("resize", updateRoomSettingsPosition);

			if (chatRef.current) {
				resizeObserver.unobserve(chatRef.current);
			}
		};
	}, []);

	useEffect(() => {
		updateRoomSettingsPosition();
	}, [roomSettings]);

	// Modifieurs
	const switchCtat = () => {
		setChatOpenned(chatOpenned === "yep" ? "nop" : "yep");
		if (roomSettings === "openned") setRoomSettings("closed");
	};
	const switchRoomSettings = () => {
		setRoomSettings(roomSettings === "openned" ? "closed" : "openned");
	};

	// Retour
	return (
		<div className="chat--resize">
			<div className={`chat__roomSettings ${roomSettings === "closed" ? "chat__roomSettings--hidden" : ""}`} style={roomSettingsPosition}>
				Room Settings
			</div>

			<div className="chat" ref={chatRef}>

				<div className={`chat__content ${chatOpenned === "nop" ? "chat__content--hidden" : ""}`}>
					<div className="chat__rooms">[ROOMS]</div>
					<div className="chat__newRoom" onClick={switchRoomSettings}>
						{roomSettings === "closed" && <>[+]</>}
						{roomSettings === "openned" && <>[-]</>}
					</div>
					<div className="chat__area">Content</div>
					<input id="chat__input" name="chat__input" placeholder=" ..." />
					<div className="chat__sendMsg">[OK]</div>
				</div>

				<div className={`chat__button ${chatOpenned === "nop" ? "" : "chat__button--expended"}`} onClick={switchCtat}>
					[ CHAT ]
				</div>

			</div>
		</div>
	)
}
export default Chat