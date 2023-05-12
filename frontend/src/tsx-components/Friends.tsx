import React, { useState, useEffect, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, bouncyWidthChangeByPx, heightChangeByPx, xMove, bouncyXMove, yMove, mergeMotions } from '../tsx-utils/ftMotion.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'profile'
const FRIEND_NAME = `${NAME}-friend`
const FRIENDS_NAME = `${FRIEND_NAME}s`
const LIST_NAME = `${FRIENDS_NAME}-list`
const COL_NAME = `${LIST_NAME}-col`
const BTN_NAME = `${NAME}-btn`

// --------FRIEND-NAME----------------------------------------------------- //
interface FriendNameProps {
	id: number
}
const FriendName: React.FC<FriendNameProps> = ({ id }) => {
	// ----STATES----------------------------- //
	const [delBtn, setDelBtn] = useState(false)

	// ----ANIMATIONS------------------------- //
	const delbtnMotion = xMove({
		from: 30,
		inDuration: 0.3,
		outDuration: 0.3
	})

	// ----CLASSNAMES------------------------- //
	const mainBtnName = `${FRIEND_NAME}-name`
	const ppName = `${FRIEND_NAME}-pic`
	const linkName = `${FRIEND_NAME}-link`
	const delBtnName = `${FRIEND_NAME}-del-btn ${BTN_NAME}`

	// ----RENDER----------------------------- //
	const btnContent = useMemo(() => <>
		<div className={ppName}>PP</div>
		<div className={linkName}>[FRIEND #{id}]<br />online</div>
	</>, [])
	const boxContent = <>
		<div className={mainBtnName}>
			{btnContent}
		</div>
		<AnimatePresence>
			{delBtn === true && (
				<motion.button className={delBtnName}
					{...delbtnMotion}>
					[X]
				</motion.button>
			)}
		</AnimatePresence>
	</>
	return <div className={COL_NAME}
		onMouseEnter={() => setDelBtn(true)}
		onMouseLeave={() => setDelBtn(false)}>
		{boxContent}
	</div>
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
	const friendBox = (content: string) => (
		<div className={childBoxName}>
			{content}
		</div>
	)
	return <motion.div className={FRIEND_NAME}
		{...boxMotion}>
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
	const searchBtnHdl = { onMouseUp: () => setSearchin(x => !x) }

	// ----ANIMATIONS------------------------- //
	const childMotion = xMove({
		from: 30,
		inDuration: 0.3,
		outDuration: 0.3
	})

	// ----CLASSNAMES------------------------- //
	const searchName = `${FRIENDS_NAME}-search`
	const searchBtnName = `${searchName}-btn ${BTN_NAME}`
	const inputName = `${searchName}-input`

	// ----RENDER----------------------------- //
	const childBtnContent = (!searchin ?
		<div className={searchName}>
			[NAME]
		</div>
		:
		<motion.input className={inputName}
			key={inputName}
			{...childMotion}
		/>
	)
	const boxContent = <>
		<AnimatePresence>
			{childBtnContent}
		</AnimatePresence>
		<AnimatePresence>
			{(searchBtn || searchin) && (
				<motion.button className={searchBtnName}
					{...searchBtnHdl}
					{...childMotion}>
					{searchin ? '[X]' : '[S]'}
				</motion.button>
			)}
		</AnimatePresence>
	</>
	return <div className={COL_NAME}
		onMouseEnter={() => setSearchBtn(true)}
		onMouseLeave={() => setSearchBtn(false)}>
		{boxContent}
	</div>
}

// --------FRIENDS-LIST---------------------------------------------------- //
const FriendsList: React.FC = () => {
	// ----STATES----------------------------- //
	const [count, setCount] = useState(20)
	const [animating, setAnimating] = useState(true)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const timer = setTimeout(() => setAnimating(false), 1000)
		return () => clearTimeout(timer)
	}, [])

	// ----CLASSNAMES------------------------- //
	const listHeadName = `${LIST_NAME}-head`
	const headColName = `${COL_NAME} ${BTN_NAME}`

	// ----RENDER----------------------------- //
	const renderFriends = useMemo(() => (
		Array.from({ length: count }, (_, index) => (
			<Friend key={index + 1} id={index + 1} />
		))
	), [])
	const listHeadCol = (content: string) => (
		<div className={headColName}>
			{content}
		</div>
	)
	return <motion.div className={LIST_NAME}
		exit={{ overflowY: 'hidden' }}
		style={{ overflowY: (animating ? 'hidden' : 'auto') }}>
		<div className={listHeadName}>
			<FriendSearch />
			{listHeadCol('[MATCHES]')}
			{listHeadCol('[WINS]')}
			{listHeadCol('[LOSES]')}
			{listHeadCol('[RATIO]')}
			{listHeadCol('[SCORED]')}
		</div>
		{renderFriends}
	</motion.div>
}

// --------FRIENDS--------------------------------------------------------- //
const Friends: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMove = (index: number) => (
		bouncyXMove({
			from: 100,
			extra: -10,
			inDuration: 0.8 + 0.01 * index,
			outDuration: 0.5 - 0.01 * index
		})
	)
	const boxMotion = fade({ inDuration: 1 })
	const headMotion = heightChangeByPx({
		finalHeight: 200,
		inDuration: 0.6
	})
	const headInputMotion = mergeMotions(
		bouncyWidthChangeByPx({ finalWidth: 325, inDuration: 1 }),
		boxMove(6)
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${FRIENDS_NAME} main`
	const headName = `${FRIENDS_NAME}-head`
	const inputName = `${FRIENDS_NAME}-add-input`
	const inputBtnName = `${inputName}-btn ${BTN_NAME}`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...boxMotion}>
		<motion.div className={headName}
			{...headMotion}>
			<motion.button className={inputBtnName}
				{...boxMove(1)}>
				[ADD]
			</motion.button>
			<motion.input className={inputName}
				{...headInputMotion}
			/>
		</motion.div>
		<FriendsList />
	</motion.main >
}
export default Friends