import React, { memo, useState, useMemo, useCallback } from 'react'
import { NewBox } from './utils.tsx'

// --------USER------------------------------------------------------------ //
interface UserStatsProps {
	id: number
	name: string
	colName: string
}
const UserStats: React.FC<UserStatsProps> = memo(({ id, name, colName }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${name}-usr`

	// ----RENDER----------------------------- //
	const usrBox = (nameExt: string, content: string) => <div
		className={`${colName} ${colName}-${nameExt}`}>
		{content}
	</div>

	return <div className={boxName}>
		<NewBox
			tag='btn'
			className={`${colName} ${colName}-name`}
			nameIfPressed='leader-btn--pressed'
			content={<>
				<div className={`${boxName}-rank`}>#{id}</div>
				<div className={`${boxName}-pic`}>PP</div>
				<div className={`${boxName}-link`}>[NAME]</div>
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
interface BoardProps {
	name: string
	btnName: string
}
const Board: React.FC<BoardProps> = memo(({ name, btnName }) => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(10)

	// ----CLASSNAMES------------------------- //
	const colName = `${name}-col`

	// ----RENDER----------------------------- //
	const renderBoxes = useMemo(() => Array.from({ length: userCount }, (_, index) => (
		<UserStats
			key={index + 1}
			id={index + 1}
			name={name}
			colName={colName}
		/>
	)), [userCount])

	const boardHeadBox = (nameExt: string, content: string) => <NewBox
		tag='btn'
		className={`${colName} ${colName}-head ${colName}-${nameExt} ${btnName}`}
		nameIfPressed={`${btnName}--pressed`}
		content={content}
	/>

	return <div className={`${name}-body`}>
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
		<Board name={name} btnName={btnName} />
	</main >
})
export default Leader