import React, { useState } from 'react'

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

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-usr`
	const linkName = `${boxName}-link`
	const btnsName = `${BTN_NAME}s`

	// ----RENDER----------------------------- //
	const btnToAdd = () => {
		if (!addedUsers) return <button className={BTN_NAME}>[/x]</button>
		else return <>
			<button className={BTN_NAME}>[up]</button>
			<button className={BTN_NAME}>[/m]</button>
			<button className={BTN_NAME}>[/x]</button>
		</>
	}
	return <div className={boxName}
		onMouseEnter={() => setShowButtons(true)}
		onMouseLeave={() => setShowButtons(false)}>
		<button className={linkName}>[#{id}]</button>
		{showButtons && <div className={btnsName}>{btnToAdd()}</div>}
	</div>
}

// --------ROOM-MEMBERS-SET------------------------------------------------ //
interface RoomMembersSetProps {
	addedUsers: boolean
}
const RoomMembersSet: React.FC<RoomMembersSetProps> = ({ addedUsers }) => {
	// ----STATES----------------------------- //
	const [count, setAddedCount] = useState((addedUsers ? 10 : 7))

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

// --------ROOM-SETTINGS--------------------------------------------------- //
interface ChatSettingsProps {
	settingsOpen: number
	settingsPos: any
}
const ChatSettings: React.FC<ChatSettingsProps> = ({
	settingsOpen, settingsPos
}) => {
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
	return <div className={NAME} style={settingsPos}>
		<input className={nameInputName} placeholder='Name' />
		<input className={pswInputName} placeholder='Password' />
		<RoomMembersSet addedUsers={true} />
		<RoomMembersSet addedUsers={false} />
		{commitArea()}
	</div>
}
export default ChatSettings