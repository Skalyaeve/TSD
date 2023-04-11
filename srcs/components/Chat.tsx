import React, { useEffect, useRef, useState, useCallback } from 'react'
import { DragDrop } from './utils.tsx';

function Chat() {
	// Valeurs
	const [chatButton, setChatButton] = useState('released')
	const [chat, setChat] = useState('closed')
	const [chatWidth, setChatWidth] = useState(0);
	const [userList, setUserList] = useState('closed')
	const [wispButton, setWispButton] = useState(0)

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
						<div className='chat__userList__label'>Connected</div>
						<div className='chat__user'
							onMouseEnter={() => setWispButton(1)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #1 ]
							</div>
							{wispButton == 1 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div>
						<div className='chat__user'
							onMouseEnter={() => setWispButton(2)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #2 ]
							</div>
							{wispButton == 2 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div>
						<div className='chat__user'
							onMouseEnter={() => setWispButton(3)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #3 ]
							</div>
							{wispButton == 3 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div>
						<div className='chat__user'
							onMouseEnter={() => setWispButton(4)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #4 ]
							</div>
							{wispButton == 4 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div>
						<div className='chat__user'
							onMouseEnter={() => setWispButton(5)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #5 ]
							</div>
							{wispButton == 5 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
						<div className='chat__user'
							onMouseEnter={() => setWispButton(6)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #6 ]
							</div>
							{wispButton == 6 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
						<div className='chat__user'
							onMouseEnter={() => setWispButton(7)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #7 ]
							</div>
							{wispButton == 7 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
						<div className='chat__user'
							onMouseEnter={() => setWispButton(8)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #8 ]
							</div>
							{wispButton == 8 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
						<div className='chat__user'
							onMouseEnter={() => setWispButton(9)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #9 ]
							</div>
							{wispButton == 9 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
						<div className='chat__user'
							onMouseEnter={() => setWispButton(10)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #10 ]
							</div>
							{wispButton == 10 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
						<div className='chat__user'
							onMouseEnter={() => setWispButton(11)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #11 ]
							</div>
							{wispButton == 11 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
						<div className='chat__user'
							onMouseEnter={() => setWispButton(12)}
							onMouseLeave={() => setWispButton(0)}>
							<div className='chat__user__link'>
								[ #12 ]
							</div>
							{wispButton == 12 && (<div className='chat__user__wisp'>
								[ /w ]
							</div>
							)}
						</div >
					</div >

					<input id='chat__input' name='chat__input' placeholder=' ...' />
					<div className='chat__sendMsg'>
						[OK]
					</div>

				</div >

				<div className={`chat__button ${chat === 'open' ? 'chat__button--expended' : ''} ${chatButton === 'pressed' ? 'chat__button--pressed' : ''}`}
					onMouseDown={() => setChatButton('pressed')}
					onMouseUp={() => { setChatButton('released'); switchCtat(); }}>
					[ CHAT ]
				</div>
			</div >
		</div >
	)
}
export default Chat