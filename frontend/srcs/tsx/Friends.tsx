import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, bouncyWidthChangeByPx, heightChangeByPx, xMove, bouncyXMove, yMove, mergeMotions, widthChange } from './utils/ftMotion.tsx'
import { ftFetch } from './Root.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'profile'
const FRIEND_NAME = `${NAME}-friend`
const FRIENDS_NAME = `${FRIEND_NAME}s`
const LIST_NAME = `${FRIENDS_NAME}-list`
const COL_NAME = `${LIST_NAME}-col`

// --------FRIEND-NAME----------------------------------------------------- //
interface FriendNameProps { id: number }
const FriendName: React.FC<FriendNameProps> = ({ id }) => {
	// ----STATES----------------------------- //
	const [delBtn, setDelBtn] = useState(false)
	const [overTxt, setOverTxt] = useState(false)

	// ----ANIMATIONS------------------------- //
	const boxHdl = {
		onMouseEnter: () => {
			setDelBtn(true)
			setOverTxt(true)
		},
		onMouseLeave: () => {
			setDelBtn(false)
			setOverTxt(false)
		}
	}
	const delBtnHdl = {
		onMouseEnter: () => setOverTxt(false),
		onMouseLeave: () => setOverTxt(true)
	}

	// ----ANIMATIONS------------------------- //
	const delbtnMotion = {
		...xMove({ from: 30, inDuration: 0.3, outDuration: 0.3 }),
		whileHover: { scale: 1.05 }
	}
	const txtMotion = {
		animate: overTxt ? { textShadow: '0px 0px 4px white' } : {}
	}

	// ----CLASSNAMES------------------------- //
	const ppName = `${FRIEND_NAME}-pic`
	const linkName = `${FRIEND_NAME}-link`
	const delBtnName = `${FRIEND_NAME}-del-btn`

	// ----RENDER----------------------------- //
	const boxContent = <>
		<div className={ppName} />
		<motion.div className={linkName} {...txtMotion}>
			NAME
		</motion.div>
		<AnimatePresence>
			{delBtn && <motion.button
				className={delBtnName}
				{...delBtnHdl}
				{...delbtnMotion}
			/>}
		</AnimatePresence>
	</>
	return <div className={COL_NAME} {...boxHdl}>{boxContent}</div>
}

// --------FRIEND---------------------------------------------------------- //
interface FriendProps {
	id: number
	friend: any
}
const Friend: React.FC<FriendProps> = ({ id, friend }) => {
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
	const inputMotion = widthChange({})
	const btnMotion = {
		...xMove({ from: 30, inDuration: 0.3, outDuration: 0.3 }),
		whileHover: { scale: 1.05 }
	}

	// ----CLASSNAMES------------------------- //
	const searchName = `${FRIENDS_NAME}-search`
	const searchBtnName = searchin ?
		`${searchName}-btn ${searchName}-btn--active`
		: `${searchName}-btn`
	const inputName = `${searchName}-input`

	// ----RENDER----------------------------- //
	const childBtnContent = (!searchin ?
		<div className={searchName}>NAME</div>
		:
		<motion.input
			className={inputName}
			key={inputName}
			placeholder='user search'
			{...inputMotion}
		/>
	)
	const boxContent = <>
		<AnimatePresence>{childBtnContent}</AnimatePresence>
		<AnimatePresence>
			{(searchBtn || searchin) && <motion.button
				className={searchBtnName}
				{...searchBtnHdl}
				{...btnMotion}
			/>}
		</AnimatePresence>
	</>
	return <div className={COL_NAME} {...boxHdl}>{boxContent}</div>
}

// --------FRIENDS-LIST---------------------------------------------------- //
interface FriendsListProps { friends: any }
const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
	// ----VALUES----------------------------- //
	const data = Object.entries(friends)

	// ----CLASSNAMES------------------------- //
	const listHeadName = `${LIST_NAME}-head`
	const noFriendsTxtName = `${FRIENDS_NAME}-noFriends-txt`

	// ----RENDER----------------------------- //
	const renderFriends = Array.from({ length: friends.lenght }, (_, index) =>
		<Friend key={index + 1} id={index + 1} friend={data[index]} />
	)
	return <div className={LIST_NAME}>
		<div className={listHeadName}>
			<FriendSearch />
			<div className={COL_NAME}>MATCHES</div>
			<div className={COL_NAME}>WINS</div>
			<div className={COL_NAME}>LOSES</div>
			<div className={COL_NAME}>RATIO</div>
			<div className={COL_NAME}>RANKING</div>
		</div>
		{renderFriends}
		{!friends.lenght && <div className={noFriendsTxtName}>
			this is empty
		</div>}
	</div>
}

// --------FRIENDS--------------------------------------------------------- //
interface FriendsProps {
	userID: number
	users: React.MutableRefObject<any>
	updateUsers: () => Promise<void>
}
const Friends: React.FC<FriendsProps> = ({ userID, users, updateUsers }) => {
	// ----STATES----------------------------- //
	const [friends, setFriends] = useState<any>({})
	const [inputValue, setInputValue] = useState('')
	const [formLog, setFormLog] = useState('')

	// ----EFFECTS---------------------------- //
	useEffect(() => { updateUsers() }, [])

	useEffect(() => {
		if (!userID) return

		const fetchData = async () => {
			let data = await ftFetch(`/users/me/friends`)
			setFriends(data)
		}
		fetchData()
	}, [userID])

	// ----HANDLES---------------------------- //
	const formHdl = {
		onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			addFriend()
		}
	}
	const inputHdl = {
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value)
		}
	}
	const addFriend = async () => {
		let user
		for (let x in users.current) {
			if (users.current[x].nickname === inputValue) {
				user = users.current[x]
				break
			}
		}
		if (user === undefined) { setFormLog('user not found') }
		else {
			let answ = await ftFetch(`/users/me/friends/${user.id}`, 'POST')
			if (answ.statusCode === 409) setFormLog('already sent')
			else if (!answ.requester) setFormLog('unknow error')
			else if (answ.requester === userID) setFormLog('request sent')
			else setFormLog('unknow error')
		}
		const timer = setTimeout(() => { setFormLog('') }, 2000)
		return () => clearTimeout(timer)
	}

	// ----ANIMATIONS------------------------- //
	const boxMove = (index: number) => bouncyXMove({
		from: 100,
		extra: -10,
		inDuration: 0.8 + 0.01 * index,
		outDuration: 0.5 - 0.01 * index
	})
	const boxMotion = fade({ inDuration: 1 })
	const headMotion = heightChangeByPx({ finalHeight: 200, inDuration: 0.6 })
	const headBtnMotion = (index: number) => ({
		...boxMove(index),
		whileHover: { scale: 1.05 }
	})
	const inputMotion = mergeMotions(
		bouncyWidthChangeByPx({ finalWidth: 325, inDuration: 1 }),
		boxMove(6)
	)
	const submitTxtMotion = xMove({ from: -30, inDuration: 0.3, outDuration: 0.3 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${FRIENDS_NAME} main`
	const headName = `${FRIENDS_NAME}-head`
	const inputName = `${FRIENDS_NAME}-add-input`
	const inputBtnName = `${inputName}-btn`
	const submitTxtName = `${inputName}-submit-txt${(
		formLog === 'request sent' ? ` ${inputName}-submit-txt--green` : ''
	)}`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName} {...boxMotion}>
		<motion.div className={headName} {...headMotion}>
			<form {...formHdl}>
				<motion.input
					className={inputName}
					placeholder='add new friend'
					value={inputValue}
					{...inputHdl}
					{...inputMotion}
				/>
				<motion.button
					type='submit'
					className={inputBtnName}
					{...headBtnMotion(1)}>
					ADD
				</motion.button>
			</form>
			<AnimatePresence>
				{formLog.length !== 0 && <motion.div
					className={submitTxtName}
					{...submitTxtMotion}>
					{formLog}
				</motion.div>}
			</AnimatePresence>
		</motion.div>
		<FriendsList friends={friends} />
	</motion.main >
}
export default Friends
