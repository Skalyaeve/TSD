import React, { useState, useLayoutEffect, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { xMove, yMove } from '../tsx-utils/ftMotion.tsx'

// --------ANIMATIONS------------------------------------------------------ //
const mainBoxMotion = xMove({
	from: 50,
	inDuration: 0.3,
	outDuration: 0.15
})

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'chat'
const SETTINGS_NAME = `${NAME}-settings`
const ROOMSET_NAME = `${NAME}-roomSet`
const BTN_NAME = `${ROOMSET_NAME}-btn`
const OPTIONS_NAME = `${SETTINGS_NAME}-option ${BTN_NAME}`
const NAME_INPUT_NAME = `${ROOMSET_NAME}-name-input ${ROOMSET_NAME}-main-input`
const PSW_INPUT_NAME = `${ROOMSET_NAME}-psw-input ${ROOMSET_NAME}-main-input`
const COMMIT_BTN = `${ROOMSET_NAME}-commit-btn ${BTN_NAME}`

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
	const btnMotion = (nbr: number) => xMove({
		from: 10 * nbr,
		inDuration: 0.3 + 0.01 * nbr,
		outDuration: 0.3 - 0.01 * nbr
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${ROOMSET_NAME}-usr`
	const linkName = `${boxName}-link  ${BTN_NAME}`
	const btnName = `${boxName}-btn  ${BTN_NAME}`
	const btnsName = `${boxName}-btns `

	// ----RENDER----------------------------- //
	const btnToAdd = () => {
		if (!addedUsers)
			return <motion.button className={btnName} {...btnMotion(1)}>
				[/x]
			</motion.button>
		else return <>
			<motion.button className={btnName} {...btnMotion(3)}>
				[up]
			</motion.button>
			<motion.button className={btnName} {...btnMotion(2)}>
				[/m]
			</motion.button>
			<motion.button className={btnName} {...btnMotion(1)}>
				[/x]
			</motion.button>
		</>
	}
	return <motion.div className={boxName} {...boxHdl} {...boxMotion}>
		<div className={linkName}>[#{id}]</div>
		<AnimatePresence>
			{showButtons && <div className={btnsName}>{btnToAdd()}</div>}
		</AnimatePresence>
	</motion.div>
}

// --------ROOM-MEMBERS-SET------------------------------------------------ //
interface RoomMembersSetProps {
	addedUsers: boolean
}
const RoomMembersSet: React.FC<RoomMembersSetProps> = ({ addedUsers }) => {
	// ----STATES----------------------------- //
	const [count, setAddedCount] = useState(addedUsers ? 10 : 7)

	// ----CLASSNAMES------------------------- //
	const boxName = `${ROOMSET_NAME}-users${(addedUsers ?
		` ${ROOMSET_NAME}-users-added` : ` ${ROOMSET_NAME}-users-toAdd`
	)}`
	const inputName = `${ROOMSET_NAME}-search-input`

	// ----RENDER----------------------------- //
	const renderUserList = (count: number, addedUsers: boolean) => (
		Array.from({ length: count }, (_, index) =>
			<RoomMember
				key={index + 1}
				id={index + 1}
				addedUsers={addedUsers}
			/>
		)
	)
	return <div className={boxName}>
		<input className={inputName}
			placeholder={` ${count}${(addedUsers ? ' members' : ' friends')}`}
		/>
		{renderUserList(count, addedUsers)}
	</div>
}

// --------ROOM-SETTINGS--------------------------------------------------- //
interface RoomSettingsProps {
	settingsOpen: number
	settingsPos: {}
	setCreating: React.Dispatch<React.SetStateAction<number>>
	isPublic?: boolean
}
const RoomSettings: React.FC<RoomSettingsProps> = ({
	settingsOpen, settingsPos, setCreating, isPublic
}) => {
	// ----HANDLERS--------------------------- //
	const backBtnHdl = { onMouseUp: () => setCreating(1) }

	// ----RENDER----------------------------- //
	const commitArea = () => {
		if (settingsOpen === 1)
			return <>
				<button className={COMMIT_BTN}>
					[CREATE]
				</button>
				<button className={COMMIT_BTN} {...backBtnHdl}>
					[BACK]
				</button>
			</>
		else return <>
			<button className={COMMIT_BTN}>
				[SAVE]
			</button>
			<button className={COMMIT_BTN}>
				[DELETE]
			</button>
		</>
	}
	return <motion.div
		className={ROOMSET_NAME}
		style={settingsPos}
		{...mainBoxMotion}>
		<input className={NAME_INPUT_NAME} placeholder='Name' />
		<input className={PSW_INPUT_NAME} placeholder='Password' />
		<RoomMembersSet addedUsers={true} />
		<RoomMembersSet addedUsers={false} />
		{commitArea()}
	</motion.div>
}

// --------JOIN-ROOM------------------------------------------------------- //
interface JoinRoomProps {
	settingsPos: {}
	setJoining: React.Dispatch<React.SetStateAction<boolean>>
}
const JoinRoom: React.FC<JoinRoomProps> = ({ settingsPos, setJoining }) => {
	// ----HANDLERS--------------------------- //
	const backBtnHdl = { onMouseUp: () => setJoining(false) }

	// ----CLASSNAMES------------------------- //
	const boxName = `${SETTINGS_NAME}-join`
	const commitAreaName = `${boxName}-commit`
	const commitBtnName = `${COMMIT_BTN} ${ROOMSET_NAME}-commit-btn--radius`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		style={settingsPos}
		{...mainBoxMotion}>
		<input className={NAME_INPUT_NAME} placeholder='Name' />
		<input className={PSW_INPUT_NAME} placeholder='Password' />
		<div className={commitAreaName}>
			<button className={commitBtnName}>
				[ENTER]
			</button>
			<button className={commitBtnName} {...backBtnHdl}>
				[BACK]
			</button>
		</div>
	</motion.div>
}

// --------CREATE-ROOM----------------------------------------------------- //
interface CreateRoomProps {
	settingsPos: {}
	setCreating: React.Dispatch<React.SetStateAction<number>>
}
const CreateRoom: React.FC<CreateRoomProps> = ({
	settingsPos, setCreating
}) => {
	// ----HANDLERS--------------------------- //
	const backBtnHdl = { onMouseUp: () => setCreating(0) }
	const publicBtnHdl = { onMouseUp: () => setCreating(2) }
	const privateBtnHdl = { onMouseUp: () => setCreating(3) }

	// ----RENDER----------------------------- //
	return <motion.div className={SETTINGS_NAME}
		style={settingsPos}
		{...mainBoxMotion}>
		<button className={OPTIONS_NAME} {...backBtnHdl}>
			[BACK]
		</button>
		<button className={OPTIONS_NAME} {...publicBtnHdl}>
			[PUBLIC]
		</button>
		<button className={OPTIONS_NAME} {...privateBtnHdl}>
			[PRIVATE]
		</button>
	</motion.div>
}

// --------CHAT-SETTINGS--------------------------------------------------- //
interface ChatSettingsProps {
	settingsOpen: number
	chatRef: React.MutableRefObject<HTMLDivElement | null>
}
const ChatSettings: React.FC<ChatSettingsProps> = ({
	settingsOpen, chatRef
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
		if (!chatRef.current) return
		const chatForm = chatRef.current.getBoundingClientRect()
		setSettingsPos({
			top: `${chatForm.top + 10}px`,
			left: `${chatForm.right}px`
		})
	}
	const createBtnHdl = { onMouseUp: () => setCreating(1) }
	const joinBtnHdl = { onMouseUp: () => setJoining(true) }

	// ----CLASSNAMES------------------------- //
	const boxName = `${SETTINGS_NAME}-box`

	// ----RENDER----------------------------- //
	const render = () => {
		if (creating === 1) return <CreateRoom
			key={`${SETTINGS_NAME}-CreateRoom`}
			settingsPos={settingsPos}
			setCreating={setCreating}
		/>
		if (creating) return <RoomSettings
			key={`${SETTINGS_NAME}-RoomSettings`}
			settingsOpen={settingsOpen}
			settingsPos={settingsPos}
			setCreating={setCreating}
			isPublic={creating === 2 ? true : false}
		/>
		if (joining) return <JoinRoom
			key={`${SETTINGS_NAME}-JoinRoom`}
			settingsPos={settingsPos}
			setJoining={setJoining}
		/>
		return <motion.div
			className={SETTINGS_NAME}
			key={`${SETTINGS_NAME}-Main`}
			style={settingsPos}
			{...mainBoxMotion}>
			<button className={OPTIONS_NAME} {...createBtnHdl}>
				[CREATE]
			</button>
			<button className={OPTIONS_NAME} {...joinBtnHdl}>
				[JOIN]
			</button>
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
			settingsPos={settingsPos}
			setCreating={setCreating}
		/>}
	</motion.div>
}
export default ChatSettings