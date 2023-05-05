import React from 'react'
import { motion } from 'framer-motion'

import { FtBtn, FtInput } from '../tsx-utils/ftSam/ftBox.tsx'
import { fadeInOut, comeFromCol, heightGrow } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'leader'
const COL_NAME = `${NAME}-col`
const BTN_NAME = `${NAME}-btn`
const PRESSED_NAME = `${BTN_NAME}--pressed`

// --------USER------------------------------------------------------------ //
interface UserStatsProps {
	rank: number
}
const UserStats: React.FC<UserStatsProps> = ({ rank }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-usr`
	const rankName = `${boxName}-rank`
	const ppName = `${boxName}-pic`
	const linkName = `${boxName}-link`
	const colName = `${COL_NAME} ${COL_NAME}--bigFont`

	// ----RENDER----------------------------- //
	const nameBtnContent = <>
		<div className={rankName}>#{rank}</div>
		<div className={ppName}>PP</div>
		<div className={linkName}>[NAME]</div>
	</>

	const usrBox = (content: string) => (
		<div className={colName}>
			{content}
		</div>
	)

	return <motion.div className={boxName}
		{...comeFromCol((200 * rank), 'easeOut', 'easeIn', 1)}>
		<FtBtn className={COL_NAME}
			pressedName={PRESSED_NAME}
			content={nameBtnContent}
		/>
		{usrBox('0')}
		{usrBox('0')}
		{usrBox('0')}
		{usrBox('0')}
		{usrBox('0')}
	</motion.div>
}

// --------BOARD----------------------------------------------------------- //
const Board: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-body`
	const headName = `${NAME}-boardHead`
	const headColName = `${COL_NAME} ${BTN_NAME}`

	// ----RENDER----------------------------- //
	const headCol = (content: string) => (
		<FtBtn className={headColName}
			pressedName={PRESSED_NAME}
			content={content}
		/>
	)

	const renderUsers = Array.from({ length: 20 }, (_, index) => (
		<UserStats key={index} rank={index + 1} />
	))

	return <div className={boxName}>
		<div className={headName}>
			<div className={COL_NAME}>NAME</div>
			{headCol('[MATCHES]')}
			{headCol('[WINS]')}
			{headCol('[LOSES]')}
			{headCol('[RATIO]')}
			{headCol('[SCORED]')}
		</div>
		{renderUsers}
	</div>
}

// --------LEADER---------------------------------------------------------- //
const Leader: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME} main`
	const headName = `${NAME}-head`
	const inputName = `${NAME}-input`
	const headBtnName = (nameExt: string) => `${NAME}-${nameExt}-btn ${BTN_NAME}`

	// ----RENDER----------------------------- //
	const headBtn = (nameExt: string, content: string) => (
		<FtBtn className={headBtnName(nameExt)}
			pressedName={PRESSED_NAME}
			content={content}
		/>
	)

	return <motion.main className={boxName}
		{...fadeInOut('easeInOut', 'easeInOut', 0.5)}>
		<motion.div className={headName}
			{...heightGrow()}>
			{headBtn('down', '[>>]')}
			{headBtn('up', '[<<]')}
			{headBtn('findMe', '[FIND ME]')}
			{headBtn('findTop', '[TOP]')}
			{headBtn('input', '[OK]')}
			<FtInput name={inputName} />
		</motion.div>
		<Board />
	</motion.main >
}
export default Leader