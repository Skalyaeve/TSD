import React, { memo, useState, useMemo, useCallback } from 'react'
import { NewBox } from './utils.tsx'

// --------USER------------------------------------------------------------ //
interface UserStatsProps {
	id: number
}
const UserStats: React.FC<UserStatsProps> = memo(({ id }) => {
	// ----CLASSNAMES------------------------- //
	const name = 'leader'
	const usrBoxName = `${name}-usr`
	const colName = `${name}-col`
	const btnName = `${name}-btn`

	// ----RENDER----------------------------- //
	const usrBox = (nameExt: string, content: string) => <div
		className={`${colName} ${colName}-${nameExt}`}>
		{content}
	</div>

	return <div className={usrBoxName}>
		<NewBox
			tag='btn'
			className={`${colName} ${colName}-name`}
			nameIfPressed={`${btnName}--pressed`}
			content={<>
				<div className={`${usrBoxName}-rank`}>#{id}</div>
				<div className={`${usrBoxName}-pic`}>PP</div>
				<div className={`${usrBoxName}-link`}>[NAME]</div>
			</>}
		/>
		{usrBox('matches', '0')}
		{usrBox('wins', '0')}
		{usrBox('loses', '0')}
		{usrBox('ratio', '0')}
		{usrBox('scored', '0')}
	</div>
})

// --------BOARD----------------------------------------------------------- //
const Board: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(10)

	// ----CLASSNAMES------------------------- //
	const name = 'leader'
	const bodyName = `${name}-body`
	const colName = `${name}-col`
	const btnName = `${name}-btn`

	// ----RENDER----------------------------- //
	const renderBoxes = useMemo(() => Array.from({ length: userCount }, (_, index) => (
		<UserStats key={index + 1} id={index + 1} />
	)), [userCount])

	const boardHeadBox = (nameExt: string, content: string) => <NewBox
		tag='btn'
		className={`${colName} ${colName}-head ${colName}-${nameExt} ${btnName}`}
		nameIfPressed={`${btnName}--pressed`}
		content={content}
	/>

	return <div className={bodyName}>
		<div className={`${name}-boardHead`}>
			<div className={`${colName} ${colName}-head ${colName}-name`}>NAME</div>
			{boardHeadBox('matches', '[MATCHES]')}
			{boardHeadBox('wins', '[WINS]')}
			{boardHeadBox('loses', '[LOSES]')}
			{boardHeadBox('ratio', '[RATIO]')}
			{boardHeadBox('scored', '[SCORED]')}
		</div>
		{renderBoxes}
	</div >
})

// --------LEADER---------------------------------------------------------- //
const Leader: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [global, setGlobal] = useState(true)

	// ----HANDLERS--------------------------- //
	const toggleGlobal = useCallback(() => setGlobal(x => !x), [])

	const switchBtnHdl = useMemo(() => ({
		onMouseUp: toggleGlobal
	}), [])

	// ----CLASSNAMES------------------------- //
	const name = 'leader'
	const inputName = `${name}-input`
	const btnName = `${name}-btn`
	const btnPressedName = `${btnName}--pressed`

	// ----RENDER----------------------------- //
	const headBox = (nameExt: string, content: string) => <NewBox
		tag='btn'
		className={`${name}-${nameExt}-btn ${btnName}`}
		nameIfPressed={btnPressedName}
		content={content}
	/>

	return <main className={`${name} main`}>
		<div className={`${name}-head`}>
			<NewBox
				tag='btn'
				className={`${name}-switch-btn ${btnName}`}
				nameIfPressed={btnPressedName}
				handlers={switchBtnHdl}
				content={(global ? '[FRIENDS]' : '[GLOBAL]')}
			/>
			{headBox('down', '[>>]')}
			{headBox('up', '[<<]')}
			{headBox('findMe', '[FIND ME]')}
			{headBox('findTop', '[TOP]')}
			{headBox('input', '[OK]')}
			<input
				className={inputName}
				id={inputName}
				name={inputName}
				placeholder=' ...'
			/>
		</div>
		<Board />
	</main >
})
export default Leader