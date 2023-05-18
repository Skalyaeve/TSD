import React, { useRef, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, MotionProps, motion } from 'framer-motion'
import { DragDrop } from '../tsx-utils/ftDragDrop.tsx'
import { widthChangeByPx, bouncyHeightChangeByPercent, xMove, bouncyYMove } from '../tsx-utils/ftMotion.tsx'
import ChatSettings from './SideChatSettings.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'sideChat'
const MAIN_NAME = `${NAME}-main`
const BTN_NAME = `${NAME}-btn`

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
	const setBtnMotion = xMove({
		from: 20,
		inDuration: 0.3,
		outDuration: 0.3
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-room`
	const linkName = `${boxName}-link ${BTN_NAME}`
	const setBtnName = `${NAME}-setRoom-btn ${BTN_NAME}`

	// ----RENDER----------------------------- //
	const boxContent = <>
		<div className={linkName} {...linkHdl}>
			[#{id}]
		</div>
		<AnimatePresence>
			{showRoomSet && <motion.button
				className={setBtnName}
				{...setBtnHdl}
				{...setBtnMotion}>
				[*]
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

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		updateRoomBoxes(0, 1, { id: 1 })
		updateRoomBoxes(1, 1, { id: 2 })
		updateRoomBoxes(2, 1, { id: 3 })
	}, [])

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
	const btnName = `${NAME}-newRoom-btn ${BTN_NAME}`

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
		<div className={boxName}>{roomz.map(box => newRoomBox(box))}</div>
		<button className={btnName} {...btnHdl}>
			{settingsOpen !== 1 ? '[+]' : '[-]'}
		</button>
		<AnimatePresence>
			{settingsOpen && <ChatSettings
				key={`${NAME}-roomSet-${settingsOpen}`}
				settingsOpen={settingsOpen}
				chatRef={chatRef}
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
	const boxMotion = xMove({
		from: 100 + 100 * id,
		inDuration: 0.5 + 0.01 * id,
		outDuration: 0.5 - 0.01 * id
	})
	const btnMotion = (nbr: number) => xMove({
		from: 10 * nbr,
		inDuration: 0.3 + 0.01 * nbr,
		outDuration: 0.3 - 0.01 * nbr
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-roomUsr`
	const linkName = `${boxName}-link ${BTN_NAME}`
	const btnName = `${boxName}-btn ${BTN_NAME}`
	const btnsName = `${boxName}-btns`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...boxHdl} {...boxMotion}>
		<div className={linkName}>[#{id}]</div>
		<AnimatePresence>
			{showButtons && <div className={btnsName}>
				<motion.button className={btnName} {...btnMotion(3)}>
					[vs]
				</motion.button>
				<motion.button className={btnName} {...btnMotion(2)}>
					[/w]
				</motion.button>
				<motion.button className={btnName} {...btnMotion(1)}>
					[/x]
				</motion.button>
			</div>}
		</AnimatePresence>
	</motion.div>
}

// --------USERS----------------------------------------------------------- //
const RoomUsers: React.FC = () => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(11)

	// ----ANIMATIONS------------------------- //
	const boxMotion = widthChangeByPx({
		finalWidth: 200,
		initialOpacity: 1,
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-roomUsers`
	const inputName = `${boxName}-input`

	// ----RENDER----------------------------- //
	const renderBoxes = Array.from({ length: userCount }, (_, index) =>
		<RoomUser key={index + 1} id={index + 1} />
	)
	return <motion.div className={boxName} {...boxMotion}>
		<motion.input
			className={inputName}
			placeholder={` ${userCount} online`}
		/>
		{renderBoxes}
	</motion.div>
}

// --------TEXT-AREA------------------------------------------------------- //
interface TextAreaProps {
	chatArea: number
	showUsers: boolean
}
const TextArea: React.FC<TextAreaProps> = ({ chatArea, showUsers }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-txtArea ${(
		showUsers ? `${NAME}-txtArea--shorten` : ''
	)}`

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
			if (!showUsersRef.current) {
				setShowUsers(true)
				showUsersRef.current = true
			}
		}
		else if (chatRefBCR.width < 450 && showUsersRef.current) {
			setShowUsers(false)
			showUsersRef.current = false
		}
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = bouncyHeightChangeByPercent({
		inDuration: 0.5,
		outDuration: 1
	})

	// ----CLASSNAMES------------------------- //
	const inputName = `${MAIN_NAME}-input`
	const btnName = `${inputName}-btn ${BTN_NAME}`
	const inputBoxName = `${inputName}-box`

	// ----RENDER----------------------------- //
	return <motion.div className={MAIN_NAME} {...boxMotion}>
		<RoomBoxes setChatArea={setChatArea} chatRef={chatRef} />
		<AnimatePresence>
			{showUsers && <RoomUsers />}
		</AnimatePresence>
		<TextArea chatArea={chatArea} showUsers={showUsers} />
		<div className={inputBoxName}>
			<input className={inputName} placeholder=' ...' />
			<button className={btnName}>[OK]</button>
		</div>
	</motion.div>
}

// --------SIDE-CHAT------------------------------------------------------- //
const SideChat: React.FC = () => {
	// ----REFS------------------------------- //
	const chatRef = useRef<HTMLDivElement | null>(null)

	// ----STATES----------------------------- //
	const [chatOpen, setChatOpen] = useState(false)
	const [animeMainBtn, setAnimeMainBtn] = useState(false)
	const [animeFullPageBtn, setAnimeFullPageBtn] = useState(false)

	// ----HANDLERS--------------------------- //
	const toggleChatContent = () => {
		setChatOpen(x => !x)
		if (chatRef.current)
			chatRef.current.setAttribute('style', 'width: 100%')
	}
	const extendBtnHdl = {
		onMouseEnter: () => setAnimeMainBtn(true),
		onMouseLeave: () => setAnimeMainBtn(false),
		onMouseUp: toggleChatContent
	}
	const fullPageBtnHdl = {
		onMouseEnter: () => setAnimeFullPageBtn(true),
		onMouseLeave: () => setAnimeFullPageBtn(false),
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = bouncyYMove({ from: 100, extra: -10, inDuration: 0.8 })
	const btnMotion = {
		y: [0, -5, 0],
		transition: {
			times: [0, 0.75, 1],
			repeat: Infinity,
			ease: 'easeOut'
		}
	}
	const fullPageBtnMotion = {
		whileHover: {
			scale: [1, 1.1, 1],
			borderTopLeftRadius: [0, 5, 0],
			borderBottomLeftRadius: [0, 5, 0],
			borderBottomRightRadius: [chatOpen ? 0 : 5, 5, chatOpen ? 0 : 5],
			transition: {
				duration: 1,
				repeat: Infinity,
				repeatType: 'reverse',
				ease: 'linear'
			}
		}
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}${!chatOpen ? ` ${NAME}--noResize` : ''}`
	const btnName = ` ${MAIN_NAME}-btn`
	const extendBtnName = `${BTN_NAME}  ${MAIN_NAME}-extend-btn${(
		chatOpen ? ` ${MAIN_NAME}-extend-btn--extend` : ''
	)}`
	const fullPageBtnName = `${BTN_NAME}  ${MAIN_NAME}-fullPage-btn${(
		chatOpen ?
			(!animeFullPageBtn ? ` ${MAIN_NAME}-fullPage-btn--extend` : '')
			:
			` ${MAIN_NAME}-fullPage-btn--noextend`
	)}`
	const fullPageLinkName = `${MAIN_NAME}-fullPage-link`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} ref={chatRef} {...boxMotion}>
		<AnimatePresence>
			{chatOpen && <MainContent chatRef={chatRef} />}
		</AnimatePresence>
		<motion.div
			className={btnName}>
			<motion.button
				className={extendBtnName}
				animate={animeMainBtn ? btnMotion : {}}
				{...extendBtnHdl}>
				[CHAT]
			</motion.button>
			<motion.button
				className={fullPageBtnName}
				animate={animeMainBtn ? btnMotion : {}}
				{...fullPageBtnHdl}
				{...fullPageBtnMotion as MotionProps}>
				<Link className={fullPageLinkName} to={'/chat'}>
					[&gt;&gt;]
				</Link>
			</motion.button>
		</motion.div>
	</motion.div>
}
export default SideChat