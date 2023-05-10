import React from 'react'
import { motion } from 'framer-motion'

import { FtBtn, FtMotionBtn, FtMotionInput } from '../tsx-utils/ftBox.tsx'
import { fade, bouncyWidthChangeByPx, heightChangeByPx, bouncyXMove, yMove, mergeMotions } from '../tsx-utils/ftFramerMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const USERS_COUNT = 20

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
		{...yMove({ from: (100 * rank), inDuration: 1, outDuration: 0.5 })}>

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
	const headName = `${NAME}-boardHead`

	// ----RENDER----------------------------- //
	const renderUsers = Array.from({ length: USERS_COUNT }, (_, index) => (
		<UserStats key={index} rank={index + 1} />
	))

	const headCol = (content: string) => (
		<FtBtn className={COL_NAME}
			pressedName={PRESSED_NAME}
			content={content}
		/>
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
		bouncyXMove({
			from: 100,
			extra: -20,
			inDuration: 1 + 0.07 * index,
			outDuration: 0.3 + 0.035 * index
		})
	)

	const headInputMotion = mergeMotions(
		bouncyWidthChangeByPx({
			finalWidth: 325,
			inDuration: 1 + 0.07 * 5,
			outDuration: 0.3 + 0.035 * 5
		}),
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
		<FtMotionBtn className={headBtnName(nameExt)}
			pressedName={PRESSED_NAME}
			motionProps={boxMove(index)}
			content={content}
		/>
	)

	return <motion.main className={boxName}
		{...fade({ inDuration: 1, outDuration: 0.5 })}>

		<motion.div className={headName}
			{...heightChangeByPx({ finalHeight: 200 })}>

			{headBtn(0, 'down', '[>>]')}
			{headBtn(1, 'up', '[<<]')}
			{headBtn(2, 'findMe', '[FIND ME]')}
			{headBtn(3, 'findTop', '[TOP]')}
			{headBtn(4, 'input', '[OK]')}
			<FtMotionInput name={inputName}
				motionProps={headInputMotion}
			/>
		</motion.div>

		<div className={bodyName}>
			<Board />
		</div>
	</motion.main >
}
export default Leader