import React, { useRef, useState, useLayoutEffect, useEffect, useCallback, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { DragDrop } from '../tsx-utils/ftDragDrop.tsx'
import { FtBtn, FtMotionBtn } from '../tsx-utils/ftBox.tsx'
import { bouncyHeightChangeByPercent, bouncyYMove } from '../tsx-utils/ftFramerMotion.tsx'
import ChatSettings from '../tsx-components/ChatSettings.tsx'

// --------ROOM-BOXES------------------------------------------------------ //
interface RoomBoxesProps {
	settingsOpen: number
	setSettingsOpen: React.Dispatch<React.SetStateAction<number>>
	setChatArea: React.Dispatch<React.SetStateAction<number>>
}
const RoomBoxes: React.FC<RoomBoxesProps> = ({
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
		<FtBtn className='chat-newRoom-btn'
			pressedName='chat-btn--pressed'
			handler={newRoomBtnHdl}
			content={newRoomContent}
		/>
		<div className='chat-rooms'>
			{roomContent}
		</div>
	</>
}

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
const RoomBox: React.FC<RoomBoxProps> = ({
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

	// ----CLASSNAMES------------------------- //
	const name = 'chat-room'
	const btnPressedName = 'chat-btn--pressed'

	// ----RENDER----------------------------- //
	return <DragDrop
		itemId={id}
		className={name}
		moveItem={moveItem}
		onMouseEnter={showIt}
		onMouseLeave={hideIt}
		onDragStart={dragStart}
		onDragEnd={dragEnd}
		content={<>
			<FtBtn className={`${name}-link`}
				pressedName={btnPressedName}
				handler={linkBtnHdl}
				content={`[#${id}]`}
			/>
			{showRoomSet && <FtBtn className='chat-setRoom-btn'
				pressedName={btnPressedName}
				handler={setBtnHdl}
				content='[*]'
			/>}
		</>}
	/>
}

// --------USERS----------------------------------------------------------- //
const RoomUsers: React.FC = () => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(11)

	// ----CLASSNAMES------------------------- //
	const name = 'chat-roomUsers'

	// ----RENDER----------------------------- //
	const renderBoxes = useMemo(() => Array.from({ length: userCount }, (_, index) => (
		<RoomUser key={index + 1} id={index + 1} />
	)), [userCount])

	return <div className={name}>
		<input
			className={`${name}-input`}
			id={`${name}-input`}
			name={`${name}-input`}
			placeholder={` ${userCount} online`}
		/>
		{renderBoxes}
	</div>
}

// --------USER------------------------------------------------------------ //
interface RoomUserProps {
	id: number
}
const RoomUser: React.FC<RoomUserProps> = ({ id }) => {
	// ----STATES----------------------------- //
	const [showButton, setShowButton] = useState(false)

	// ----HANDLERS--------------------------- //
	const enterUser = useCallback(() => setShowButton(true), [])
	const leaveUser = useCallback(() => setShowButton(false), [])

	// ----CLASSNAMES------------------------- //
	const name = 'chat-roomUsr'
	const btnName = `${name}-btn`
	const btnPressedName = 'chat-btn--pressed'

	// ----RENDER----------------------------- //
	return <div className={name}
		onMouseEnter={enterUser}
		onMouseLeave={leaveUser}>
		<FtBtn className={`${name}-link`}
			pressedName={btnPressedName}
			content={`[#${id}]`}
		/>
		{showButton && <div className={`${btnName}s`}>
			<FtBtn className={btnName}
				pressedName={btnPressedName}
				content='[vs]'
			/>
			<FtBtn className={btnName}
				pressedName={btnPressedName}
				content='[/w]'
			/>
			<FtBtn className={btnName}
				pressedName={btnPressedName}
				content='[/x]'
			/>
		</div>}
	</div>
}

// --------TEXT-AREA------------------------------------------------------- //
interface TextAreaProps {
	chatArea: number
	showUsers: boolean
}
const TextArea: React.FC<TextAreaProps> = ({ chatArea, showUsers }) => {
	// ----CLASSNAMES------------------------- //
	const name = 'chat-txtArea'

	// ----RENDER----------------------------- //
	const updateChatArea = <>
		Content of chat #{chatArea}
	</>

	return <div className={`${name}${showUsers === true ? ` ${name}--shorten` : ''}`}>
		{updateChatArea}
	</div>
}

// --------MAIN-CONTENT---------------------------------------------------- //
interface MainContentProps {
	name: string
	mainName: string
	btnName: string
	showUsers: boolean
	settingsOpen: number
	setSettingsOpen: React.Dispatch<React.SetStateAction<number>>
}
const MainContent: React.FC<MainContentProps> = ({
	name, mainName, btnName, showUsers, settingsOpen, setSettingsOpen
}) => {
	// ----STATES----------------------------- //
	const [chatArea, setChatArea] = useState(1)

	// ----CLASSNAMES------------------------- //
	const mainInputName = `${mainName}-input`
	const smallBtnName = `${btnName}--small`

	// ----RENDER----------------------------- //
	const bouncyHeightGrowByPercentRender = useMemo(() => ({
		...bouncyHeightChangeByPercent({})
	}), []);

	return <motion.div className={mainName}
		key={mainName}
		{...bouncyHeightGrowByPercentRender}>
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
			className={mainInputName}
			id={mainInputName}
			name={mainInputName}
			placeholder=' ...'
		/>
		<FtBtn className={`${name}-sendMsg-btn ${smallBtnName}`}
			pressedName={`${btnName}--pressed`}
			content='[OK]'
		/>
	</motion.div>
}

// --------CHAT------------------------------------------------------------ //
const Chat: React.FC = () => {
	// ----REFS------------------------------- //
	const chatRef = useRef<HTMLDivElement | null>(null)

	// ----STATES----------------------------- //
	const [chatOpenned, setChatOpenned] = useState(false)
	const [chatWidth, setChatWidth] = useState(0)
	const [showUsers, setShowUsers] = useState(false)

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
			element.setAttribute('style', 'width: 100%')
		}
	}, [chatOpenned])

	const mainBtnHdl = useMemo(() => ({
		onMouseUp: toggleChatContent
	}), [toggleChatContent])

	// ----CLASSNAMES------------------------- //
	const name = 'chat'
	const bodyName = `${name}-body`
	const mainName = `${name}-main`
	const btnName = `${name}-btn`

	// ----RENDER----------------------------- //
	const bouncyComeFromColRender = useMemo(() => (
		bouncyYMove({ from: 100, extra: -20, inDuration: 0.7, outDuration: 0.8 })
	), [])

	const mainButtonMotion = {
		whileHover: {
			y: [0, -5, 0],
			transition: {
				times: [0, 0.75, 1],
				repeat: Infinity,
				ease: 'easeOut'
			}
		}
	}

	return <motion.div className={name}
		{...bouncyComeFromColRender}>

		<div className={`${bodyName}${chatOpenned === false ? ` ${bodyName}--noResize` : ''}`}
			ref={chatRef}>
			<AnimatePresence>
				{chatOpenned === true && <MainContent
					name={name}
					mainName={mainName}
					btnName={btnName}
					showUsers={showUsers}
					settingsOpen={settingsOpen}
					setSettingsOpen={setSettingsOpen}
				/>}

				<FtMotionBtn
					key={`${mainName}-btn`}
					className={`${mainName}-btn${chatOpenned === true ? ` ${mainName}-btn--expended` : ''}`}
					pressedName={`${btnName}--pressed`}
					handler={mainBtnHdl}
					motionProps={mainButtonMotion}
					content='[CHAT]'
				/>
			</AnimatePresence>
		</div>

		{settingsOpen !== 0 && <ChatSettings
			settingsOpen={settingsOpen}
			settingsPos={settingsPos} />
		}

	</motion.div >
}
export default Chat