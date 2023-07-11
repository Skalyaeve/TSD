import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, bouncyWidthChangeByPx, heightChangeByPx, bouncyXMove, yMove, mergeMotions, xMove } from './utils/ftMotion.tsx'
import { ftFetch } from './Root.tsx'
import { Link } from 'react-router-dom'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'leader'
const COL_NAME = `${NAME}-col`
const BTN_NAME = `${NAME}-btn`

// --------USER------------------------------------------------------------ //
interface UserStatsProps {
	rank: number
	userID: number
	usr: any
}
const UserStats: React.FC<UserStatsProps> = ({ rank, usr, userID }) => {
	// ----VALUES----------------------------- //
	const ppURI = '/user/profile-picture'
	const profilePictureURI = `url('${ppURI}/${usr.avatarFilename}')`

	// ----STATES----------------------------- //
	const [over, setOver] = useState(false)
	const [games, setGames] = useState(0)
	const [winz, setWinz] = useState(0)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const fetchData = async () => {
			let data = await ftFetch(`/games/${usr.id}/count`)
			setGames(data)
			data = await ftFetch(`/games/${usr.id}/victories`)
			setWinz(data.length)
		}
		fetchData()
	}, [])

	// ----HANDLERS--------------------------- //
	const nameBoxHdl = {
		onMouseEnter: () => setOver(true),
		onMouseLeave: () => setOver(false)
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 100 * rank,
		inDuration: 0.6 + 0.01 * rank,
		outDuration: 0.5 - 0.01 * rank
	})
	const nameMotion = { animate: over ? { textShadow: '0px 0px 4px white' } : {} }

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-usr`
	const rankName = `${boxName}-rank`
	const ppName = `${boxName}-pic`
	const linkName = `${boxName}-link`
	const colName = `${COL_NAME} ${COL_NAME}--bigFont`

	// ----RENDER----------------------------- //
	const nameBtnContent = <>
		<div className={rankName}>#{rank}</div>
		<div className={ppName} style={{ backgroundImage: profilePictureURI }} />
		<motion.div className={linkName} {...nameMotion}>
			{usr.nickname}
		</motion.div>
	</>
	const usrBox = (content: string) => <div className={colName}>
		{content}
	</div>
	return <motion.div className={boxName} {...boxMotion}>
		<Link
			to={`/profile${usr.id !== userID ? `/${usr.id}` : ''}`}
			className={COL_NAME}
			{...nameBoxHdl}>
			{nameBtnContent}
		</Link>
		{usrBox(`${games}`)}
		{usrBox(`${winz}`)}
		{usrBox(`${games - winz}`)}
		{usrBox(`${winz / games * 100}%`)}
		{usrBox(`${usr.rankPoints}`)}
	</motion.div>
}

// --------BOARD----------------------------------------------------------- //
interface BoardProps {
	data: any[]
	from: number
	userID: number
}
const Board: React.FC<BoardProps> = ({ data, from, userID }) => {
	// ----VALUES----------------------------- //
	let count = data.length < 20 ? data.length : 20
	if (from + count > data.length) from = data.length - count

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-body`
	const headName = `${NAME}-boardHead`

	// ----RENDER----------------------------- //
	const renderUsers = Array.from({ length: count }, (_, index) =>
		<UserStats
			key={index}
			rank={from + index + 1}
			usr={data[from + index]}
			userID={userID}
		/>
	)
	return <div className={boxName}>
		<div className={headName}>
			<div className={COL_NAME}>NAME</div>
			<div className={COL_NAME}>MATCHES</div>
			<div className={COL_NAME}>WINS</div>
			<div className={COL_NAME}>LOSES</div>
			<div className={COL_NAME}>RATIO</div>
			<div className={COL_NAME}>RANKING</div>
		</div>
		{renderUsers}
	</div>
}

// --------LEADER---------------------------------------------------------- //
interface LeaderProps {
	userID: number
	users: React.MutableRefObject<any>
	updateUsers: () => Promise<void>
}
const Leader: React.FC<LeaderProps> = ({ userID, users, updateUsers }) => {
	// ----VALUES----------------------------- //
	let data = Array()
	let myRank = 0
	if (users.current) {
		for (let x in users.current) {
			data.push(users.current[x])
		}
		data.sort((a, b) => b.rankPoints - a.rankPoints)
		for (let x in data) {
			if (data[x].id === userID) {
				myRank = Number(x)
				break
			}
		}
	}

	// ----STATES----------------------------- //
	const [from, setFrom] = useState(0)
	const [inputValue, setInputValue] = useState('')
	const [formLog, setFormLog] = useState('')

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		updateUsers()
	}, [])

	// ----HANDLERS--------------------------- //
	const downBtnHdl = {
		onMouseUp: () => setFrom(x => (
			x + 20 < data.length - 20 ?
				x + 20
				:
				data.length - 20 < 0 ? 0 : data.length - 20
		))
	}
	const upBtnHdl = {
		onMouseUp: () => setFrom(x => (x - 20 >= 0 ? x - 20 : 0))
	}
	const findMeBtnHdl = {
		onMouseUp: () => setFrom(myRank - 10 >= 0 ? myRank - 10 : 0)
	}
	const findTopBtnHdl = { onMouseUp: () => setFrom(0) }
	const formHdl = {
		onSubmit: (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			searchUser(inputValue)
		}
	}
	const inputHdl = {
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value)
		}
	}
	const searchUser = (username: string) => {
		const ret = data.findIndex((x) => x.nickname === username)
		if (ret) console.log(ret)
		if (ret < 0) { setFormLog('user not found') }
		else {
			setFrom(ret - 10 >= 0 ? ret - 10 : 0)
			setFormLog('user found')
		}
		const timer = setTimeout(() => { setFormLog('') }, 2000)
		return () => clearTimeout(timer)
	}

	// ----ANIMATIONS------------------------- //
	const boxMove = (index: number) => bouncyXMove({
		from: 100 * index,
		extra: -10,
		inDuration: 0.8 + 0.02 * index,
		outDuration: 0.5 - 0.01 * index
	})
	const boxMotion = fade({ inDuration: 1 })
	const headMotion = heightChangeByPx({ finalHeight: 200, inDuration: 0.6 })
	const headBtnMotion = (index: number) => ({
		...boxMove(index),
		whileHover: { scale: 1.05 }
	})
	const headInputMotion = mergeMotions(
		bouncyWidthChangeByPx({ finalWidth: 325, inDuration: 1 }),
		boxMove(6)
	)
	const submitTxtMotion = xMove({ from: -30, inDuration: 0.3, outDuration: 0.3 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME} main`
	const inputName = `${NAME}-input`
	const headName = `${NAME}-head`
	const headBtnName = (nameExt: string) => (
		`${NAME}-${nameExt}-btn ${BTN_NAME}`
	)
	const submitTxtName = `${inputName}-submit-txt${(
		formLog === 'user found' ? ` ${inputName}-submit-txt--green` : ''
	)}`

	// ----RENDER----------------------------- //
	const headBtn = (
		index: number,
		nameExt: string,
		content: string,
		hdl: {}
	) => (
		<motion.button
			className={headBtnName(nameExt)}
			{...headBtnMotion(index)}
			{...hdl}>
			{content}
		</motion.button>
	)
	console.log('from: ' + from)
	return <motion.main className={boxName} {...boxMotion}>
		<motion.div className={headName} {...headMotion}>
			{headBtn(1, 'down', '>>', downBtnHdl)}
			{headBtn(2, 'up', '<<', upBtnHdl)}
			{headBtn(3, 'findMe', 'FIND ME', findMeBtnHdl)}
			{headBtn(4, 'findTop', 'TOP', findTopBtnHdl)}
			<form {...formHdl}>
				<motion.input
					className={inputName}
					placeholder='user search'
					{...headInputMotion}
					{...inputHdl}
				/>
				<motion.button
					type='submit'
					className={headBtnName('input')}
					{...headBtnMotion(5)}>
					OK
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
		<Board data={data} from={from} userID={userID} />
	</motion.main >
}
export default Leader