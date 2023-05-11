import React, { useState, useEffect, useMemo, memo } from 'react'
import { AnimatePresence, MotionProps, motion } from 'framer-motion'
import { fade, widthChangeByPx, heightChangeByPx, xMove, yMove, mergeMotions } from '../tsx-utils/ftMotion.tsx'

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
		<button className={mainBtnName}>
			{btnContent}
		</button>
		<AnimatePresence>
			{delBtn === true && (
				<motion.button className={delBtnName}
					{...xMove({ from: 30 }) as MotionProps}>
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
const Friend: React.FC<FriendProps> = memo(({ id }) => {
	// ----RENDER----------------------------- //
	const childBoxName = `${COL_NAME} ${COL_NAME}--bigFont`

	// ----RENDER----------------------------- //
	const friendBox = (content: string) => (
		<div className={childBoxName}>
			{content}
		</div>
	)

	return <motion.div className={FRIEND_NAME}
		{...yMove({ from: (100 * id) }) as MotionProps}>
		<FriendName id={id} />
		{friendBox('0')}
		{friendBox('0')}
		{friendBox('0')}
		{friendBox('0')}
		{friendBox('0')}
	</motion.div>
})

// --------FRIEND-SEARCH--------------------------------------------------- //
const FriendSearch: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [searchBtn, setSearchBtn] = useState(false)
	const [searchin, setSearchin] = useState(false)

	// ----HANDLERS--------------------------- //
	const searchBtnHdl = {
		onMouseUp: () => setSearchin(x => !x)
	}

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
		<motion.input name={inputName}
			key={inputName}
			{...xMove({ from: 50 }) as MotionProps}
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
					{...xMove({ from: 30 }) as MotionProps}>
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
})

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

	// ----RENDER----------------------------- //
	const renderFriends = Array.from({ length: count }, (_, index) => (
		<Friend key={index + 1} id={index + 1} />
	))

	const listHeadCol = (content: string) => (
		<button className={COL_NAME}>
			{content}
		</button>
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
		xMove({
			from: 100,
		})
	)

	const headInputMotion = mergeMotions(
		widthChangeByPx({ finalWidth: 325 }),
		boxMove(2)
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${FRIENDS_NAME} main`
	const headName = `${FRIENDS_NAME}-head`
	const inputName = `${FRIENDS_NAME}-add-input`
	const inputBtnName = `${inputName}-btn ${BTN_NAME}`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...fade({}) as MotionProps}>
		<motion.div className={headName}
			{...heightChangeByPx({ finalHeight: 200 }) as MotionProps}>
			<motion.button className={inputBtnName}
				{...boxMove(1) as MotionProps}>
				[ADD]
			</motion.button>
			<motion.input name={inputName} {...headInputMotion} />
		</motion.div>

		<FriendsList />
	</motion.main >
}
export default Friends