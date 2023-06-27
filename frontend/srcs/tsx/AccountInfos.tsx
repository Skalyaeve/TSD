import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { fade, widthChangeByPercent, heightChangeByPercent, yMove, mergeMotions } from './utils/ftMotion.tsx'
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
	userInfos: any
	data: any
	index: number
}
const Match: React.FC<MatchProps> = ({ userInfos, data, index }) => {
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
	const renderEnemyScore = () => <div className={enemyBoxName}>
		{enemyInfos.nickname}
	</div>
	return <div className={boxName}>
		{renderUserScore()}
		{renderResult()}
		{renderEnemyScore()}
	</div>
}

// --------HISTORY--------------------------------------------------------- //
interface HistoryProps {
	userInfos: any
	userHistory: any
}
const History: React.FC<HistoryProps> = ({ userInfos, userHistory }) => {
	// ----VALUES----------------------------- //
	const data = Object.entries(userHistory)

	// ----RENDER----------------------------- //
	const render = Array.from({ length: data.length }, (_, index) =>
		<Match key={index} data={data} userInfos={userInfos} index={index} />
	)
	return <div className={HISTORY_NAME}>{render}</div>
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
			RATIO: {winsCount / data.length * 100}% - RANK: {userInfos.rankPoints}
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
	userInfos: any
}
const Infos: React.FC<InfosProps> = ({ userInfos }) => {
	// ----VALUES----------------------------- //
	const ppURI = '/user/profile-picture'
	const profilePictureURI = `url('${ppURI}/${userInfos.avatarFilename}')`

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-picture`
	const nicknameField = `${NAME}-nickname`

	// ----RENDER----------------------------- //
	return <>
		<div className={boxName} style={{ backgroundImage: profilePictureURI }} />
		<div className={nicknameField}>{userInfos.nickname}</div>
		<textarea placeholder='anything to say ?' />
	</>
}

// --------ACCOUNT-INFOS--------------------------------------------------- //
interface AccountInfosProps {
	userID: number
}
const AccountInfos: React.FC<AccountInfosProps> = ({ userID }) => {
	// ----STATES----------------------------- //
	const [userInfos, setData] = useState<any>({})
	const [userHistory, setUserHistory] = useState<any>({})
	const [winsCount, setWinsCount] = useState(0)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (!userID) return

		const fetchData = async () => {
			let data = await ftFetch(`/users/${userID}`)
			setData(data)
			data = await ftFetch('/games/own')
			setUserHistory(data)
			data = await ftFetch(`/games/${userID}/victories/count`)
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
			<Infos userInfos={userInfos} />
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
			<History userInfos={userInfos} userHistory={userHistory} />
		</motion.div>
	</motion.div >
}
export default AccountInfos