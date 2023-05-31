import React from 'react'
import { motion } from 'framer-motion'
import { fade, bouncyWidthChangeByPx, heightChangeByPx, bouncyXMove, yMove, mergeMotions } from '../tsx-utils/ftMotion.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'leader'
const COL_NAME = `${NAME}-col`
const BTN_NAME = `${NAME}-btn`
const COL_BTN_NAME = `${COL_NAME} ${BTN_NAME}`

// --------USER------------------------------------------------------------ //
interface UserStatsProps {
	rank: number
}
const UserStats: React.FC<UserStatsProps> = ({ rank }) => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 100 * rank,
		inDuration: 0.6 + 0.01 * rank,
		outDuration: 0.5 - 0.01 * rank
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-usr`
	const rankName = `${boxName}-rank`
	const ppName = `${boxName}-pic`
	const linkName = `${boxName}-link`
	const colName = `${COL_NAME} ${COL_NAME}--bigFont`

	// ----RENDER----------------------------- //
	const nameBtnContent = <>
		<div className={rankName}>#{rank}</div>
		<div className={ppName}></div>
		<div className={linkName}>NAME</div>
	</>
	const usrBox = (content: string) => <div className={colName}>
		{content}
	</div>
	return <motion.div className={boxName} {...boxMotion}>
		<div className={COL_BTN_NAME}>{nameBtnContent}</div>
		{usrBox('0')}
		{usrBox('0')}
		{usrBox('0')}
		{usrBox('0')}
		{usrBox('0')}
	</motion.div>
}

// --------BOARD----------------------------------------------------------- //
const Board: React.FC = () => {
	// ----VALUES----------------------------- //
	const count = 20

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-body`
	const headName = `${NAME}-boardHead`

	// ----RENDER----------------------------- //
	const renderUsers = Array.from({ length: count }, (_, index) =>
		<UserStats key={index} rank={index + 1} />
	)
	const headCol = (content: string) => <div className={COL_BTN_NAME}>
		{content}
	</div>
	return <div className={boxName}>
		<div className={headName}>
			<div className={COL_NAME}>NAME</div>
			{headCol('MATCHES')}
			{headCol('WINS')}
			{headCol('LOSES')}
			{headCol('RATIO')}
			{headCol('RANKING')}
		</div>
		{renderUsers}
	</div>
}

// --------LEADER---------------------------------------------------------- //
const Leader: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMove = (index: number) => bouncyXMove({
		from: 100 * index,
		extra: -10,
		inDuration: 0.8 + 0.02 * index,
		outDuration: 0.5 - 0.01 * index
	})
	const boxMotion = fade({ inDuration: 1 })
	const headMotion = heightChangeByPx({ finalHeight: 200, inDuration: 0.6 })
	const headInputMotion = mergeMotions(
		bouncyWidthChangeByPx({ finalWidth: 325, inDuration: 1 }),
		boxMove(6)
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME} main`
	const inputName = `${NAME}-input`
	const headName = `${NAME}-head`
	const headBtnName = (nameExt: string) => (
		`${NAME}-${nameExt}-btn ${BTN_NAME}`
	)

	// ----RENDER----------------------------- //
	const headBtn = (index: number, nameExt: string, content: string) => (
		<motion.button className={headBtnName(nameExt)} {...boxMove(index)}>
			{content}
		</motion.button>
	)
	return <motion.main className={boxName} {...boxMotion}>
		<motion.div className={headName} {...headMotion}>
			{headBtn(1, 'down', '>>')}
			{headBtn(2, 'up', '<<')}
			{headBtn(3, 'findMe', 'FIND ME')}
			{headBtn(4, 'findTop', 'TOP')}
			{headBtn(5, 'input', 'OK')}
			<motion.input
				className={inputName}
				placeholder='...'
				{...headInputMotion}
			/>
		</motion.div>
		<Board />
	</motion.main >
}
export default Leader