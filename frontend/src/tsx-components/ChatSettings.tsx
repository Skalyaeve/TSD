import React, { useState, useCallback, useMemo } from 'react'

// --------ROOM-MEMBER----------------------------------------------------- //
interface RoomMemberProps {
	id: number
	className: string
	addedUsers: boolean
}
const RoomMember: React.FC<RoomMemberProps> = ({
	id, className, addedUsers
}) => {
	// ----STATES----------------------------- //
	const [showButton, setShowButton] = useState(false)

	// ----CLASSNAMES------------------------- //
	const btnName = `${className}-btn`

	// ----HANDLERS--------------------------- //
	const enterUser = useCallback(() => setShowButton(true), [])
	const leaveUser = useCallback(() => setShowButton(false), [])

	// ----RENDER----------------------------- //
	const btnToAdd = useMemo(() => {
		if (!addedUsers)
			return <button className={btnName}>
				[/x]'
			</button>
		else return <>
			<button className={btnName}>
				[up]'
			</button>
			<button className={btnName}>
				[/m]'
			</button>
			<button className={btnName}>
				[/x]'
			</button>
		</>
	}, [])

	return <div className={className}
		onMouseEnter={enterUser}
		onMouseLeave={leaveUser}>
		<button className={`${className}-link`}>
			[#{id}]
		</button>
		{showButton && <div className={`${className}-btns`}>
			{btnToAdd}
		</div>}
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
	const name = 'chat-roomSet'
	const usersName = `${name}-users`
	const inputName = `${name}-search-input`

	// ----RENDER----------------------------- //
	const renderUserList = useMemo(() => (count: number, addedUsers: boolean) => (
		Array.from({ length: count }, (_, index) => (
			<RoomMember
				key={index + 1}
				id={index + 1}
				className={`${name}-usr`}
				addedUsers={addedUsers}
			/>
		))
	), [count])

	return <div className={`${usersName}${(addedUsers ? '-added' : '-toAdd')} ${usersName}`}>
		<input
			className={inputName}
			id={`${inputName}${(addedUsers ? '-added' : '-toAdd')}`}
			name={`${inputName}${(addedUsers ? '-added' : '-toAdd')}`}
			placeholder={` ${count} ${(addedUsers ? 'members' : 'friends')}`}
		/>
		{renderUserList(count, addedUsers)}
	</div>
}

// --------ROOM-SETTINGS--------------------------------------------------- //
interface ChatSettingsPos {
	left: string
}
interface ChatSettingsProps {
	settingsOpen: number
	settingsPos: ChatSettingsPos
}
const ChatSettings: React.FC<ChatSettingsProps> = (({
	settingsOpen, settingsPos
}) => {
	// ----CLASSNAMES------------------------- //
	const name = 'chat-roomSet'
	const btnName = `${name}-btn`
	const mainInputName = `${name}-main-input`
	const nameInputName = `${name}-name-input`
	const pswInputName = `${name}-psw-input`

	// ----RENDER----------------------------- //
	const commitArea = useMemo(() => {
		if (settingsOpen === 1)
			return <button className={`${name}-create-btn ${btnName}`}>
				[CREATE]
			</button>
		else return <>
			<button className={`${name}-update-btn ${btnName}`}>
				[SAVE]
			</button>
			<button className={`${name}-del-btn ${btnName}`}>
				[DELETE]
			</button>
		</>
	}, [settingsOpen])

	return <div className={name}
		style={settingsPos}>
		<input
			className={`${nameInputName} ${mainInputName}`}
			id={nameInputName}
			name={nameInputName}
			placeholder='Name'
		/>
		<input
			className={`${pswInputName} ${mainInputName}`}
			id={pswInputName}
			name={pswInputName}
			placeholder='Password'
		/>
		<RoomMembersSet addedUsers={true} />
		<RoomMembersSet addedUsers={false} />
		{commitArea}
	</div>
})
export default ChatSettings