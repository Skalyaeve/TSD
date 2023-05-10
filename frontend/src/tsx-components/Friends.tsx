import React, { useState, useEffect, useMemo, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { tglOnUp, tglOnOver } from '../tsx-utils/ftHooks.tsx'
import { FtDiv, FtBtn, FtInput, FtMotionDiv, FtMotionBtn, FtMotionInput } from '../tsx-utils/ftBox.tsx'
import { fade, bouncyWidthChangeByPx, heightChangeByPx, bouncyXMove, yMove, mergeMotions, xMove } from '../tsx-utils/ftFramerMotion.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'profile'
const FRIEND_NAME = `${NAME}-friend`
const FRIENDS_NAME = `${FRIEND_NAME}s`
const LIST_NAME = `${FRIENDS_NAME}-list`
const COL_NAME = `${LIST_NAME}-col`
const BTN_NAME = `${NAME}-btn`
const PRESSED_NAME = `${BTN_NAME}--pressed`

// --------FRIEND-NAME----------------------------------------------------- //
interface FriendNameProps {
	id: number
}
const FriendName: React.FC<FriendNameProps> = ({ id }) => {
	// ----STATES----------------------------- //
	const [delBtn, toggleDelBtn] = tglOnOver(false)

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
		<FtBtn className={mainBtnName}
			pressedName={PRESSED_NAME}
			content={btnContent}
		/>
		<AnimatePresence>
			{delBtn === true && <FtMotionBtn className={delBtnName}
				pressedName={PRESSED_NAME}
				motionProps={xMove({ from: 30, inDuration: 0.25 })}
				content='[X]'
			/>}
		</AnimatePresence>
	</>

	return <FtDiv className={COL_NAME}
		handler={toggleDelBtn}
		content={boxContent}
	/>
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
		{...yMove({ from: (100 * id), inDuration: 1, outDuration: 0.5 })}>
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
	const [searchBtn, toggleSearchBtn] = tglOnOver(false)
	const [searchin, toggleSearchin] = tglOnUp(false)

	// ----CLASSNAMES------------------------- //
	const searchName = `${FRIENDS_NAME}-search`
	const searchBtnName = `${searchName}-btn ${BTN_NAME}`
	const inputName = `${searchName}-input`

	// ----RENDER----------------------------- //
	const childBtnContent = (!searchin ?
		<FtDiv className={searchName}
			pressedName={PRESSED_NAME}
			content='[NAME]'
		/>
		:
		<FtInput name={inputName} />
	)

	const boxContent = <>
		{childBtnContent}
		<AnimatePresence>
			{(searchBtn || searchin) && <FtMotionDiv className={searchBtnName}
				pressedName={PRESSED_NAME}
				handler={toggleSearchin}
				motionProps={xMove({ from: 30, inDuration: 0.25 })}
				content={searchin ? '[X]' : '[S]'}
			/>}
		</AnimatePresence>
	</>

	return <FtDiv className={COL_NAME}
		handler={toggleSearchBtn}
		content={boxContent}
	/>
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
		<FtBtn className={COL_NAME}
			pressedName={PRESSED_NAME}
			content={content}
		/>
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
// - React.memo() utilisé ici à cause de framer-motion                    - //
// ------------------------------------------------------------------------ //
const Friends: React.FC = memo(() => {
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
		boxMove(2)
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${FRIENDS_NAME} main`
	const headName = `${FRIENDS_NAME}-head`
	const inputName = `${FRIENDS_NAME}-add-input`
	const inputBtnName = `${inputName}-btn ${BTN_NAME}`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...fade({ inDuration: 1, outDuration: 0.5 })}>
		<motion.div className={headName}
			{...heightChangeByPx({ finalHeight: 200 })}>
			<FtMotionBtn className={inputBtnName}
				pressedName={PRESSED_NAME}
				motionProps={boxMove(1)}
				content='[ADD]'
			/>

			<FtMotionInput name={inputName}
				motionProps={headInputMotion}
			/>
		</motion.div>

		<FriendsList />
	</motion.main >
})
export default Friends