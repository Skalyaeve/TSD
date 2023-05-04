import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

import { FtBtn, FtInput } from '../tsx-utils/ftSam/ftBox.tsx'
import { fadeInOut } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------USER------------------------------------------------------------ //
interface UserStatsProps {
	id: number
	name: string
	btnPressedName: string
	colName: string
}
const UserStats: React.FC<UserStatsProps> = ({
	id, name, btnPressedName, colName
}) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${name}-usr`

	// ----RENDER----------------------------- //
	const nameBtnContent = useMemo(() => <>
		<div className={`${boxName}-rank`}>#{id}</div>
		<div className={`${boxName}-pic`}>PP</div>
		<div className={`${boxName}-link`}>[NAME]</div>
	</>, [])

	const usrBox = useMemo(() => (nameExt: string, content: string) => <div
		className={`${colName} ${colName}-${nameExt}`}>
		{content}
	</div>, [])

	return <div className={boxName}>
		<FtBtn className={`${colName} ${colName}-name`}
			pressedName={btnPressedName}
			content={nameBtnContent}
		/>
		{usrBox('matches', '0')}
		{usrBox('wins', '0')}
		{usrBox('loses', '0')}
		{usrBox('ratio', '0')}
		{usrBox('scored', '0')}
	</div>
}

// --------BOARD----------------------------------------------------------- //
interface BoardProps {
	name: string
	btnName: string
	btnPressedName: string
}
const Board: React.FC<BoardProps> = ({ name, btnName, btnPressedName }) => {
	// ----CLASSNAMES------------------------- //
	const colName = `${name}-col`

	// ----RENDER----------------------------- //
	const headCol = useMemo(() => (nameExt: string, content: string) => (
		<FtBtn className={`${colName} ${colName}-head ${colName}-${nameExt} ${btnName}`}
			pressedName={btnPressedName}
			content={content}
		/>
	), [])

	const renderUsers = useMemo(() => Array.from({ length: 20 }, (_, index) => (
		<UserStats id={index + 1}
			key={index + 1}
			name={name}
			btnPressedName={btnPressedName}
			colName={colName}
		/>
	)), [])

	return <div className={`${name}-body`}>
		<div className={`${name}-boardHead`}>
			<div className={`${colName} ${colName}-head ${colName}-name`}>NAME</div>
			{headCol('matches', '[MATCHES]')}
			{headCol('wins', '[WINS]')}
			{headCol('loses', '[LOSES]')}
			{headCol('ratio', '[RATIO]')}
			{headCol('scored', '[SCORED]')}
		</div>
		{renderUsers}
	</div >
}

// --------LEADER---------------------------------------------------------- //
const Leader: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const name = 'leader'
	const inputName = `${name}-input`
	const btnName = `${name}-btn`
	const btnPressedName = `${btnName}--pressed`

	// ----RENDER----------------------------- //
	const headBtn = useMemo(() => (nameExt: string, content: string) => (
		<FtBtn className={`${name}-${nameExt}-btn ${btnName}`}
			pressedName={btnPressedName}
			content={content}
		/>
	), [])

	return <motion.main className={`${name} main`}
		{...fadeInOut(0.5)}	>
		<div className={`${name}-head`}>
			{headBtn('down', '[>>]')}
			{headBtn('up', '[<<]')}
			{headBtn('findMe', '[FIND ME]')}
			{headBtn('findTop', '[TOP]')}
			{headBtn('input', '[OK]')}
			<FtInput name={inputName} />
		</div>
		<Board
			name={name}
			btnName={btnName}
			btnPressedName={btnPressedName}
		/>
	</motion.main >
}
export default Leader