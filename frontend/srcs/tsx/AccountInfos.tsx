import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, widthChangeByPercent, heightChangeByPercent, yMove, mergeMotions, xMove } from './utils/ftMotion.tsx'
import * as achievments from '../resources/achievments.json'
import { ftFetch } from './Root.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'profile'
const INFOS_NAME = `${NAME}-accountInfos`
const ACHIEVEMENT_NAME = `${NAME}-achievement`
const ACHIEVEMENTS_NAME = `${ACHIEVEMENT_NAME}s`
const STATS_NAME = `${NAME}-stats`
const HISTORY_NAME = `${NAME}-history`

// --------MATCH----------------------------------------------------------- //
interface MatchProps {
	userID: number
	userInfos: any
	data: any
	index: number
}
const Match: React.FC<MatchProps> = ({ userInfos, userID, data, index }) => {
	// ----VALUES----------------------------- //
	const enemyID = (
		data[index][1].player1 === userInfos.id ?
			data[index][1].player2 : data[index][1].player1
	)

	// ----STATES----------------------------- //
	const [enemyInfos, setEnemyInfos] = useState<any>({})

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (!userInfos.id) return

		const fetchEnemyData = async () => {
			let tmp = await ftFetch(`/users/${enemyID}`)
			setEnemyInfos(tmp)
		}
		fetchEnemyData()
	}, [userInfos.id])

	// ----CLASSNAMES------------------------- //
	const boxName = `${HISTORY_NAME}-match`
	const userBoxName = `${boxName}-box ${boxName}-user-box`
	const enemyBoxName = `${boxName}-box ${boxName}-enemy-box`
	const winName = `${boxName}-middleTxt ${boxName}-won`
	const loseName = `${boxName}-middleTxt ${boxName}-lost`

	// ----RENDER----------------------------- //
	const renderResult = () => {
		if (data[index][1].winner === userInfos.id)
			return <div className={winName}>WON</div>
		else
			return <div className={loseName}>LOST</div>
	}
	const renderUserScore = () => <div className={userBoxName}>
		{userInfos.nickname}
	</div>
	const renderEnemyScore = () => <Link
		to={`/profile${userInfos.id === userID ? `/${enemyInfos.id}` : ''}`}
		className={enemyBoxName}>
		{enemyInfos.nickname}
	</Link>
	return <div className={boxName}>
		{renderUserScore()}
		{renderResult()}
		{renderEnemyScore()}
	</div>
}

// --------HISTORY--------------------------------------------------------- //
interface HistoryProps {
	userID: number
	userInfos: any
	userHistory: any
}
const History: React.FC<HistoryProps> = ({ userID, userInfos, userHistory }) => {
	// ----VALUES----------------------------- //
	const data = Object.entries(userHistory)

	// ----RENDER----------------------------- //
	const render = Array.from({ length: data.length }, (_, index) =>
		<Match
			key={index}
			data={data}
			userInfos={userInfos}
			userID={userID}
			index={index}
		/>
	)
	return <div className={HISTORY_NAME}>
		{!data.length && <h1>no recent matches</h1>}
		{render}
	</div>
}

// --------STATS----------------------------------------------------------- //
interface StatsProps {
	userHistory: any
	userInfos: any
	winsCount: number
}
const Stats: React.FC<StatsProps> = ({ userHistory, userInfos, winsCount }) => {
	// ----VALUES----------------------------- //
	const data = Object.entries(userHistory)

	// ----ANIMATIONS------------------------- //
	const txtMotion = fade({ inDuration: 0.2, outDuration: 0.2, inDelay: 0.5 })

	// ----CLASSNAMES------------------------- //
	const statsFirstLineName = `${STATS_NAME}-firstLine`
	const statsSecondLineName = `${STATS_NAME}-secondLine`

	// ----RENDER----------------------------- //
	return <div className={STATS_NAME}>
		<motion.div className={statsFirstLineName} {...txtMotion}>
			{data.length} MATCHES - {winsCount} WINS - {data.length - winsCount} LOSES
		</motion.div>
		<motion.div className={statsSecondLineName} {...txtMotion}>
			RATIO: {winsCount / data.length * 100}% - RANK POINTS: {userInfos.rankPoints}
		</motion.div>
	</div>
}

// --------ACHIEVEMENTS---------------------------------------------------- //
const Achievements: React.FC = () => {
	// ----VALUES----------------------------- //
	const data = Object.entries(achievments)
	const unlocked = ''

	// ----ANIMATIONS------------------------- //
	const achievementMotion = (index: number) => yMove({
		from: 400 * index,
		inDuration: 0.9 + 0.02 * index,
		outDuration: 0.5 - 0.01 * index
	})

	// ----CLASSNAMES------------------------- //
	const unitName = (id: number) => (
		`${ACHIEVEMENT_NAME}${(
			unlocked.includes(`.${id}`) ?
				` ${ACHIEVEMENT_NAME}--unlocked` : ''
		)}`
	)
	const countName = `${ACHIEVEMENTS_NAME}-head`
	const listName = `${ACHIEVEMENTS_NAME}-list`
	const lockIconName = `${ACHIEVEMENT_NAME}-lockIcon`
	const unlockedTxTName = `${ACHIEVEMENT_NAME}-unlockedTxt`

	// ----RENDER----------------------------- //
	const render = Array.from({ length: data.length - 1 }, (_, index) =>
		<motion.div
			className={unitName(index)}
			key={`${ACHIEVEMENT_NAME}-${index + 1}`}
			{...achievementMotion(index + 1)}>
			<h1>{data[index][0]}</h1>
			<p>{data[index][1]}</p>
			{unlocked.includes(`.${index}`) ?
				<div className={unlockedTxTName}>since 00/00/00</div>
				: <div className={lockIconName} />
			}
		</motion.div>
	)
	return <>
		<div className={countName}>ACHIEVEMENTS</div>
		<div className={listName}>{render}</div>
	</>
}

// --------INFOS----------------------------------------------------------- //
interface InfosProps {
	userID: number
	userInfos: any
}
const Infos: React.FC<InfosProps> = ({ userID, userInfos }) => {
	// ----VALUES----------------------------- //
	const ppURI = '/user/profile-picture'
	const profilePictureURI = `url('${ppURI}/${userInfos.avatarFilename}')`

	// ----STATES----------------------------- //
	const [overPic, setOverPic] = useState(false)
	const [overName, setOverName] = useState(false)
	const [showSettings, setChanginNickname] = useState(0)
	const [inputValue, setInputValue] = useState('')
	const [nameFormLogs, setNameFormLogs] = useState('')
	const [text, setText] = useState('');

	// ----HANDLERS--------------------------- //
	const ppHdl = {
		onMouseEnter: () => setOverPic(true),
		onMouseLeave: () => setOverPic(false)
	}
	const nicknameHdl = {
		onMouseEnter: () => setOverName(true),
		onMouseLeave: () => setOverName(false)
	}
	const inputHdl = {
		onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
			setInputValue(e.target.value)
		}
	}
	const setNameBtnHdl = { onMouseUp: () => setChanginNickname(1) }
	const setPicBtnHdl = { onMouseUp: () => setChanginNickname(2) }
	const cancelBtnHdl = { onMouseUp: () => setChanginNickname(0) }
	const nameFormHdl = {
		onSubmit: (e: any) => {
			e.preventDefault()
			if (e.nativeEvent.submitter?.className === cancelBtnName) {
				return
			}
			console.log(inputValue)
		}
	}
	const ppFormHdl = {
		onSubmit: (e: any) => {
			e.preventDefault()
			if (e.nativeEvent.submitter?.className === cancelBtnName) {
				return
			}
			console.log(e.target.elements.image.files[0])
		}
	}
	const txtAreaHdl = {
		onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setText(e.target.value)
		},
		onBlur: (e: React.ChangeEvent<HTMLTextAreaElement>) => {
			console.log(e.target.value)
		}
	}

	// ----ANIMATIONS------------------------- //
	const btnMotion = { whileHover: { scale: 1.05 } }
	const setPictureBtnMotion = {
		...mergeMotions(
			xMove({ from: -20, inDuration: 0.3, outDuration: 0.3 }),
			yMove({ from: -20, inDuration: 0.3, outDuration: 0.3 })
		),
		...btnMotion
	}
	const setNameBtnMotion = {
		...xMove({ from: -30, inDuration: 0.3, outDuration: 0.3 }),
		...btnMotion
	}
	const formMotion = xMove({ from: -30, inDuration: 0.3, outDuration: 0.3 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-picture`
	const nicknameField = `${NAME}-nickname`
	const submitBtnName = `${NAME}-submit-btn`
	const cancelBtnName = `${NAME}-cancel-btn`
	const ppFormName = `${NAME}-pp-form`
	const nameFormName = `${NAME}-name-form`

	// ----RENDER----------------------------- //
	console.log(userID === userInfos.id)
	return <>
		<div
			className={boxName}
			style={{ backgroundImage: profilePictureURI }}
			{...ppHdl}>
			<AnimatePresence>
				{userInfos.id === userID && overPic &&
					<motion.button {...setPictureBtnMotion} {...setPicBtnHdl} />
				}
			</AnimatePresence>
		</div>
		<div className={nicknameField} {...nicknameHdl}>
			{userInfos.nickname}
			<AnimatePresence>
				{userInfos.id === userID && overName &&
					<motion.button {...setNameBtnMotion} {...setNameBtnHdl} />
				}
			</AnimatePresence>
		</div>
		<textarea
			placeholder='anything to say ?'
			value={text}
			readOnly={userID !== userInfos.id}
			{...txtAreaHdl}
		/>
		<AnimatePresence>
			{showSettings === 1 && <motion.form
				className={nameFormName}
				{...nameFormHdl}
				{...formMotion}>
				<input placeholder='new username' value={inputValue} {...inputHdl} />
				<motion.button
					type='submit'
					className={submitBtnName}
					{...btnMotion}>
					SUBMIT
				</motion.button>
				<motion.button
					className={cancelBtnName}
					{...cancelBtnHdl}
					{...btnMotion}>
					CANCEL
				</motion.button>
			</motion.form>}
		</AnimatePresence>
		<AnimatePresence>
			{showSettings === 2 && <motion.form
				className={ppFormName}
				{...ppFormHdl}
				{...formMotion}>
				<input type='file' name='image' />
				<motion.button
					className={submitBtnName}
					{...btnMotion}>
					SUBMIT
				</motion.button>
				<motion.button
					className={cancelBtnName}
					{...cancelBtnHdl}
					{...btnMotion}>
					CANCEL
				</motion.button>
			</motion.form>}
		</AnimatePresence>
	</>
}

// --------ACCOUNT-INFOS--------------------------------------------------- //
interface AccountInfosProps {
	userID: number
}
const AccountInfos: React.FC<AccountInfosProps> = ({ userID }) => {
	// ----ROUTER----------------------------- //
	const location = useLocation()

	// ----VALUES----------------------------- //
	let id = location.pathname.split('/')[2]
	if (!id) id = String(userID)

	// ----STATES----------------------------- //
	const [userInfos, setUserInfos] = useState<any>({})
	const [userHistory, setUserHistory] = useState<any>({})
	const [winsCount, setWinsCount] = useState(0)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (!userID) return

		const fetchData = async () => {
			let data = await ftFetch(`/users/${id}`)
			setUserInfos(data)
			data = await ftFetch(`/games/${id}`)
			setUserHistory(data)
			data = await ftFetch(`/games/${id}/victories/count`)
			setWinsCount(data)
		}
		fetchData()
	}, [userID])

	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })
	const achievementsMotion = heightChangeByPercent({ inDuration: 0.8 })
	const historyMotion = mergeMotions(
		widthChangeByPercent({ inDuration: 0.8 }),
		heightChangeByPercent({ inDuration: 0.8, initialHeight: 32 })
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-infos main`
	const historyBoxName = `${HISTORY_NAME}-box`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...boxMotion}>
		<motion.div className={INFOS_NAME} {...boxMotion}>
			<Infos userID={userID} userInfos={userInfos} />
		</motion.div>
		<motion.div className={ACHIEVEMENTS_NAME} {...achievementsMotion}>
			<Achievements />
		</motion.div>
		<motion.div className={historyBoxName} {...historyMotion}>
			<Stats
				userInfos={userInfos}
				userHistory={userHistory}
				winsCount={winsCount}
			/>
			<History
				userID={userID}
				userInfos={userInfos}
				userHistory={userHistory}
			/>
		</motion.div>
	</motion.div >
}
export default AccountInfos