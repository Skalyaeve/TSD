import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, bouncyWidthChangeByPx, heightChangeByPx, xMove, bouncyXMove, yMove, mergeMotions, widthChange } from '../tsx-utils/ftMotion.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'profile'
const FRIEND_NAME = `${NAME}-friend`
const FRIENDS_NAME = `${FRIEND_NAME}s`
const LIST_NAME = `${FRIENDS_NAME}-list`
const COL_NAME = `${LIST_NAME}-col`
const BTN_NAME = `${FRIENDS_NAME}-btn`

// --------FRIEND-NAME----------------------------------------------------- //
interface FriendNameProps {
	id: number
}
const FriendName: React.FC<FriendNameProps> = ({ id }) => {
	// ----STATES----------------------------- //
	const [delBtn, setDelBtn] = useState(false)

	// ----ANIMATIONS------------------------- //
	const boxHdl = {
		onMouseEnter: () => setDelBtn(true),
		onMouseLeave: () => setDelBtn(false)
	}

	// ----ANIMATIONS------------------------- //
	const delbtnMotion = xMove({ from: 30, inDuration: 0.3, outDuration: 0.3 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${COL_NAME} ${BTN_NAME}`
	const mainBtnName = `${FRIEND_NAME}-name`
	const ppName = `${FRIEND_NAME}-pic`
	const linkName = `${FRIEND_NAME}-link`
	const linkFirstLineName = `${linkName}-firstLine`
	const linkSecondLineName = `${linkName}-secondLine`
	const delBtnName = `${FRIEND_NAME}-del-btn`

	// ----RENDER----------------------------- //
	const btnContent = <>
		<div className={ppName}></div>
		<div className={linkName}>
			<div className={linkFirstLineName}>
				NAME
			</div>
			<div className={linkSecondLineName}>
				online
			</div>
		</div>
	</>
	const boxContent = <>
		<div className={mainBtnName}>{btnContent}</div>
		<AnimatePresence>
			{delBtn && <motion.button
				className={delBtnName}
				{...delbtnMotion}>
				X
			</motion.button>}
		</AnimatePresence>
	</>
	return <div className={boxName} {...boxHdl}>{boxContent}</div>
}

// --------FRIEND---------------------------------------------------------- //
interface FriendProps {
	id: number
}
const Friend: React.FC<FriendProps> = ({ id }) => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 100 * id,
		inDuration: 0.6 + 0.01 * id,
		outDuration: 0.5 - 0.01 * id
	})

	// ----CLASSNAMES------------------------- //
	const childBoxName = `${COL_NAME} ${COL_NAME}--bigFont`

	// ----RENDER----------------------------- //
	const friendBox = (content: string) => <div className={childBoxName}>
		{content}
	</div>
	return <motion.div className={FRIEND_NAME} {...boxMotion}>
		<FriendName id={id} />
		{friendBox('0')}
		{friendBox('0')}
		{friendBox('0')}
		{friendBox('0')}
		{friendBox('0')}
	</motion.div>
}

// --------FRIEND-SEARCH--------------------------------------------------- //
const FriendSearch: React.FC = () => {
	// ----STATES----------------------------- //
	const [searchBtn, setSearchBtn] = useState(false)
	const [searchin, setSearchin] = useState(false)

	// ----HANDLERS--------------------------- //
	const boxHdl = {
		onMouseEnter: () => setSearchBtn(true),
		onMouseLeave: () => setSearchBtn(false)
	}
	const searchBtnHdl = { onMouseUp: () => setSearchin(x => !x) }

	// ----ANIMATIONS------------------------- //
	const movetMotion = xMove({ from: 30, inDuration: 0.3, outDuration: 0.3 })
	const inputMotion = widthChange({})
	const btnMotion = {
		...movetMotion,
		animate: {
			...movetMotion.animate,
			borderTopRightRadius: searchin ? 5 : 0,
			borderBottomRightRadius: searchin ? 5 : 0
		}
	}

	// ----CLASSNAMES------------------------- //
	const searchName = `${FRIENDS_NAME}-search`
	const searchBtnName = `${searchName}-btn`
	const inputName = `${searchName}-input`

	// ----RENDER----------------------------- //
	const childBtnContent = (!searchin ?
		<div className={searchName}>NAME</div>
		:
		<motion.input
			className={inputName}
			key={inputName}
			{...inputMotion}
		/>
	)
	const boxContent = <>
		<AnimatePresence>{childBtnContent}</AnimatePresence>
		<AnimatePresence>
			{(searchBtn || searchin) && <motion.button
				className={searchBtnName}
				{...searchBtnHdl}
				{...btnMotion}>
				{searchin ? 'X' : 'S'}
			</motion.button>}
		</AnimatePresence>
	</>
	return <div className={COL_NAME} {...boxHdl}>{boxContent}</div>
}

// --------FRIENDS-LIST---------------------------------------------------- //
const FriendsList: React.FC = () => {
	// ----STATES----------------------------- //
	const [count, setCount] = useState(20)

	// ----CLASSNAMES------------------------- //
	const listHeadName = `${LIST_NAME}-head`
	const headColName = `${COL_NAME} ${BTN_NAME}`

	// ----RENDER----------------------------- //
	const renderFriends = Array.from({ length: count }, (_, index) =>
		<Friend key={index + 1} id={index + 1} />
	)
	const listHeadCol = (content: string) => <div className={headColName}>
		{content}
	</div>
	return <div className={LIST_NAME}>
		<div className={listHeadName}>
			<FriendSearch />
			{listHeadCol('MATCHES')}
			{listHeadCol('WINS')}
			{listHeadCol('LOSES')}
			{listHeadCol('RATIO')}
			{listHeadCol('RANKING')}
		</div>
		{renderFriends}
	</div>
}

// --------FRIENDS--------------------------------------------------------- //
const Friends: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMove = (index: number) => bouncyXMove({
		from: 100,
		extra: -10,
		inDuration: 0.8 + 0.01 * index,
		outDuration: 0.5 - 0.01 * index
	})
	const boxMotion = fade({ inDuration: 1 })
	const headMotion = heightChangeByPx({ finalHeight: 200, inDuration: 0.6 })
	const headInputMotion = mergeMotions(
		bouncyWidthChangeByPx({ finalWidth: 325, inDuration: 1 }),
		boxMove(6)
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${FRIENDS_NAME} main`
	const headName = `${FRIENDS_NAME}-head`
	const inputName = `${FRIENDS_NAME}-add-input`
	const inputBtnName = `${inputName}-btn`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName} {...boxMotion}>
		<motion.div className={headName} {...headMotion}>
			<motion.button className={inputBtnName} {...boxMove(1)}>
				ADD
			</motion.button>
			<motion.input className={inputName} {...headInputMotion} />
		</motion.div>
		<FriendsList />
	</motion.main >
}
export default Friends