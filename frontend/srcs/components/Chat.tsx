import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { DragDrop, NewBox } from './utils.tsx'

// -----------------------------------USERS-----------------------------------------//
type RoomUsersProps = {
	userCount: number
}
const RoomUsersComp: React.FC<RoomUsersProps> = ({ userCount }) => {
	// -------------------------------VALUES----------------------------------------//
	const [boxPressed, setBoxPressed] = useState(0)
	const [showWispBox, setShowWispBox] = useState(0)

	const isPressed = (id: number) => (boxPressed === id ? ' chat__button--pressed' : '')
	const linkBoxName = (id: number) => `chat__user__link${isPressed(id)}`
	const wispBoxName = (id: number) => `chat__user__wisp${isPressed(-id)}`
	/*const newRoomBox = useMemo(() => {
		return (
			<NewBox
			tag='div'
			className={`chat__area${userListShowed === true ? ' chat__area--shorten' : ''}`}
			content={updateChatArea()}
			/>
		);
	}, [chatArea, userListShowed]);*/
	const labelBox = (name: string) => <NewBox
		tag='div'
		className={name}
		content='Connected'
	/>
	const usrBox = (name: string, id: number) => <NewBox
		tag='div'
		className={name}
		onMouseEnter={() => setShowWispBox(id)}
		onMouseLeave={() => setShowWispBox(0)}
		content={<>
			{usrLinkBox(linkBoxName(id), id)}
			{showWispBox === id && userWispBox(wispBoxName(id), id)}
		</>}
	/>
	const usrLinkBox = (name: string, id: number) => <NewBox
		tag='div'
		className={name}
		onMouseDown={() => setBoxPressed(id)}
		onMouseUp={() => setBoxPressed(0)}
		content={`[#${id}]`}
	/>
	const userWispBox = (name: string, id: number) => <NewBox
		tag='div'
		className={name}
		onMouseDown={() => setBoxPressed(-id)}
		onMouseUp={() => setBoxPressed(0)}
		content='[/w]'
	/>

	// -------------------------------MODIFIERS-------------------------------------//
	const renderBoxes = () => Array.from({ length: userCount }, (_, index) => (
		usrBox('chat__user', index + 1)
	))

	// -------------------------------RETOUR---------------------------------------//
	return <div className={'chat__userList'}>
		{labelBox('chat__userList__label')}
		{renderBoxes()}
	</div>
}
const RoomUsers = React.memo(RoomUsersComp)

// -----------------------------------TEXT-AREA-------------------------------------//
type TextAreaProps = {
	chatArea: number
	userListShowed: boolean
}
const TextAreaComp: React.FC<TextAreaProps> = ({ chatArea, userListShowed }) => {
	// -------------------------------VALUES----------------------------------------//
	const newRoomBox = useMemo(() => {
		return (
			<NewBox
				tag='div'
				className={`chat__area${userListShowed === true ? ' chat__area--shorten' : ''}`}
				content={updateChatArea()}
			/>
		);
	}, [chatArea, userListShowed]);

	// -------------------------------MODIFIERS-------------------------------------//
	const updateChatArea = () => <>Content of chat #{chatArea}</>

	// -------------------------------RETOUR---------------------------------------//
	return newRoomBox
}
const TextArea = React.memo(TextAreaComp)


// -----------------------------------ROOM-BOXES------------------------------------//
type RoomBoxesProps = {
	setChatArea: (id: number) => void
	switchRoomSettings: (id: number) => void
}
const RoomBoxesComp: React.FC<RoomBoxesProps> = ({ setChatArea, switchRoomSettings }) => {
	// -------------------------------VALUES----------------------------------------//
	const [boxPressed, setBoxPressed] = useState(0)
	const [showSettings, setShowSettings] = useState(0)

	type RoomBoxType = {
		id: number
		pressed: boolean
		over: boolean
		content: React.ReactNode
	}
	const [roomz, setRoomBoxes] = useState<RoomBoxType[]>([])

	const isPressed = (id: number) => (boxPressed === id ? ' chat__button--pressed' : '')
	const roomSetName = (id: number) => `chat__setRoom${isPressed(id)}`
	const roomLinkName = (id: number) => `chat__roomLink${isPressed(id)}`
	const roomBoxName = (id: number) => `chat__room__${id}`

	const roomBoxSample = (nbr: number, pressed: boolean, over: boolean): RoomBoxType => ({
		id: nbr,
		pressed: pressed,
		over: over,
		content: roomBoxContentSample(nbr)
	})
	const roomBoxContentSample = (nbr: number) => <>
		<div className={roomLinkName(nbr)}
			onMouseDown={() => setBoxPressed(nbr)}
			onMouseUp={() => { setBoxPressed(0); setChatArea(nbr) }}>
			[#{nbr}]
		</div >
		{showSettings === nbr && <div className={roomSetName(-nbr)}
			onMouseDown={() => setBoxPressed(-nbr)}
			onMouseUp={() => { setBoxPressed(0); switchRoomSettings(nbr + 1) }}>
			[*]
		</div>}
	</>

	// -------------------------------MODIFIERS-------------------------------------//
	useEffect(() => {
		updateRoomBoxes(0, 1, roomBoxSample(1, false, false));
		updateRoomBoxes(1, 1, roomBoxSample(2, false, false));
		updateRoomBoxes(2, 1, roomBoxSample(3, false, false));
	}, []);

	useEffect(() => setRoomBoxes((prevRoomBoxes) => prevRoomBoxes.map((room) => {
		const isOver = showSettings === room.id
		const isPressed = Math.abs(boxPressed) === room.id

		if (room.over !== isOver || room.pressed !== isPressed)
			return {
				...room,
				over: isOver,
				pressed: isPressed,
				content: roomBoxContentSample(room.id)
			}
		return room
	})), [showSettings, boxPressed])

	const updateRoomBoxes = (index: number, rm: number, tab: RoomBoxType | undefined) => {
		setRoomBoxes((prevRoomBox) => {
			const newRoomBoxes = [...prevRoomBox]

			if (index < 0 || index > newRoomBoxes.length)
				return prevRoomBox
			if (tab)
				newRoomBoxes.splice(index, rm, tab)
			else
				newRoomBoxes.splice(index, rm)
			return newRoomBoxes
		})
	}

	const moveBox = useCallback((draggedId: number, droppedId: number) => {
		const dragged = roomz.findIndex((item) => item.id === draggedId)
		const dropped = roomz.findIndex((item) => item.id === droppedId)

		const newItems = [...roomz]
		newItems.splice(dragged, 1)
		newItems.splice(dropped, 0, roomz[dragged])

		setRoomBoxes(newItems)
	}, [roomz])

	// -------------------------------RETOUR---------------------------------------//
	return <NewBox
		tag='div'
		className='chat__rooms'
		content={roomz.map((box) => <DragDrop
			key={box.id}
			itemId={box.id}
			content={box.content}
			moveItem={moveBox}
			className={roomBoxName(box.id)}
			onMouseEnter={() => setShowSettings(box.id)}
			onMouseLeave={() => setShowSettings(0)}
			onDrag={() => { setShowSettings(0); setBoxPressed(0) }}
		/>)}
	/>
}
const RoomBoxes = React.memo(RoomBoxesComp)


// -----------------------------------ROOM-SETTINGS---------------------------------//
type RoomSettingsPos = {
	left: string;
}
type RoomSettingsProps = {
	roomSettingsOpen: number
	roomSettingsPos: RoomSettingsPos
}
const RoomSettingsComp: React.FC<RoomSettingsProps> = ({ roomSettingsOpen, roomSettingsPos }) => {
	// -------------------------------RETOUR---------------------------------------//
	if (roomSettingsOpen !== 0)
		return <div className='chat__roomSettings'
			style={roomSettingsPos}>
			Settings of {roomSettingsOpen - 1}
		</div>
	return <></>
}
const RoomSettings = React.memo(RoomSettingsComp)


// -----------------------------------CHAT-CONTENT----------------------------------//
type MainContentProps = {
	userListShowed: boolean
	roomSettingsOpen: number
	setRoomSettingsOpen: (id: number) => void
}
const MainContentComp: React.FC<MainContentProps> = ({ userListShowed, roomSettingsOpen, setRoomSettingsOpen }) => {
	// -------------------------------VALUES----------------------------------------//
	const [boxPressed, setBoxPressed] = useState(0)
	const [chatArea, setChatArea] = useState(0)
	const [userCount, setuserCount] = useState(0)

	const isPressed = useCallback((id: number) => {
		return boxPressed === id ? ' chat__button--pressed' : '';
	}, [boxPressed]);

	const newRoomBoxName = `chat__newRoom${isPressed(1)}`
	const sendMsgBoxName = `chat__sendMsg${isPressed(2)}`

	const newRoomBox = (name: string) => <NewBox
		tag='div'
		className={name}
		onMouseDown={() => setBoxPressed(1)}
		onMouseUp={() => { setBoxPressed(0); switchRoomSettings(1) }}
		content={roomSettingsOpen === 0 ? (<>[+]</>) : (<>[-]</>)}
	/>
	const sendMsgBox = (name: string) => <NewBox
		tag='div'
		className={name}
		onMouseDown={() => setBoxPressed(2)}
		onMouseUp={() => setBoxPressed(0)}
		content='[OK]'
	/>

	// -------------------------------MODIFIERS-------------------------------------//
	useEffect(() => {
		setChatArea(1)
		setuserCount(12)
	}, [])

	const switchRoomSettings = (id: number) => {
		if (id === roomSettingsOpen || (id === 1 && roomSettingsOpen !== 0))
			id = 0
		setRoomSettingsOpen(id)
	}

	// -------------------------------RETOUR---------------------------------------//
	return <div className='chat__content'>
		<RoomBoxes
			setChatArea={setChatArea}
			switchRoomSettings={switchRoomSettings}
		/>
		{newRoomBox(newRoomBoxName)}

		<TextArea
			chatArea={chatArea}
			userListShowed={userListShowed}
		/>
		{userListShowed === true && <RoomUsers
			userCount={userCount}
		/>}

		<input id='chat__input' name='chat__input' placeholder=' ...' />
		{sendMsgBox(sendMsgBoxName)}
	</div>
}
const MainContent = React.memo(MainContentComp)


// -----------------------------------MAIN------------------------------------------//
function Chat() {
	// -------------------------------VALUES----------------------------------------//
	const chatRef = useRef<HTMLDivElement | null>(null)

	const [boxPressed, setBoxPressed] = useState(0)
	const [chatOpenned, setChatOpenned] = useState(false)

	const [chatWidth, setChatWidth] = useState(0)
	const [userListShowed, setUserListShowed] = useState(false)

	const [roomSettingsOpen, setRoomSettingsOpen] = useState(0)
	const [roomSettingsPos, setRoomSettingsPos] = useState({ left: '100%' })

	const isPressed = (id: number) => (boxPressed === id ? ' chat__button--pressed' : '')
	const mainButtonName = `chat__gate${isPressed(1)}${chatOpenned === true ? ' chat__gate--expended' : ''}`

	const mainButton = (name: string) => <NewBox
		tag='div'
		className={name}
		onMouseDown={() => setBoxPressed(1)}
		onMouseUp={() => { setBoxPressed(0); switchCtat() }}
		content='[CHAT]'
	/>

	// -------------------------------MODIFIERS-------------------------------------//
	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(handleChatResize)
		if (chatRef.current)
			chatSizeObserver.observe(chatRef.current)

		return () => { chatRef.current && chatSizeObserver.unobserve(chatRef.current) }
	}, [])

	useEffect(() => {
		if (chatWidth >= 450) {
			if (userListShowed === false)
				setUserListShowed(true)
		}
		else if (chatWidth < 450 && userListShowed === true)
			setUserListShowed(false)
		if (roomSettingsOpen !== 0)
			handleRoomSettingsPos()
	}, [chatWidth])

	useEffect(() => {
		if (roomSettingsOpen !== 0)
			handleRoomSettingsPos()
	}, [roomSettingsOpen])

	const handleRoomSettingsPos = () => {
		if (chatRef.current) {
			const chatForm = chatRef.current.getBoundingClientRect()
			setRoomSettingsPos({ left: `${chatForm.right}px` })
		}
	}

	const handleChatResize = () => {
		if (chatRef.current) {
			const chatForm = chatRef.current.getBoundingClientRect()
			if (chatForm.width !== chatWidth)
				setChatWidth(chatForm.width)
		}
	}

	const switchCtat = () => {
		setChatOpenned(chatOpenned === true ? false : true)
		if (roomSettingsOpen !== 0)
			setRoomSettingsOpen(0)
		else
			handleRoomSettingsPos()
		if (chatRef.current) {
			const element = chatRef.current
			element.setAttribute('style', `width: 275px`)
		}
	}

	// -------------------------------RETOUR---------------------------------------//
	console.log('---RENDERING CHAT--- ' + chatOpenned)
	return <div className='chat--resize'>
		<div className={`chat${chatOpenned === false ? ' chat--noResize' : ''}`}
			ref={chatRef}>
			{chatOpenned === true && <MainContent
				userListShowed={userListShowed}
				roomSettingsOpen={roomSettingsOpen}
				setRoomSettingsOpen={setRoomSettingsOpen}
			/>}
			{mainButton(mainButtonName)}
		</div>
		<RoomSettings
			roomSettingsOpen={roomSettingsOpen}
			roomSettingsPos={roomSettingsPos}
		/>
	</div>
}
export default Chat