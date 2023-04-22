import React, { memo, useState, useEffect, useLayoutEffect, useCallback, useRef, useMemo } from 'react'
import { NewBox, DragDrop } from './utils.tsx'

// --------ROOM-SETTINGS--------------------------------------------------- //
interface RoomSettingsPos {
	left: string
}
interface RoomSettingsProps {
	settingsOpen: number
	settingsPos: RoomSettingsPos
}
const RoomSettings: React.FC<RoomSettingsProps> = memo(({
	settingsOpen, settingsPos
}) => {
	// ----STATES----------------------------- //
	const [addedCount, setAddedCount] = useState(10)
	const [toAddCount, setToAddCount] = useState(7)

	// ----RENDER----------------------------- //
	const commitArea = useMemo(() => {
		if (settingsOpen === 1)
			return <NewBox
				tag='btn'
				className='chat-roomSet-create-saveBtn chat-roomSet-saveBtn'
				nameIfPressed='chat-btn--pressed'
				content='[CREATE]'
			/>
		else return <>
			<NewBox
				tag='btn'
				className='chat-roomSet-update-saveBtn chat-roomSet-saveBtn'
				nameIfPressed='chat-btn--pressed'
				content='[SAVE]'
			/>
			<NewBox
				tag='btn'
				className='chat-roomSet-del-saveBtn chat-roomSet-saveBtn'
				nameIfPressed='chat-btn--pressed'
				content='[DELETE]'
			/>
		</>
	}, [settingsOpen])

	const renderUserList = useMemo(() => (count: number, addedUsers: boolean) => (
		Array.from({ length: count }, (_, index) => (
			<RoomMembersSet
				key={index + 1}
				id={index + 1}
				className='chat-roomSet-usr'
				addedUsers={addedUsers}
			/>
		))
	), [])

	return <div className='chat-roomSet'
		style={settingsPos}>
		<input
			className='chat-roomSet-name-input chat-roomSet-main-input'
			id='chat-roomSet-name-input'
			name='chat-roomSet-name-input'
			placeholder='Name'
		/>
		<input
			className='chat-roomSet-psw-input chat-roomSet-main-input'
			id='chat-roomSet-psw-input'
			name='chat-roomSet-psw-input'
			placeholder='Password'
		/>
		<div className='chat-roomSet-users-added chat-roomSet-users'>
			<input
				className='chat-roomSet-users-input'
				id={'chat-roomSet-users-added-input'}
				name={'chat-roomSet-users-added-input'}
				placeholder=' Added users...'
			/>
			{renderUserList(addedCount, true)}
		</div>
		<div className='chat-roomSet-users-toAdd chat-roomSet-users'>
			<input
				className='chat-roomSet-users-input'
				id={'chat-roomSet-users-toAdd-input'}
				name={'chat-roomSet-users-toAdd-input'}
				placeholder=' Friends...'
			/>
			{renderUserList(toAddCount, false)}
		</div>
		{commitArea}
	</div>
})
// --------ROOM-MEMBERS-SET------------------------------------------------ //
interface RoomMembersSetProps {
	id: number
	className: string
	addedUsers: boolean
}
const RoomMembersSet: React.FC<RoomMembersSetProps> = memo(({
	id, className, addedUsers
}) => {
	// ----STATES----------------------------- //
	const [showButton, setShowButton] = useState(false)

	// ----HANDLERS--------------------------- //
	const enterUser = useCallback(() => setShowButton(true), [])
	const leaveUser = useCallback(() => setShowButton(false), [])

	// ----RENDER----------------------------- //
	const btnToAdd = useMemo(() => {
		if (!addedUsers)
			return <NewBox
				tag='btn'
				className={`${className}-blocBtn`}
				nameIfPressed='chat-btn--pressed'
				content='[/x]'
			/>
		else return <>
			<NewBox
				tag='btn'
				className={`${className}-promoteBtn`}
				nameIfPressed='chat-btn--pressed'
				content='[up]'
			/>
			<NewBox
				tag='btn'
				className={`${className}-muteBtn`}
				nameIfPressed='chat-btn--pressed'
				content='[/m]'
			/>
			<NewBox
				tag='btn'
				className={`${className}-blocBtn`}
				nameIfPressed='chat-btn--pressed'
				content='[/x]'
			/>
		</>
	}, [])

	return <div className='chat-roomSet-usr'
		onMouseEnter={enterUser}
		onMouseLeave={leaveUser}>
		<NewBox
			tag='btn'
			className='chat-roomSet-usr-name'
			nameIfPressed='chat-btn--pressed'
			content={`#${id}`}
		/>
		{showButton && <div className='chat-roomSet-usr-btns'>
			{btnToAdd}
		</div>}
	</div>
})

// --------ROOM-BOXES------------------------------------------------------ //
interface RoomBoxesProps {
	settingsOpen: number
	setSettingsOpen: React.Dispatch<React.SetStateAction<number>>
	setChatArea: React.Dispatch<React.SetStateAction<number>>
}
const RoomBoxes: React.FC<RoomBoxesProps> = memo(({
	settingsOpen, setSettingsOpen, setChatArea
}) => {
	// ----TYPES------------------------------ //
	interface RoomBoxType {
		id: number
		content?: React.ReactNode
	}

	// ----STATES----------------------------- //
	const [roomz, setRoomz] = useState<RoomBoxType[]>([])
	const [isDragging, setIsDragging] = useState(false)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		updateRoomBoxes(0, 1, { id: 1 })
		updateRoomBoxes(1, 1, { id: 2 })
		updateRoomBoxes(2, 1, { id: 3 })
	}, [])

	// ----HANDLERS--------------------------- //
	const updateRoomBoxes = (index: number, rm: number, tab: RoomBoxType) => {
		setRoomz((prevRoomBox) => {
			const newRoomBoxes = [...prevRoomBox]
			if (index < 0 || index > newRoomBoxes.length) return prevRoomBox

			if (tab) newRoomBoxes.splice(index, rm, tab)
			else newRoomBoxes.splice(index, rm)

			return newRoomBoxes
		})
	}

	const moveItem = useCallback((draggedId: number, droppedId: number) => {
		const dragged = roomz.findIndex((item) => item.id === draggedId)
		const dropped = roomz.findIndex((item) => item.id === droppedId)

		const newItems = [...roomz]
		newItems.splice(dragged, 1)
		newItems.splice(dropped, 0, roomz[dragged])

		setRoomz(newItems)
	}, [roomz])

	const newRoomUp = useCallback(() => {
		settingsOpen === 0 ? setSettingsOpen(1) : setSettingsOpen(0)
	}, [settingsOpen])

	const newRoomBtnHdl = useMemo(() => ({
		onMouseUp: newRoomUp
	}), [newRoomUp])

	// ----RENDER----------------------------- //
	const newRoomBox = (box: RoomBoxType) => <RoomBox
		key={box.id}
		id={box.id}
		settingsOpen={settingsOpen}
		setSettingsOpen={setSettingsOpen}
		setChatArea={setChatArea}
		moveItem={moveItem}
		isDragging={isDragging}
		setIsDragging={setIsDragging}
	/>

	const roomContent = useMemo(() => (
		roomz.map(box => newRoomBox(box))
	), [roomz, settingsOpen, isDragging])

	const newRoomContent = useMemo(() => (
		settingsOpen === 0 ? '[+]' : '[-]'
	), [settingsOpen])

	return <>
		<NewBox
			tag='btn'
			className='chat-newRoomBtn'
			nameIfPressed='chat-btn--pressed'
			handlers={newRoomBtnHdl}
			content={newRoomContent}
		/>
		<div className='chat-rooms'>
			{roomContent}
		</div>
	</>
})
// --------ROOM-BOX-------------------------------------------------------- //
interface RoomBoxProps {
	id: number
	isDragging: boolean
	setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
	settingsOpen: number
	setSettingsOpen: React.Dispatch<React.SetStateAction<number>>
	setChatArea: React.Dispatch<React.SetStateAction<number>>
	moveItem: (draggedId: number, droppedId: number) => void
}
const RoomBox: React.FC<RoomBoxProps> = memo(({
	id, isDragging, setIsDragging, settingsOpen,
	setSettingsOpen, setChatArea, moveItem
}) => {
	// ----STATES----------------------------- //
	const [showRoomSet, setShowRoomSet] = useState(false)

	// ----HANDLERS--------------------------- //
	const showIt = useCallback(() => {
		if (!isDragging) setShowRoomSet(true)
	}, [isDragging])

	const hideIt = useCallback(() => setShowRoomSet(false), [])

	const dragStart = useCallback(() => {
		setIsDragging(true)
		hideIt()
	}, [])

	const dragEnd = useCallback(() => {
		setIsDragging(false)
		hideIt()
	}, [])

	const handleSetChatArea = useCallback(() => setChatArea(id), [id])

	const roomSetUp = useCallback(() => {
		if (settingsOpen != id + 1) {
			setSettingsOpen(id + 1)
			settingsOpen = id + 1
		} else {
			setSettingsOpen(0)
			settingsOpen = 0
		}
	}, [settingsOpen, id])

	const linkBtnHdl = useMemo(() => ({
		onMouseUp: handleSetChatArea
	}), [])

	const setBtnHdl = useMemo(() => ({
		onMouseUp: roomSetUp
	}), [roomSetUp])

	// ----RENDER----------------------------- //
	return <DragDrop
		itemId={id}
		className='chat-room'
		moveItem={moveItem}
		onMouseEnter={showIt}
		onMouseLeave={hideIt}
		onDragStart={dragStart}
		onDragEnd={dragEnd}
		content={<>
			<NewBox
				tag='btn'
				className='chat-roomLinkBtn'
				nameIfPressed='chat-btn--pressed'
				handlers={linkBtnHdl}
				content={`[#${id}]`}
			/>
			{showRoomSet && <NewBox
				tag='btn'
				className='chat-setRoomBtn'
				nameIfPressed='chat-btn--pressed'
				handlers={setBtnHdl}
				content='[*]'
			/>}
		</>}
	/>
})

// --------USERS----------------------------------------------------------- //
const RoomUsers: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(11)

	// ----RENDER----------------------------- //
	const renderBoxes = useMemo(() => Array.from({ length: userCount }, (_, index) => (
		<RoomUser key={index + 1} id={index + 1} />
	)), [userCount])

	return <div className='chat-roomUsers'>
		<input
			className='chat-usrSearch-input'
			id={'chat-usrSearch-input'}
			name={'chat-usrSearch-input'}
			placeholder=' Connected users...'
		/>
		{renderBoxes}
	</div>
})
// --------USER------------------------------------------------------------ //
interface RoomUserProps {
	id: number
}
const RoomUser: React.FC<RoomUserProps> = memo(({ id }) => {
	// ----STATES----------------------------- //
	const [showButton, setShowButton] = useState(false)

	// ----HANDLERS--------------------------- //
	const enterUser = useCallback(() => setShowButton(true), [])
	const leaveUser = useCallback(() => setShowButton(false), [])

	// ----RENDER----------------------------- //
	return <div className='chat-usr'
		onMouseEnter={enterUser}
		onMouseLeave={leaveUser}>
		<NewBox
			tag='btn'
			className='chat-chat-usr-linkBtn'
			nameIfPressed='chat-btn--pressed'
			content={`[#${id}]`}
		/>
		{showButton && <div className='chat-usrActionBtns'>
			<NewBox
				tag='btn'
				className='chat-usrFigthBtn'
				nameIfPressed='chat-btn--pressed'
				content='[vs]'
			/>
			<NewBox
				tag='btn'
				className='chat-usrMsgBtn'
				nameIfPressed='chat-btn--pressed'
				content='[/w]'
			/>
			<NewBox
				tag='btn'
				className='chat-usrBlockBtn'
				nameIfPressed='chat-btn--pressed'
				content='[/x]'
			/>
		</div>}
	</div>
})

// --------TEXT-AREA------------------------------------------------------- //
interface TextAreaProps {
	chatArea: number
	showUsers: boolean
}
const TextArea: React.FC<TextAreaProps> = memo(({ chatArea, showUsers }) => {
	// ----RENDER----------------------------- //
	const updateChatArea = <>
		Content of chat #{chatArea}
	</>

	return <div className={`chat-txtArea${showUsers === true ? ' chat-txtArea--shorten' : ''}`}>
		{updateChatArea}
	</div>
})

// --------CHAT------------------------------------------------------------ //
const Chat: React.FC = memo(() => {
	// ----REFS------------------------------- //
	const chatRef = useRef<HTMLDivElement | null>(null)

	// ----STATES----------------------------- //
	const [chatOpenned, setChatOpenned] = useState(false)
	const [chatWidth, setChatWidth] = useState(0)
	const [showUsers, setShowUsers] = useState(false)
	const [chatArea, setChatArea] = useState(1)

	const [settingsOpen, setSettingsOpen] = useState(0)
	const [settingsPos, setSettingsPos] = useState({ left: '100%' })

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(resize)
		if (chatRef.current) chatSizeObserver.observe(chatRef.current)

		return () => { chatRef.current && chatSizeObserver.unobserve(chatRef.current) }
	}, [])

	useEffect(() => {
		if (chatWidth >= 450) {
			if (showUsers === false) setShowUsers(true)
		}
		else if (chatWidth < 450 && showUsers === true)
			setShowUsers(false)

		if (settingsOpen) moveSettings()
	}, [chatWidth])

	useLayoutEffect(() => moveSettings(), [settingsOpen])

	// ----HANDLERS--------------------------- //
	const resize = useCallback(() => {
		if (!chatRef.current) return

		const chatForm = chatRef.current.getBoundingClientRect()
		if (chatForm.width !== chatWidth) setChatWidth(chatForm.width)
	}, [chatWidth])

	const moveSettings = useCallback(() => {
		if (!chatRef.current) return

		const chatForm = chatRef.current.getBoundingClientRect()
		setSettingsPos({ left: `${chatForm.right}px` })
	}, [])

	const toggleChatContent = useCallback(() => {
		setChatOpenned(prevChatOpenned => !prevChatOpenned)
		setSettingsOpen(0)
		if (chatRef.current) {
			const element = chatRef.current
			element.setAttribute('style', 'width: 255px')
		}
	}, [])

	const mainBtnHdl = useMemo(() => ({
		onMouseUp: toggleChatContent
	}), [])

	// ----RENDER----------------------------- //
	return <div className='chat'>
		<div className={`chat-body${chatOpenned === false ? ' chat-body--noResize' : ''}`}
			ref={chatRef}>
			{chatOpenned === true && <div className='chat-mainArea'>
				<RoomBoxes
					settingsOpen={settingsOpen}
					setSettingsOpen={setSettingsOpen}
					setChatArea={setChatArea}
				/>
				<TextArea
					chatArea={chatArea}
					showUsers={showUsers}
				/>
				{showUsers === true && <RoomUsers />}
				<input
					className='chat-mainArea-input'
					id={'chat-input'}
					name={'chat-input'}
					placeholder=' ...'
				/>
				<NewBox
					tag='btn'
					className='chat-sendMsgBtn'
					nameIfPressed='chat-btn--pressed'
					content='[OK]'
				/>
			</div>}
			<NewBox
				tag='btn'
				className={`chat-mainBtn${chatOpenned === true ? ' chat-mainBtn--expended' : ''}`}
				nameIfPressed='chat-btn--pressed'
				handlers={mainBtnHdl}
				content='[CHAT]'
			/>
		</div>
		{settingsOpen !== 0 && <RoomSettings
			settingsOpen={settingsOpen}
			settingsPos={settingsPos}
		/>}
	</div>
})
export default Chat