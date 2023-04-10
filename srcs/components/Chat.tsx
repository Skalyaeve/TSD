import React, { useEffect, useRef, useState, useCallback } from 'react'
import DragDrop from './DragDrop.tsx';

function Chat() {
	// Variables
	const [chatButton, setChatButton] = useState('released')
	const [chat, setChat] = useState('closed')
	const [chatWidth, setChatWidth] = useState(0);
	const [userList, setUserList] = useState('closed')

	const chatRef = useRef<HTMLDivElement | null>(null)

	const [addRoomButton, setAddRoomButton] = useState('released')
	const [roomSettings, setRoomSettings] = useState('closed')
	const [roomSettingsPos, setRoomSettingsPos] = useState({ left: '100%' })
	const [roomBox, setRoomBox] = useState([
		{ id: 1, text: '[ #1 ]' },
		{ id: 2, text: '[ #2 ]' },
		{ id: 3, text: '[ #3 ]' }
	]);

	// Modifieurs
	const switchCtat = () => {
		setChat(chat === 'open' ? 'closed' : 'open')
		if (roomSettings === 'open')
			setRoomSettings('closed')
		if (chatRef.current) {
			const chatElement = chatRef.current;
			chatElement.setAttribute('style', `width: ${275}px`);
		}
	}
	const moveBox = useCallback((draggedId: number, droppedId: number) => {
		const draggedIndex = roomBox.findIndex((item) => item.id === draggedId);
		const droppedIndex = roomBox.findIndex((item) => item.id === droppedId);

		const newItems = [...roomBox];
		newItems.splice(draggedIndex, 1);
		newItems.splice(droppedIndex, 0, roomBox[draggedIndex]);

		setRoomBox(newItems);
	}, [roomBox]);
	const switchRoomSettings = () => {
		setRoomSettings(roomSettings === 'open' ? 'closed' : 'open')
	}
	const handleChatResize = () => {
		if (chatRef.current) {
			const chatRect = chatRef.current.getBoundingClientRect()
			setRoomSettingsPos({ left: `${chatRect.right}px` })
			setChatWidth(chatRect.width)
		}
	}

	useEffect(() => {
		handleChatResize()
	}, [roomSettings])

	useEffect(() => {
		if (chatWidth >= 450) {
			if (userList === 'closed')
				setUserList('open')
		}
		else if (chatWidth < 450 && userList === 'open')
			setUserList('closed')
	}, [chatWidth])

	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(handleChatResize)
		if (chatRef.current)
			chatSizeObserver.observe(chatRef.current)

		return () => {
			if (chatRef.current)
				chatSizeObserver.unobserve(chatRef.current)
		}
	}, [])

	// Retour
	return (
		<div className='chat--resize'>
			<div className={`chat__roomSettings ${roomSettings === 'closed' ? 'chat__roomSettings--closed' : ''}`}
				style={roomSettingsPos}>
				Room Settings
			</div>
			<div className={`chat ${chat === 'closed' ? 'chat--noResize' : ''}`}
				ref={chatRef}>
				<div className={`chat__content ${chat === 'closed' ? 'chat__content--hidden' : ''}`}>

					<div className='chat__rooms'>
						{roomBox.map((box) => (
							<DragDrop key={box.id} {...box} moveItem={moveBox} />
						))}
					</div>
					<div className={`chat__newRoom ${addRoomButton === 'pressed' ? 'chat__newRoom--pressed' : ''}`}
						onMouseDown={() => setAddRoomButton('pressed')}
						onMouseUp={() => { setAddRoomButton('released'); switchRoomSettings(); }}>
						{roomSettings === 'closed' ? (
							<>[+]</>
						) : (
							<>[-]</>
						)}
					</div>

					<div className={`chat__area ${userList === 'open' ? 'chat__area--shorten' : ''}`}>
						Content
					</div>
					<div className={`chat__userList ${userList === 'closed' ? 'chat__userList--hidden' : ''}`}>
						<div>Connected:</div>
						<div>[ #1 ]</div>
						<div>[ #2 ]</div>
						<div>[ #3 ]</div>
						<div>[ #4 ]</div>
						<div>[ #5 ]</div>
						<div>[ #6 ]</div>
						<div>[ #7 ]</div>
						<div>[ #8 ]</div>
						<div>[ #9 ]</div>
						<div>[ #10 ]</div>
						<div>[ #11 ]</div>
						<div>[ #12 ]</div>
						<div>[ #13 ]</div>
						<div>[ #14 ]</div>
						<div>[ #15 ]</div>
					</div>

					<input id='chat__input' name='chat__input' placeholder=' ...' />
					<div className='chat__sendMsg'>
						[OK]
					</div>

				</div>

				<div className={`chat__button ${chat === 'open' ? 'chat__button--expended' : ''} ${chatButton === 'pressed' ? 'chat__button--pressed' : ''}`}
					onMouseDown={() => setChatButton('pressed')}
					onMouseUp={() => { setChatButton('released'); switchCtat(); }}>
					[ CHAT ]
				</div>
			</div>
		</div>
	)
}
export default Chat