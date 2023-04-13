import React, { useEffect, useRef, useState, useCallback } from 'react'
import { DragDrop, newBox } from './utils.js'

function Chat() {
	// Valeurs
	const [boxPressed, setBoxPressed] = useState(0)
	const [chatArea, setChatArea] = useState(1)
	const [roomBoxPressed, setRoomBoxPressed] = useState(0)
	const [showWispButton, setShowWispButton] = useState(0)

	const [chatOpenned, setChatOpenned] = useState(false)
	const [chatWidth, setChatWidth] = useState(0)
	const [userListShowed, setUserListShowed] = useState(false)

	const chatRef = useRef<HTMLDivElement | null>(null)

	type RoomBoxType = {
		id: number
		content: React.ReactNode
	}
	const [roomBox, setRoomBox] = useState<RoomBoxType[]>([])
	const [roomSettingsOpen, setRoomSettingsOpen] = useState(0)
	const [roomSettingsPos, setRoomSettingsPos] = useState({ left: '100%' })

	const isPressed = (id: number) => (boxPressed === id ? 'chat__button--pressed' : '')

	const chatBoxName = `chat ${chatOpenned === false ? 'chat--noResize' : ''}`
	const chatGateBoxName = `${isPressed(1)} ${chatOpenned === true ? 'chat__gate--expended' : ''} chat__gate`
	const chatContentBoxName = `chat__content ${chatOpenned === false ? 'chat__content--hidden' : ''}`

	const roomzBoxName = `${isPressed(2)} chat__rooms`
	const roomBoxName = (id: number) => `chat__room_${id}`
	const newRoomBoxName = `${isPressed(3)} chat__newRoom`
	const roomSettingsBoxName = `chat__roomSettings ${roomSettingsOpen === 0 ? 'chat__roomSettings--closed' : ''}`

	const chatAreaBoxName = `chat__area ${userListShowed === true ? 'chat__area--shorten' : ''}`
	const sendMsgBoxName = `${isPressed(4)} chat__sendMsg`

	const userListBoxName = `chat__userList ${userListShowed === false ? 'chat__userList--hidden' : ''}`
	const usrLinkBoxName = (id: number) => `${isPressed(5 + id)} chat__user__link`
	const usrWispBoxName = (id: number) => `${isPressed(-5 - id)} chat__user__wisp`

	const chatGateBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(1),
			onMouseUp: () => { setBoxPressed(0); switchCtat() },
			content: '[CHAT]'
		})
	)
	const roomzBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			content: roomBox.map((box) => <DragDrop
				key={box.id}
				itemId={box.id}
				content={box.content}
				moveItem={moveBox}
				className={roomBoxName(box.id)}
			/>)
		})
	)
	const newRoomz = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(3),
			onMouseUp: () => { setBoxPressed(0); switchRoomSettings(1) },
			content: roomSettingsOpen === 0 ? (
				<>[+]</>
			) : (
				<>[-]</>
			)
		})
	)
	const chatAreaBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			content: showChatArea()
		})
	)
	const sendMsgBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(4),
			onMouseUp: () => setBoxPressed(0),
			content: '[OK]'
		})
	)
	const chatUsrLabelBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			content: 'Connected'
		})
	)
	const usrLinkBox = (name: string, id: number) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(5 + id),
			onMouseUp: () => setBoxPressed(0),
			content: `[#${id}]`
		})
	)
	const usrWispBox = (name: string, id: number) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(-5 - id),
			onMouseUp: () => setBoxPressed(0),
			content: '[/w]'
		})
	)
	const chatUsrBox = (name: string, id: number) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseEnter: () => setShowWispButton(id),
			onMouseLeave: () => setShowWispButton(0),
			content: <>{usrLinkBox(usrLinkBoxName(id), id)}{showWispButton === id && usrWispBox(usrWispBoxName(id), id)}</>
		})
	)

	// Modifieurs
	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(handleChatResize)
		if (chatRef.current)
			chatSizeObserver.observe(chatRef.current)

		const box1: RoomBoxType = {
			id: 1, content: <>
				<div className='chat__roomLink'
					onMouseDown={() => console.log(`chat__roomLink #1 pressed`)}
					onMouseUp={() => setChatArea(1)}>
					[ #1 ]
				</div>
				<div className='chat__setRoom'
					onMouseDown={() => console.log(`chat__setRoom #1 pressed`)}
					onMouseUp={() => switchRoomSettings(1 + 1)}>
					[*]
				</div>
			</>
		}
		const box2: RoomBoxType = {
			id: 2, content: <>
				<div className='chat__roomLink'
					onMouseDown={() => console.log(`chat__roomLink #2 pressed`)}
					onMouseUp={() => setChatArea(2)}>
					[ #2 ]
				</div>
				<div className='chat__setRoom'
					onMouseDown={() => console.log(`chat__setRoom #2 pressed`)}
					onMouseUp={() => switchRoomSettings(2 + 1)}>
					[*]
				</div>
			</>
		}
		updateRoomz(0, box1)
		updateRoomz(1, box2)

		return () => {
			if (chatRef.current)
				chatSizeObserver.unobserve(chatRef.current)
		}
	}, [])

	useEffect(() => {
		handleChatResize()
	}, [roomSettingsOpen])

	useEffect(() => {
		if (chatWidth >= 450) {
			if (userListShowed === false)
				setUserListShowed(true)
		}
		else if (chatWidth < 450 && userListShowed === true)
			setUserListShowed(false)
	}, [chatWidth])

	const moveBox = useCallback((draggedId: number, droppedId: number) => {
		const draggedIndex = roomBox.findIndex((item) => item.id === draggedId)
		const droppedIndex = roomBox.findIndex((item) => item.id === droppedId)

		const newItems = [...roomBox]
		newItems.splice(draggedIndex, 1)
		newItems.splice(droppedIndex, 0, roomBox[draggedIndex])

		setRoomBox(newItems)
	}, [roomBox])

	const updateRoomz = function (index: number, tab: RoomBoxType) {
		setRoomBox((prevRoomBox) => {
			const newRoomz = [...prevRoomBox]

			if (newRoomz.length === index)
				newRoomz.splice(index, 0, tab)
			else if (newRoomz.length < index && index >= 0)
				newRoomz.splice(index, 1)
			else {
				console.log('updateRoomz() bad index')
				return prevRoomBox
			}

			return newRoomz
		})
	}

	const switchCtat = function () {
		setChatOpenned(chatOpenned === true ? false : true)
		if (roomSettingsOpen !== 0)
			setRoomSettingsOpen(0)
		if (chatRef.current) {
			const element = chatRef.current
			element.setAttribute('style', `width: 275px`)
		}
	}

	const switchRoomSettings = function (id: number) {
		console.log(`from ${roomSettingsOpen}...`)
		if (id === roomSettingsOpen || (id === 1 && roomSettingsOpen !== 0))
			id = 0
		setRoomSettingsOpen(id)
		console.log(`...to ${roomSettingsOpen}`)
	}

	const handleChatResize = function () {
		if (chatRef.current) {
			const chatForm = chatRef.current.getBoundingClientRect()
			setRoomSettingsPos({ left: `${chatForm.right}px` })
			setChatWidth(chatForm.width)
		}
	}

	const showChatArea = function () {
		return <>Content of chat #{chatArea}</>
	}

	// Retour
	return <div className='chat--resize'>
		<div className={chatBoxName} ref={chatRef}>
			<div className={chatContentBoxName}>
				{roomzBox(roomzBoxName)}
				{newRoomz(newRoomBoxName)}

				{chatAreaBox(chatAreaBoxName)}
				<div className={userListBoxName}>
					{chatUsrLabelBox('chat__userList__label')}
					{chatUsrBox('chat__user', 1)}
					{chatUsrBox('chat__user', 2)}
				</div>

				<input id='chat__input' name='chat__input' placeholder=' ...' />
				{sendMsgBox(sendMsgBoxName)}
			</div>

			{chatGateBox(chatGateBoxName)}
		</div>
		<div className={roomSettingsBoxName} style={roomSettingsPos}>
			Settings of {roomSettingsOpen - 1}
		</div>
	</div>
}
export default Chat