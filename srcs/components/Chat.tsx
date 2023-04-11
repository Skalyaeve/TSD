import React, { useEffect, useRef, useState, useCallback } from 'react'
import { DragDrop } from './utils.tsx';
import { newBox } from './utils.tsx'

function Chat() {
	// Valeurs
	const [boxPressed, setBoxPressed] = useState(0)
	const [wispButton, setWispButton] = useState(0)

	const [chat, setChat] = useState('closed')
	const [chatWidth, setChatWidth] = useState(0);
	const [userList, setUserList] = useState('closed')

	const chatRef = useRef<HTMLDivElement | null>(null)

	const [roomSettings, setRoomSettings] = useState('closed')
	const [roomSettingsPos, setRoomSettingsPos] = useState({ left: '100%' })
	const [roomBox, setRoomBox] = useState([
		{ id: 1, text: '[ #1 ]' },
		{ id: 2, text: '[ #2 ]' },
		{ id: 3, text: '[ #3 ]' }
	]);

	const isPressed = (id: integer) => (boxPressed === id ? 'chat__button--pressed' : '')
	const chatGateBoxName = `${isPressed(1)} ${chat === 'open' ? 'chat__gate--expended' : ''} chat__gate`
	const newRoomBoxName = `${isPressed(2)} chat__newRoom`
	const roomSettingsBoxName = `chat__roomSettings ${roomSettings === 'closed' ? 'chat__roomSettings--closed' : ''}`
	const sendMsgBoxName = `${isPressed(3)} chat__sendMsg`

	const chatGateBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(1),
			onMouseUp: () => { setBoxPressed(0); switchCtat() },
			content: '[ CHAT ]'
		})
	)
	const newRoomBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(2),
			onMouseUp: () => { setBoxPressed(0); switchRoomSettings() },
			content: roomSettings === 'closed' ? (
				<>[+]</>
			) : (
				<>[-]</>
			)
		})
	)
	const sendMsgBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(3),
			onMouseUp: () => setBoxPressed(0),
			content: '[ OK ]'
		})
	)
	const usrLinkBox = (name: string, id: integer) => (
		newBox({
			tag: 'div',
			className: name,
			content: `[ #${id} ]`
		})
	)
	const usrWispBox = (name: string, id: integer) => (
		newBox({
			tag: 'div',
			className: name,
			content: '[ /w ]'
		})
	)
	const chatUsrBox = (name: string, id: integer) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseEnter: () => setWispButton(id),
			onMouseLeave: () => setWispButton(0),
			onMouseDown: () => setBoxPressed(3 + id),
			onMouseUp: () => setBoxPressed(0),
			content: `${usrLinkBox('chat__user__link', id)}
			${wispButton === id && usrWispBox('chat__user__wisp', id)}`
		})
	)

	// Modifieurs
	const switchCtat = () => {
		setChat(chat === 'open' ? 'closed' : 'open')
		if (roomSettings === 'open')
			setRoomSettings('closed')
		if (chatRef.current) {
			const chatElement = chatRef.current;
			chatElement.setAttribute('style', `width: 275px`);
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
			{chatGateBox(chatGateBoxName)}

			<div className={`chat ${chat === 'closed' ? 'chat--noResize' : ''}`} ref={chatRef}>
				<div className={`chat__content ${chat === 'closed' ? 'chat__content--hidden' : ''}`}>

					<div className='chat__rooms'>
						{roomBox.map((box) => (
							<DragDrop key={box.id} {...box} moveItem={moveBox} />
						))}
					</div>
					{newRoomBox(newRoomBoxName)}

					<div className={`chat__area ${userList === 'open' ? 'chat__area--shorten' : ''}`}>
						Content
					</div>
					<div className={`chat__userList ${userList === 'closed' ? 'chat__userList--hidden' : ''}`}>
						<div className='chat__userList__label'>Connected</div>
						{chatUsrBox('chat__user', 1)}
						{chatUsrBox('chat__user', 2)}
						{chatUsrBox('chat__user', 3)}
						{chatUsrBox('chat__user', 4)}
						{chatUsrBox('chat__user', 5)}
						{chatUsrBox('chat__user', 6)}
						{chatUsrBox('chat__user', 7)}
						{chatUsrBox('chat__user', 8)}
						{chatUsrBox('chat__user', 9)}
						{chatUsrBox('chat__user', 10)}
						{chatUsrBox('chat__user', 11)}
						{chatUsrBox('chat__user', 12)}
					</div >

					<input id='chat__input' name='chat__input' placeholder=' ...' />
					{sendMsgBox(sendMsgBoxName)}

				</div >
			</div >
			<div className={roomSettingsBoxName} style={roomSettingsPos}>
				Room Settings
			</div>
		</div >
	)
}
export default Chat