import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DragDrop } from '../tsx-utils/ftDragDrop.tsx'
import { heightChangeByPercent, bouncyYMove } from '../tsx-utils/ftMotion.tsx'
import ChatSettings from '../tsx-components/ChatSettings.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'chat'
const MAIN_NAME = `${NAME}-main`

// --------ROOM-BOX-------------------------------------------------------- //
interface RoomBoxProps {
	id: number
	setChatArea: React.Dispatch<React.SetStateAction<number>>
	settingsOpen: number
	setSettingsOpen: React.Dispatch<React.SetStateAction<number>>
	moveItem: (draggedId: number, droppedId: number) => void
	isDragging: boolean
	setIsDragging: React.Dispatch<React.SetStateAction<boolean>>
}
const RoomBox: React.FC<RoomBoxProps> = ({
	id, setChatArea, settingsOpen, setSettingsOpen,
	moveItem, isDragging, setIsDragging
}) => {
	// ----STATES----------------------------- //
	const [showRoomSet, setShowRoomSet] = useState(false)

	// ----HANDLERS--------------------------- //
	const boxMouseEnter = () => { isDragging && setShowRoomSet(true) }
	const boxMouseLeave = () => setShowRoomSet(false)
	const boxDragStart = () => {
		setIsDragging(true)
		setShowRoomSet(false)
	}
	const boxDragEnd = () => {
		setIsDragging(false)
		setShowRoomSet(false)
	}
	const setBtnUp = () => {
		if (settingsOpen != id + 1) {
			setSettingsOpen(id + 1)
			settingsOpen = id + 1
		}
		else {
			setSettingsOpen(0)
			settingsOpen = 0
		}
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-room`
	const linkName = `${boxName}-link`
	const setBtnName = `${NAME}-setRoom-btn`

	// ----RENDER----------------------------- //
	const boxContent = <>
		<button className={linkName}
			onMouseUp={() => setChatArea(id)}>
			[#{id}]
		</button>
		{showRoomSet && <button className={setBtnName}
			onMouseUp={setBtnUp}>
			[*]
		</button>}
	</>
	return <DragDrop
		itemId={id}
		className={boxName}
		onMouseEnter={boxMouseEnter}
		onMouseLeave={boxMouseLeave}
		onDragStart={boxDragStart}
		onDragEnd={boxDragEnd}
		content={boxContent}
		moveItem={moveItem}
	/>
}

// --------ROOM-BOXES------------------------------------------------------ //
interface RoomBoxesProps {
	setChatArea: React.Dispatch<React.SetStateAction<number>>
	chatRef: React.MutableRefObject<HTMLDivElement | null>
}
const RoomBoxes: React.FC<RoomBoxesProps> = ({ setChatArea, chatRef }) => {
	// ----TYPES------------------------------ //
	interface RoomBoxType {
		id: number
		content?: React.ReactNode
	}

	// ----STATES----------------------------- //
	const [roomz, setRoomz] = useState<RoomBoxType[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(0)
	const [settingsPos, setSettingsPos] = useState({ left: '100%' })

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		updateRoomBoxes(0, 1, { id: 1 })
		updateRoomBoxes(1, 1, { id: 2 })
		updateRoomBoxes(2, 1, { id: 3 })
	}, [])

	useLayoutEffect(() => moveSettings(), [settingsOpen])

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
	const moveSettings = () => {
		if (!chatRef.current) return

		const chatForm = chatRef.current.getBoundingClientRect()
		setSettingsPos({ left: `${chatForm.right}px` })
	}
	const moveItem = (draggedId: number, droppedId: number) => {
		const dragged = roomz.findIndex((item) => item.id === draggedId)
		const dropped = roomz.findIndex((item) => item.id === droppedId)
		const newItems = [...roomz]
		newItems.splice(dragged, 1)
		newItems.splice(dropped, 0, roomz[dragged])
		setRoomz(newItems)
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-rooms`
	const btnName = `${NAME}-newRoom-btn`

	// ----RENDER----------------------------- //
	const newRoomBox = (box: RoomBoxType) => <RoomBox
		key={box.id}
		id={box.id}
		setChatArea={setChatArea}
		settingsOpen={settingsOpen}
		setSettingsOpen={setSettingsOpen}
		moveItem={moveItem}
		isDragging={isDragging}
		setIsDragging={setIsDragging}
	/>
	return <>
		<div className={boxName}>
			{roomz.map(box => newRoomBox(box))}
			<button className={btnName}
				onMouseUp={() => (settingsOpen === 0 ?
					setSettingsOpen(1)
					: setSettingsOpen(0)
				)}>
				{settingsOpen === 0 ? '[+]' : '[-]'}
			</button>
		</div>
		<AnimatePresence>
			{settingsOpen !== 0 && <ChatSettings
				key='ChatSettings'
				settingsOpen={settingsOpen}
				settingsPos={settingsPos}
			/>}
		</AnimatePresence>
	</>
}

// --------USER------------------------------------------------------------ //
interface RoomUserProps {
	id: number
}
const RoomUser: React.FC<RoomUserProps> = ({ id }) => {
	// ----STATES----------------------------- //
	const [showButtons, setShowButtons] = useState(false)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-roomUsr`
	const linkName = `${boxName}-link`
	const btnName = `${boxName}-btn`
	const btnsName = `${btnName}s`

	// ----RENDER----------------------------- //
	return <div className={boxName}
		onMouseEnter={() => setShowButtons(true)}
		onMouseLeave={() => setShowButtons(false)}>
		<button className={linkName}>[#{id}]</button>
		{showButtons && <div className={btnsName}>
			<button className={btnName}>[vs]</button>
			<button className={btnName}>[/w]</button>
			<button className={btnName}>[/x]</button>
		</div>}
	</div>
}

// --------USERS----------------------------------------------------------- //
const RoomUsers: React.FC = () => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(11)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-roomUsers`
	const inputName = `${boxName}-input`

	// ----RENDER----------------------------- //
	const renderBoxes = Array.from({ length: userCount }, (_, index) =>
		<RoomUser key={index + 1} id={index + 1} />
	)
	return <div className={boxName}>
		<input className={inputName} placeholder={` ${userCount} online`} />
		{renderBoxes}
	</div>
}

// --------TEXT-AREA------------------------------------------------------- //
interface TextAreaProps {
	chatArea: number
}
const TextArea: React.FC<TextAreaProps> = ({ chatArea }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-txtArea`

	// ----RENDER----------------------------- //
	return <div className={boxName}>Content of chat #{chatArea}</div>
}

// --------MAIN-CONTENT---------------------------------------------------- //
interface MainContentProps {
	chatRef: React.MutableRefObject<HTMLDivElement | null>
}
const MainContent: React.FC<MainContentProps> = ({ chatRef }) => {
	// ----REFS------------------------------- //
	const showUsersRef = useRef(false)

	// ----STATES----------------------------- //
	const [chatArea, setChatArea] = useState(1)
	const [showUsers, setShowUsers] = useState(false)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(resize)
		chatRef.current && chatSizeObserver.observe(chatRef.current)

		return () => {
			chatRef.current && chatSizeObserver.unobserve(chatRef.current)
		}
	}, [])

	// ----HANDLERS--------------------------- //
	const resize = () => {
		if (!chatRef.current) return

		const chatRefBCR = chatRef.current.getBoundingClientRect()
		if (chatRefBCR.width >= 450) {
			if (showUsersRef.current === false) {
				setShowUsers(true)
				showUsersRef.current = true
			}
		}
		else if (chatRefBCR.width < 450 && showUsersRef.current === true) {
			setShowUsers(false)
			showUsersRef.current = false
		}
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = heightChangeByPercent({})

	// ----CLASSNAMES------------------------- //
	const inputName = `${MAIN_NAME}-input`
	const btnName = `${NAME}-sendMsg-btn`

	// ----RENDER----------------------------- //
	return <motion.div className={MAIN_NAME} key={MAIN_NAME} {...boxMotion}>
		<RoomBoxes setChatArea={setChatArea} chatRef={chatRef} />
		{showUsers === true && <RoomUsers />}

		<TextArea chatArea={chatArea} />
		<input className={inputName} placeholder=' ...' />
		<button className={btnName}>[OK]</button>
	</motion.div>
}

// --------CHAT------------------------------------------------------------ //
const Chat: React.FC = () => {
	// ----REFS------------------------------- //
	const chatRef = useRef<HTMLDivElement | null>(null)

	// ----STATES----------------------------- //
	const [chatOpen, setChatOpen] = useState(false)

	// ----HANDLERS--------------------------- //
	const toggleChatContent = () => {
		setChatOpen(x => !x)
		if (chatRef.current)
			chatRef.current.setAttribute('style', 'width: 100%')
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = bouncyYMove({ from: 100, extra: -10, inDuration: 0.8 })
	const btnMotion = {
		whileHover: {
			y: [0, -5, 0],
			transition: {
				times: [0, 0.75, 1],
				repeat: Infinity,
				ease: 'easeOut'
			}
		}
	}

	// ----CLASSNAMES------------------------- //
	const parentName = `${NAME}-box`
	const boxName = `${NAME}${(
		!chatOpen ? ` ${NAME}--noResize` : ''
	)}`
	const btnName = `${MAIN_NAME}-btn${(
		chatOpen ? ` ${MAIN_NAME}-btn--expended` : ''
	)}`

	// ----RENDER----------------------------- //
	return <motion.div className={parentName} {...boxMotion}>
		<div className={boxName} ref={chatRef}>
			<AnimatePresence>
				{chatOpen && <MainContent chatRef={chatRef} />}
			</AnimatePresence>

			<motion.button className={btnName}
				onMouseUp={toggleChatContent}
				{...btnMotion}>
				[CHAT]
			</motion.button>
		</div>
	</motion.div>
}
export default Chat