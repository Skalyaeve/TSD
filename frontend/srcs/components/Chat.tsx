import React, { useEffect, useRef, useState, useCallback } from 'react'
import { DragDrop, newBox } from './utils.tsx'

function Chat() {
	// ------------------------------------VALUES-------------------------------------//
	// States -- Buttons
	const [boxPressed, setBoxPressed] = useState(0)
	const [roomBoxPressed, setRoomBoxPressed] = useState(0)

	// States -- Chat (main)
	const [chatOpenned, setChatOpenned] = useState(false)
	const [chatWidth, setChatWidth] = useState(0)
	const [chatArea, setChatArea] = useState(1)

	// States -- Rooms
	type RoomBoxType = {
		id: number
		pressed: boolean
		over: boolean
		content: React.ReactNode
	}
	const [roomz, setRoomz] = useState<RoomBoxType[]>([])
	const [overRoom, setOverRoom] = useState(0)
	const [roomSettingsOpen, setRoomSettingsOpen] = useState(0)
	const [roomSettingsPos, setRoomSettingsPos] = useState({ left: '100%' })

	// States -- Connected users
	const [userListShowed, setUserListShowed] = useState(false)
	const [showWispButton, setShowWispButton] = useState(0)

	// Ref
	const chatRef = useRef<HTMLDivElement | null>(null)

	// ClassNames -- Button ID's
	const isPressed = (id: number) => (boxPressed === id ? ' chat__button--pressed' : '')
	const isRoomBoxPressed = (id: number) => (roomBoxPressed === id ? ' chat__button--pressed' : '')

	// ClassNames -- Chat (main)
	const chatMainName = 'chat--resize'
	const chatBoxName = `chat${chatOpenned === false ? ' chat--noResize' : ''}`
	const chatGateBoxName = `chat__gate${isPressed(1)}${chatOpenned === true ? ' chat__gate--expended' : ''}`
	const chatContentBoxName = 'chat__content'

	// ClassNames -- Rooms
	const roomzBoxName = 'chat__rooms'
	const roomBoxName = (id: number) => `chat__room_${id}`
	const roomLinkName = (id: number) => `chat__roomLink${isRoomBoxPressed(id)}`
	const roomSetName = (id: number) => `chat__setRoom${isRoomBoxPressed(id)}`
	const newRoomBoxName = `chat__newRoom${isPressed(2)}`
	const roomSettingsBoxName = 'chat__roomSettings'

	// ClassNames -- Text Area
	const chatAreaBoxName = `chat__area${userListShowed === true ? ' chat__area--shorten' : ''}`
	const sendMsgBoxName = `chat__sendMsg${isPressed(3)}`

	// ClassNames -- Connected users
	const userListBoxName = 'chat__userList'
	const userLabelBoxName = 'chat__userList__label'
	const usrBoxName = 'chat__user'
	const usrLinkBoxName = (id: number) => `chat__user__link${isPressed(4 + id)}`
	const usrWispBoxName = (id: number) => `chat__user__wisp${isPressed(-4 - id)}`

	// Boxes -- Main button
	const chatGateBox = (name: string) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(1),
			onMouseUp: () => { setBoxPressed(0); switchCtat() },
			content: '[CHAT]'
		})
	}

	// Boxes -- Rooms
	const roomBoxSample = (nbr: number, pressed: boolean, over: boolean): RoomBoxType => {
		console.log(`roomBoxSample() - rendering new roombox`)
		return {
			id: nbr,
			pressed: pressed,
			over: over,
			content: <>
				<div className={roomLinkName(nbr)}
					onMouseDown={() => setRoomBoxPressed(nbr)}
					onMouseUp={() => { setRoomBoxPressed(0); setChatArea(nbr) }}>
					[#{nbr}]
				</div >
				{overRoom === nbr && <div className={roomSetName(-nbr)}
					onMouseDown={() => setRoomBoxPressed(-nbr)}
					onMouseUp={() => { setRoomBoxPressed(0); switchRoomSettings(nbr + 1) }}>
					[*]
				</div>}
			</>
		}
	}
	const roomzBox = (name: string) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			content: roomz.map((box) => <DragDrop
				key={box.id}
				itemId={box.id}
				content={box.content}
				moveItem={moveBox}
				className={roomBoxName(box.id)}
				onMouseEnter={() => setOverRoom(box.id)}
				onMouseLeave={() => setOverRoom(0)}
				onDrag={() => { setOverRoom(0), setRoomBoxPressed(0) }}
			/>)
		})
	}
	const newRoomBox = (name: string) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(2),
			onMouseUp: () => { setBoxPressed(0); switchRoomSettings(1) },
			content: roomSettingsOpen === 0 ? (
				<>[+]</>
			) : (
				<>[-]</>
			)
		})
	}

	// Boxes -- Text area
	const chatAreaBox = (name: string) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			content: updateChatArea()
		})
	}
	const sendMsgBox = (name: string) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(3),
			onMouseUp: () => setBoxPressed(0),
			content: '[OK]'
		})
	}

	// Boxes -- Connected users
	const chatUsrLabelBox = (name: string) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			content: 'Connected'
		})
	}
	const chatUsrBox = (name: string, id: number) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			onMouseEnter: () => setShowWispButton(id),
			onMouseLeave: () => setShowWispButton(0),
			content: <>
				{usrLinkBox(usrLinkBoxName(id), id)}
				{showWispButton === id && usrWispBox(usrWispBoxName(id), id)}
			</>
		})
	}
	const usrLinkBox = (name: string, id: number) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(4 + id),
			onMouseUp: () => setBoxPressed(0),
			content: `[#${id}]`
		})
	}
	const usrWispBox = (name: string, id: number) => {
		console.log(name); return newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(-4 - id),
			onMouseUp: () => setBoxPressed(0),
			content: '[/w]'
		})
	}

	// -----------------------------------MODIFIERS-----------------------------------//
	// Main
	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(handleChatResize)
		if (chatRef.current)
			chatSizeObserver.observe(chatRef.current)

		updateRoomz(0, 0, roomBoxSample(1, false, false))
		updateRoomz(1, 0, roomBoxSample(2, false, false))
		updateRoomz(2, 0, roomBoxSample(3, false, false))

		return () => {
			if (chatRef.current)
				chatSizeObserver.unobserve(chatRef.current)
		}
	}, [])

	const switchCtat = function () {
		setChatOpenned(chatOpenned === true ? false : true)
		if (roomSettingsOpen !== 0)
			setRoomSettingsOpen(0)
		if (chatRef.current) {
			const element = chatRef.current
			element.setAttribute('style', `width: 275px`)
		}
	}
	const updateChatArea = function () {
		return <>Content of chat #{chatArea}</>
	}

	// Rooms
	useEffect(() => {
		console.log(`useEffect()[overRoom:${overRoom}]`)
		const roomToUpdate = roomz.find((room) => room.over === true)
		if (roomToUpdate)
			updateRoomz(roomToUpdate.id - 1, 1, roomBoxSample(roomToUpdate.id, roomToUpdate.pressed, false))
		if (overRoom)
			updateRoomz(overRoom - 1, 1, roomBoxSample(overRoom, roomz[overRoom - 1].pressed, true))
	}, [overRoom])
	useEffect(() => {
		const roomToUpdate = roomz.find((room) => room.pressed === true)
		if (roomToUpdate)
			updateRoomz(roomToUpdate.id - 1, 1, roomBoxSample(roomToUpdate.id, false, roomToUpdate.over))
		if (roomBoxPressed) {
			const id = Math.abs(roomBoxPressed)
			updateRoomz(id - 1, 1, roomBoxSample(id, true, roomz[id - 1].over))
		}
	}, [roomBoxPressed])

	const updateRoomz = function (index: number, rm: number, tab: RoomBoxType | undefined) {
		setRoomz((prevRoomBox) => {
			const newRoomz = [...prevRoomBox]

			if (index < 0 || index > newRoomz.length)
				return prevRoomBox
			if (tab)
				newRoomz.splice(index, rm, tab)
			else
				newRoomz.splice(index, rm)
			return newRoomz
		})
	}
	const switchRoomSettings = function (id: number) {
		if (id === roomSettingsOpen || (id === 1 && roomSettingsOpen !== 0))
			id = 0
		setRoomSettingsOpen(id)
	}

	// Rooms (Drag & Drop)
	const moveBox = useCallback((draggedId: number, droppedId: number) => {
		const dragged = roomz.findIndex((item) => item.id === draggedId)
		const dropped = roomz.findIndex((item) => item.id === droppedId)

		const newItems = [...roomz]
		newItems.splice(dragged, 1)
		newItems.splice(dropped, 0, roomz[dragged])

		setRoomz(newItems)
	}, [roomz])

	// Chat size
	useEffect(() => {
		handleChatResize()
	}, [roomSettingsOpen])

	const handleChatResize = function () {
		if (chatRef.current) {
			const chatForm = chatRef.current.getBoundingClientRect()
			if (roomSettingsOpen !== 0)
				setRoomSettingsPos({ left: `${chatForm.right}px` })
			if (chatForm.width !== chatWidth)
				setChatWidth(chatForm.width)
		}
	}

	// Connected users
	useEffect(() => {
		if (chatWidth >= 450) {
			if (userListShowed === false)
				setUserListShowed(true)
		}
		else if (chatWidth < 450 && userListShowed === true)
			setUserListShowed(false)
	}, [chatWidth])

	// ------------------------------------RETOUR-------------------------------------//
	console.log('')
	console.log('---RENDERING CHAT---')
	return <div className={chatMainName}>
		<div className={chatBoxName} ref={chatRef}>
			{chatOpenned === true && <div className={chatContentBoxName}>
				{roomzBox(roomzBoxName)}
				{newRoomBox(newRoomBoxName)}

				{chatAreaBox(chatAreaBoxName)}
				{userListShowed === true && <div className={userListBoxName}>
					{chatUsrLabelBox(userLabelBoxName)}
					{chatUsrBox(usrBoxName, 1)}
					{chatUsrBox(usrBoxName, 2)}
					{chatUsrBox(usrBoxName, 3)}
					{chatUsrBox(usrBoxName, 4)}
					{chatUsrBox(usrBoxName, 5)}
					{chatUsrBox(usrBoxName, 6)}
					{chatUsrBox(usrBoxName, 7)}
					{chatUsrBox(usrBoxName, 8)}
					{chatUsrBox(usrBoxName, 9)}
					{chatUsrBox(usrBoxName, 10)}
					{chatUsrBox(usrBoxName, 11)}
					{chatUsrBox(usrBoxName, 12)}
				</div>}

				<input id='chat__input' name='chat__input' placeholder=' ...' />
				{sendMsgBox(sendMsgBoxName)}
			</div>}

			{chatGateBox(chatGateBoxName)}
		</div>
		{roomSettingsOpen !== 0 && <div className={roomSettingsBoxName} style={roomSettingsPos}>
			Settings of {roomSettingsOpen - 1}
		</div>}
	</div>
}
export default Chat