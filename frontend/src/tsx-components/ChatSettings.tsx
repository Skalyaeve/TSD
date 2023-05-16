import React, { useState, useLayoutEffect, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { xMove, yMove } from '../tsx-utils/ftMotion.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'chat-roomSet'
const BTN_NAME = `${NAME}-btn`

// --------ROOM-MEMBER----------------------------------------------------- //
interface RoomMemberProps {
	id: number
	addedUsers: boolean
}
const RoomMember: React.FC<RoomMemberProps> = ({ id, addedUsers }) => {
	// ----STATES----------------------------- //
	const [showButtons, setShowButtons] = useState(false)

	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 40 * id,
		inDuration: 0.7 + 0.01 * id,
		outDuration: 0.5 - 0.01 * id
	})
	const btnMotion = (nbr: number) => xMove({
		from: 10 * nbr,
		inDuration: 0.3 + 0.01 * nbr,
		outDuration: 0.3 - 0.01 * nbr
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-usr`
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
	return <motion.div className={boxName}
		onMouseEnter={() => setShowButtons(true)}
		onMouseLeave={() => setShowButtons(false)}
		{...boxMotion}>

		<button className={linkName}>[#{id}]</button>
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
	const boxName = `${NAME}-users${(
		addedUsers ? ` ${NAME}-users-added` : ` ${NAME}-users-toAdd`
	)}`
	const inputName = `${NAME}-search-input`

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
			left: `${chatForm.right + 10}px`
		})
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = xMove({
		from: 50,
		inDuration: 0.3,
		outDuration: 0.3
	})

	// ----CLASSNAMES------------------------- //
	const nameInputName = `${NAME}-name-input ${NAME}-main-input`
	const pswInputName = `${NAME}-psw-input ${NAME}-main-input`
	const createBtnName = `${NAME}-create-btn ${BTN_NAME}`
	const saveBtnName = `${NAME}-update-btn ${BTN_NAME}`
	const delBtnName = `${NAME}-del-btn ${BTN_NAME}`

	// ----RENDER----------------------------- //
	const commitArea = () => {
		if (settingsOpen === 1)
			return <button className={createBtnName}>[CREATE]</button>
		else return <>
			<button className={saveBtnName}>[SAVE]</button>
			<button className={delBtnName}>[DELETE]</button>
		</>
	}
	return <motion.div
		className={NAME}
		style={settingsPos}
		{...boxMotion}>

		<input className={nameInputName} placeholder='Name' />
		<input className={pswInputName} placeholder='Password' />
		<RoomMembersSet addedUsers={true} />
		<RoomMembersSet addedUsers={false} />
		{commitArea()}
	</motion.div>
}
export default ChatSettings