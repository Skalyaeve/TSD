import React, { useState, useLayoutEffect, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, xMove, yMove } from './ftMotion.tsx'

// --------ANIMATIONS------------------------------------------------------ //
const mainBoxMotion = xMove({
	from: 50,
	inDuration: 0.3,
	outDuration: 0.15
})
const btnMotion = {
	whileHover: {
		scale: 1.05,
		borderTopLeftRadius: '5px',
		borderTopRightRadius: '5px',
		borderBottomLeftRadius: '5px',
		borderBottomRightRadius: '5px'
	}
}

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'chat'
const SETTINGS_NAME = `${NAME}-settings`
const ROOMSET_NAME = `${NAME}-roomSettings`
const BTN_NAME = `${SETTINGS_NAME}-btn`
const COMMIT_BTN = `${SETTINGS_NAME}-commit-btn`
const INPUT_NAME = `${SETTINGS_NAME}-input`

// --------ROOM-MEMBER----------------------------------------------------- //
interface RoomMemberProps {
	id: number
	addedUsers: boolean
}
const RoomMember: React.FC<RoomMemberProps> = ({ id, addedUsers }) => {
	// ----STATES----------------------------- //
	const [showButtons, setShowButtons] = useState(false)

	// ----HANDLERS--------------------------- //
	const boxHdl = {
		onMouseEnter: () => setShowButtons(true),
		onMouseLeave: () => setShowButtons(false)
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 40 * id,
		inDuration: 0.7 + 0.01 * id,
		outDuration: 0.3 - 0.01 * id
	})
	const btnMotion = (from: number) => fade({
		initialOpacity: from,
		inDuration: 0.3,
		outDuration: 0.3
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${ROOMSET_NAME}-usr`
	const linkName = `${boxName}-link`
	const btnName = `${boxName}-btn`
	const btnsName = `${btnName}s`
	const addBtnName = `${btnName} ${btnName}-add`
	const removeBtnName = `${btnName} ${btnName}-remove`
	const banBtnName = `${btnName} ${btnName}-ban`
	const upgradeBtnName = `${btnName} ${btnName}-upgrade`
	const muteBtnName = `${btnName} ${btnName}-mute`

	// ----RENDER----------------------------- //
	const btnToAdd = () => {
		if (!addedUsers)
			return <>
				<motion.button className={addBtnName} {...btnMotion(0)} />
				<motion.button className={banBtnName} {...btnMotion(0)} />
			</>
		else return <>
			<motion.button className={upgradeBtnName} {...btnMotion(0)} />
			<motion.button className={muteBtnName} {...btnMotion(0)} />
			<motion.button className={removeBtnName} {...btnMotion(0)} />
			<motion.button className={banBtnName} {...btnMotion(0)} />
		</>
	}
	return <motion.div className={boxName} {...boxHdl} {...boxMotion}>
		<div className={linkName}>#{id}</div>
		<AnimatePresence>
			{showButtons && <div className={btnsName}>{btnToAdd()}</div>}
		</AnimatePresence>
	</motion.div>
}

// --------ROOM-MEMBERS-SET------------------------------------------------ //
interface RoomMembersSetProps {
	addedUsers: boolean
	isPublic?: boolean
}
const RoomMembersSet: React.FC<RoomMembersSetProps> = ({
	addedUsers, isPublic
}) => {
	// ----STATES----------------------------- //
	const [count, setAddedCount] = useState(addedUsers ? 10 : 4)

	// ----CLASSNAMES------------------------- //
	const boxName = (isPublic ?
		`${ROOMSET_NAME}-users`
		: `${ROOMSET_NAME}-users ${ROOMSET_NAME}-users--private`
	)
	const inputName = `${ROOMSET_NAME}-search-input`

	// ----RENDER----------------------------- //
	const renderUserList = (count: number, addedUsers: boolean) => (
		Array.from({ length: count }, (_, index) =>
			<RoomMember key={index + 1} id={index + 1} addedUsers={addedUsers} />
		)
	)
	return <div className={boxName}>
		<input
			className={inputName}
			placeholder={`${count}${(addedUsers ? ' members' : ' friends')}`}
		/>
		{renderUserList(count, addedUsers)}
	</div>
}

// --------ROOM-SETTINGS--------------------------------------------------- //
interface RoomSettingsProps {
	settingsOpen: number
	setCreating: React.Dispatch<React.SetStateAction<number>>
	isPublic?: boolean
}
const RoomSettings: React.FC<RoomSettingsProps> = ({
	settingsOpen, setCreating, isPublic
}) => {
	// ----HANDLERS--------------------------- //
	const backBtnHdl = { onMouseUp: () => setCreating(1) }

	// ----CLASSNAMES------------------------- //
	const inputName = (isPublic ?
		`${INPUT_NAME}`
		: `${INPUT_NAME} ${INPUT_NAME}--private`
	)

	// ----RENDER----------------------------- //
	const commitArea = () => {
		if (settingsOpen === 1) return <>
			<motion.button className={COMMIT_BTN} {...btnMotion}>
				CREATE
			</motion.button>
			<motion.button
				className={COMMIT_BTN}
				{...backBtnHdl}
				{...btnMotion}>
				BACK
			</motion.button>
		</>
		return <>
			<motion.button className={COMMIT_BTN} {...btnMotion}>
				SAVE
			</motion.button>
			<motion.button className={COMMIT_BTN} {...btnMotion}>
				DELETE
			</motion.button>
		</>
	}
	return <motion.div className={ROOMSET_NAME} {...mainBoxMotion}>
		<input className={inputName} placeholder='Name' />
		{isPublic && <input className={inputName} placeholder='Password' />}
		<RoomMembersSet addedUsers={true} isPublic={isPublic} />
		<RoomMembersSet addedUsers={false} isPublic={isPublic} />
		{commitArea()}
	</motion.div>
}

// --------JOIN-ROOM------------------------------------------------------- //
interface JoinRoomProps {
	setJoining: React.Dispatch<React.SetStateAction<boolean>>
}
const JoinRoom: React.FC<JoinRoomProps> = ({ setJoining }) => {
	// ----HANDLERS--------------------------- //
	const backBtnHdl = { onMouseUp: () => setJoining(false) }

	// ----CLASSNAMES------------------------- //
	const boxName = `${SETTINGS_NAME} ${SETTINGS_NAME}-join`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...mainBoxMotion}>
		<input className={INPUT_NAME} placeholder='Name' />
		<input className={INPUT_NAME} placeholder='Password' />
		<motion.button className={COMMIT_BTN} {...btnMotion}>
			ENTER
		</motion.button>
		<motion.button className={COMMIT_BTN} {...backBtnHdl} {...btnMotion}>
			BACK
		</motion.button>
	</motion.div>
}

// --------CREATE-ROOM----------------------------------------------------- //
interface CreateRoomProps {
	setCreating: React.Dispatch<React.SetStateAction<number>>
}
const CreateRoom: React.FC<CreateRoomProps> = ({ setCreating }) => {
	// ----HANDLERS--------------------------- //
	const backBtnHdl = { onMouseUp: () => setCreating(0) }
	const publicBtnHdl = { onMouseUp: () => setCreating(2) }
	const privateBtnHdl = { onMouseUp: () => setCreating(3) }

	// ----RENDER----------------------------- //
	return <motion.div className={SETTINGS_NAME} {...mainBoxMotion}>
		<motion.button className={BTN_NAME} {...backBtnHdl} {...btnMotion}>
			BACK
		</motion.button>
		<motion.button className={BTN_NAME} {...publicBtnHdl} {...btnMotion}>
			PUBLIC
		</motion.button>
		<motion.button className={BTN_NAME} {...privateBtnHdl} {...btnMotion}>
			PRIVATE
		</motion.button>
	</motion.div>
}

// --------SIDE-CHAT-SETTINGS---------------------------------------------- //
interface ChatSettingsProps {
	settingsOpen: number
	chatRef: React.MutableRefObject<HTMLDivElement | null>
	extended: boolean
}
const ChatSettings: React.FC<ChatSettingsProps> = ({
	settingsOpen, chatRef, extended
}) => {
	// ----STATES----------------------------- //
	const [settingsPos, setSettingsPos] = useState({})
	const [creating, setCreating] = useState(0)
	const [joining, setJoining] = useState(false)

	// ----EFFECTS---------------------------- //
	useLayoutEffect(() => moveSettings(), [])

	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(moveSettings)
		chatRef.current && chatSizeObserver.observe(chatRef.current)
		window.addEventListener('scroll', moveSettings)
		return () => {
			chatRef.current && chatSizeObserver.unobserve(chatRef.current)
		}
	}, [])

	// ----HANDLERS--------------------------- //
	const moveSettings = () => {
		if (extended) { setSettingsPos({ top: `130px`, right: `265px` }) }
		if (extended || !chatRef.current) return

		const chatForm = chatRef.current.getBoundingClientRect()
		setSettingsPos({
			top: `${chatForm.top}px`,
			left: `${chatForm.right + 10}px`
		})
	}
	const createBtnHdl = { onMouseUp: () => setCreating(1) }
	const joinBtnHdl = { onMouseUp: () => setJoining(true) }

	// ----CLASSNAMES------------------------- //
	const boxName = `${SETTINGS_NAME}-box`

	// ----RENDER----------------------------- //
	const render = () => {
		if (creating === 1) return <CreateRoom
			key={`${SETTINGS_NAME}-createRoom`}
			setCreating={setCreating}
		/>
		if (creating) return <RoomSettings
			key={`${SETTINGS_NAME}-roomSettings`}
			settingsOpen={settingsOpen}
			setCreating={setCreating}
			isPublic={creating === 2 ? true : false}
		/>
		if (joining) return <JoinRoom
			key={`${SETTINGS_NAME}-joinRoom`}
			setJoining={setJoining}
		/>
		return <motion.div
			className={SETTINGS_NAME}
			key={`${SETTINGS_NAME}-main`}
			{...mainBoxMotion}>
			<motion.button
				className={BTN_NAME}
				{...createBtnHdl}
				{...btnMotion}>
				CREATE
			</motion.button>
			<motion.button
				className={BTN_NAME}
				{...joinBtnHdl}
				{...btnMotion}>
				JOIN
			</motion.button>
		</motion.div>
	}
	return <motion.div
		className={boxName}
		style={settingsPos}
		{...mainBoxMotion}>
		{settingsOpen === 1 && <AnimatePresence mode='wait'>
			{render()}
		</AnimatePresence>}
		{settingsOpen !== 1 && <RoomSettings
			settingsOpen={settingsOpen}
			setCreating={setCreating}
		/>}
	</motion.div>
}
export default ChatSettings