import React, { useRef, useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DragDrop } from './ftDragDrop.tsx'
import { popUp, widthChangeByPercent, bouncyHeightChangeByPercent, xMove, bouncyYMove, mergeMotions, yMove } from './ftMotion.tsx'
import ChatSettings from './ChatSettings.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'chat'

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
	id,
	setChatArea,
	settingsOpen,
	setSettingsOpen,
	moveItem,
	isDragging,
	setIsDragging
}) => {
	// ----STATES----------------------------- //
	const [showRoomSet, setShowRoomSet] = useState(false)

	// ----HANDLERS--------------------------- //
	const boxMouseEnter = () => { !isDragging && setShowRoomSet(true) }
	const boxMouseLeave = () => setShowRoomSet(false)
	const boxDragStart = () => {
		setIsDragging(true)
		setShowRoomSet(false)
	}
	const boxDragEnd = () => {
		setIsDragging(false)
		setShowRoomSet(false)
	}
	const linkHdl = { onMouseUp: () => setChatArea(id) }
	const setBtnHdl = {
		onMouseUp: () => {
			if (settingsOpen != id + 1) setSettingsOpen(id + 1)
			else setSettingsOpen(0)
		}
	}

	// ----ANIMATIONS------------------------- //
	const setBtnMotion = popUp({
		inDuration: 0.3,
		outDuration: 0.3
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-room`
	const linkName = `${boxName}-link`
	const setBtnName = `${NAME}-setRoom-btn`

	// ----RENDER----------------------------- //
	const boxContent = <>
		<div className={linkName} {...linkHdl}>
			#{id}
		</div>
		<AnimatePresence>
			{showRoomSet && <motion.button
				className={setBtnName}
				{...setBtnHdl}
				{...setBtnMotion}>
				*
			</motion.button>}
		</AnimatePresence>
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
	extended: boolean
}
const RoomBoxes: React.FC<RoomBoxesProps> = ({
	setChatArea, chatRef, extended
}) => {
	// ----TYPES------------------------------ //
	interface RoomBoxType {
		id: number
		content?: React.ReactNode
	}

	// ----STATES----------------------------- //
	const [roomz, setRoomz] = useState<RoomBoxType[]>([])
	const [isDragging, setIsDragging] = useState(false)
	const [settingsOpen, setSettingsOpen] = useState(0)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		updateRoomBoxes(0, 1, { id: 1 })
	}, [])

	useEffect(() => {
		setSettingsOpen(0)
	}, [extended])

	// ----HANDLERS--------------------------- //
	const updateRoomBoxes = (index: number, rm: number, tab: RoomBoxType) => {
		setRoomz(prevRoomBox => {
			const newRoomBoxes = [...prevRoomBox]
			if (index < 0 || index > newRoomBoxes.length) return prevRoomBox
			if (tab) newRoomBoxes.splice(index, rm, tab)
			else newRoomBoxes.splice(index, rm)
			return newRoomBoxes
		})
	}
	const moveItem = (draggedId: number, droppedId: number) => {
		const dragged = roomz.findIndex(item => item.id === draggedId)
		const dropped = roomz.findIndex(item => item.id === droppedId)
		const newItems = [...roomz]
		newItems.splice(dragged, 1)
		newItems.splice(dropped, 0, roomz[dragged])
		setRoomz(newItems)
	}
	const btnHdl = {
		onMouseUp: () => {
			if (settingsOpen != 1) setSettingsOpen(1)
			else setSettingsOpen(0)
		}
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
			<button className={btnName} {...btnHdl}>
				{settingsOpen !== 1 ? '+' : '-'}
			</button>
		</div>
		<AnimatePresence>
			{settingsOpen && <ChatSettings
				key={`${NAME}-roomSet-${settingsOpen}`}
				settingsOpen={settingsOpen}
				chatRef={chatRef}
				extended={extended}
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

	// ----HANDLERS--------------------------- //
	const boxHdl = {
		onMouseEnter: () => setShowButtons(true),
		onMouseLeave: () => setShowButtons(false)
	}

	// ----ANIMATIONS------------------------- //
	const btnMotion = (nbr: number) => xMove({
		from: 10 * nbr,
		inDuration: 0.3 + 0.01 * nbr,
		outDuration: 0.3 - 0.01 * nbr
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-roomUsr`
	const linkName = `${boxName}-link`
	const btnName = `${boxName}-btn`
	const btnsName = `${boxName}-btns`

	// ----RENDER----------------------------- //
	return <div className={boxName} {...boxHdl}>
		<div className={linkName}>#{id}</div>
		<AnimatePresence>
			{showButtons && <div className={btnsName}>
				<motion.button className={btnName} {...btnMotion(3)}>
					vs
				</motion.button>
				<motion.button className={btnName} {...btnMotion(2)}>
					/w
				</motion.button>
				<motion.button className={btnName} {...btnMotion(1)}>
					/x
				</motion.button>
			</div>}
		</AnimatePresence>
	</div>
}

// --------USERS----------------------------------------------------------- //
const RoomUsers: React.FC = () => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(15)

	// ----ANIMATIONS------------------------- //
	const boxMotion = widthChangeByPercent({ finalWidth: 75, initialOpacity: 1 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-roomUsers`
	const inputName = `${boxName}-input`

	// ----RENDER----------------------------- //
	const renderBoxes = Array.from({ length: userCount }, (_, index) =>
		<RoomUser key={index + 1} id={index + 1} />
	)
	return <motion.div className={boxName} {...boxMotion}>
		<input className={inputName} placeholder={`${userCount} online`} />
		{renderBoxes}
	</motion.div>
}

// --------MAIN-CONTENT---------------------------------------------------- //
interface MainContentProps {
	chatRef: React.MutableRefObject<HTMLDivElement | null>
	extended: boolean
}
const MainContent: React.FC<MainContentProps> = ({ chatRef, extended }) => {
	// ----STATES----------------------------- //
	const [chatArea, setChatArea] = useState(1)

	// ----ANIMATIONS------------------------- //
	const boxMotion = bouncyHeightChangeByPercent({
		inDuration: 0.5,
		outDuration: 1
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-main`
	const inputName = `${boxName}-input`
	const btnName = `${inputName}-btn`
	const inputBoxName = `${inputName}-box`
	const middleContentName = `${boxName}-middleContent`
	const txtAreaName = `${NAME}-txtArea`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...boxMotion}>
		<RoomBoxes
			setChatArea={setChatArea}
			chatRef={chatRef}
			extended={extended}
		/>
		<div className={middleContentName}>
			<div className={txtAreaName}>
				Content of chat #{chatArea}
			</div>
			<AnimatePresence>{extended && <RoomUsers />}</AnimatePresence>
		</div>
		<div className={inputBoxName}>
			<input className={inputName} placeholder='...' />
			<button className={btnName}>OK</button>
		</div>
	</motion.div>
}

// --------MAIN-BTN-------------------------------------------------------- //
interface MainBtnProps {
	chatOpen: boolean
	extended: boolean
	setChatOpen: React.Dispatch<React.SetStateAction<boolean>>
	setExtended: React.Dispatch<React.SetStateAction<boolean>>
	animating: React.MutableRefObject<boolean>
}
const MainBtn: React.FC<MainBtnProps> = ({
	chatOpen, setChatOpen, extended, setExtended, animating
}) => {
	// ----STATES----------------------------- //
	const [showExtend, setShowExtend] = useState(false)

	// ----HANDLERS--------------------------- //
	const btnHdl = {
		onMouseEnter: () => chatOpen && setShowExtend(true),
		onMouseLeave: () => setShowExtend(false)
	}
	const extendBtnHdl = {
		onMouseUp: () => {
			animating.current = true
			setExtended(x => !x)
			const timer = setTimeout(() => animating.current = false, 500)
			return () => clearInterval(timer)
		}
	}
	const btnTxTHdl = {
		onMouseUp: () => {
			animating.current = true
			setChatOpen(x => !x)
			setExtended(false)
			const timer = setTimeout(() => animating.current = false, 500)
			return () => clearInterval(timer)
		}
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = {
		whileHover: {
			scale: extended ? 1.01 : 1.05,
			borderBottomLeftRadius: 5,
			borderBottomRightRadius: 5,
		}
	}
	const extendBtnMotion = mergeMotions(
		xMove({ from: -10, inDuration: 0.3, outDuration: 0.3 }),
		yMove({ from: 10, inDuration: 0.3, outDuration: 0.3 }),
	)

	// ----CLASSNAMES------------------------- //
	const btnName = `${NAME}-btn`
	const extendBtnName = `${NAME}-extend-btn`
	const btnTxtName = `${btnName}-txt custom-txt`

	// ----RENDER----------------------------- //
	return <motion.button
		className={btnName}
		style={{ height: (chatOpen ? '68.9px' : '60px') }}
		{...btnHdl}
		{...boxMotion}>
		<div className={btnTxtName} {...btnTxTHdl} />
		<AnimatePresence>
			{showExtend && <motion.div
				className={extendBtnName}
				{...extendBtnHdl}
				{...extendBtnMotion}
			/>}
		</AnimatePresence>
	</motion.button>
}

// --------SIDE-CHAT------------------------------------------------------- //
interface ChatProps {
	location: string
}
const Chat: React.FC<ChatProps> = ({ location }) => {
	// ----VALUES----------------------------- //
	const yTransform = () => {
		switch (location) {
			case '/': return 293
			case '/profile': return 143
			default: return 68
		}
	}

	// ----REFS------------------------------- //
	const chatRef = useRef<HTMLDivElement | null>(null)
	const animating = useRef(false)

	// ----STATES----------------------------- //
	const [chatOpen, setChatOpen] = useState(false)
	const [extended, setExtended] = useState(false)

	// ----ANIMATIONS------------------------- //
	const boxMotion = bouncyYMove({ from: 150, extra: -10, inDuration: 0.8 })
	const chatMotion = !extended || !chatOpen ? {
		animate: {
			width: '100%',
			height: '100%',
			zIndex: 2
		}
	} : {
		animate: {
			width: 'calc(100vw - 20px)',
			height: 'calc(100vh - 20px)',
			minWidth: animating.current ? '0' : '1004px',
			minHeight: animating.current ? '0' : '748px',
			y: `-${yTransform()}px`,
			zIndex: 4
		}
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...boxMotion}>
		<motion.div ref={chatRef} className={NAME} {...chatMotion}>
			<AnimatePresence>
				{chatOpen && <MainContent
					chatRef={chatRef}
					extended={extended}
				/>}
			</AnimatePresence>
			<MainBtn
				chatOpen={chatOpen}
				setChatOpen={setChatOpen}
				extended={extended}
				setExtended={setExtended}
				animating={animating}
			/>
		</motion.div>
	</motion.div>
}
export default Chat