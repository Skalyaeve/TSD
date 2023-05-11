import React from 'react'
import { MotionProps, motion } from 'framer-motion'
import { fade, widthChangeByPx, heightChangeByPx, xMove, yMove, mergeMotions } from '../tsx-utils/ftMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const USERS_COUNT = 20

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'leader'
const COL_NAME = `${NAME}-col`
const BTN_NAME = `${NAME}-btn`

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
		{...yMove({ from: (100 * rank) }) as MotionProps}>

		<button className={COL_NAME}>
			{nameBtnContent}
		</button>
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
	const headName = `${NAME}-boardHead`

	// ----RENDER----------------------------- //
	const renderUsers = Array.from({ length: USERS_COUNT }, (_, index) => (
		<UserStats key={index} rank={index + 1} />
	))
	const headCol = (content: string) => (
		<button className={COL_NAME}>
			{content}
		</button>
	)
	return <>
		<div className={headName}>
			<div className={COL_NAME}>NAME</div>
			{headCol('[MATCHES]')}
			{headCol('[WINS]')}
			{headCol('[LOSES]')}
			{headCol('[RATIO]')}
			{headCol('[SCORED]')}
		</div>
		{renderUsers}
	</>
}

// --------LEADER---------------------------------------------------------- //
const Leader: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMove = (index: number) => (
		xMove({ from: 100 * index })
	)
	const headInputMotion = mergeMotions(
		widthChangeByPx({ finalWidth: 325 }),
		boxMove(5)
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME} main`
	const headName = `${NAME}-head`
	const inputName = `${NAME}-input`
	const headBtnName = (nameExt: string) => `${NAME}-${nameExt}-btn ${BTN_NAME}`
	const bodyName = `${NAME}-body`

	// ----RENDER----------------------------- //
	const headBtn = (index: number, nameExt: string, content: string) => (
		<motion.button className={headBtnName(nameExt)}
			{...boxMove(index) as MotionProps}>
			{content}
		</motion.button>
	)
	return <motion.main className={boxName}
		{...fade({}) as MotionProps}>
		<motion.div className={headName}
			{...heightChangeByPx({ finalHeight: 200 }) as MotionProps}>
			{headBtn(0, 'down', '[>>]')}
			{headBtn(1, 'up', '[<<]')}
			{headBtn(2, 'findMe', '[FIND ME]')}
			{headBtn(3, 'findTop', '[TOP]')}
			{headBtn(4, 'input', '[OK]')}
			<motion.input name={inputName}
				placeholder=' ...'
				{...headInputMotion}
			/>
		</motion.div>

		<div className={bodyName}>
			<Board />
		</div>
	</motion.main >
}
export default Leader