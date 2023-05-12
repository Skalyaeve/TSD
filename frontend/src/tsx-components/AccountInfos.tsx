import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { fade, widthChangeByPercent, heightChangeByPercent, xMove, yMove } from '../tsx-utils/ftMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const ACHIEVEMENTS_COUNT = 18
const HISTORY_COUNT = 20

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'profile'
const INFOS_NAME = `${NAME}-accountInfos`
const ACHIEVEMENT_NAME = `${NAME}-achievement`
const ACHIEVEMENTS_NAME = `${ACHIEVEMENT_NAME}s`
const STATS_NAME = `${NAME}-stats`
const HISTORY_NAME = `${NAME}-history`

// --------MATCH----------------------------------------------------------- //
interface MatchProps {
	id: number
}
const Match: React.FC<MatchProps> = ({ id }) => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = xMove({
		from: -200 * (HISTORY_COUNT - id),
		inDuration: 0.5 + 0.04 * (HISTORY_COUNT - id),
		outDuration: 0.5 - 0.01 * (HISTORY_COUNT - id)
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${HISTORY_NAME}-match`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...boxMotion}>
		MATCH #{id}
	</motion.div>
}

// --------HISTORY--------------------------------------------------------- //
const History: React.FC = () => {
	// ----RENDER----------------------------- //
	const render = Array.from({ length: HISTORY_COUNT }, (_, index) => (
		<Match key={index + 1} id={index + 1} />
	))
	return <>{render}</>
}

// --------ACHIEVEMENTS---------------------------------------------------- //
const Achievements: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const achievementMotion = (index: number) => (
		yMove({
			from: 400 * index,
			inDuration: 0.9 + 0.02 * index,
			outDuration: 0.5 - 0.01 * index
		})
	)

	// ----CLASSNAMES------------------------- //
	const countName = `${ACHIEVEMENTS_NAME}-count`
	const listName = `${ACHIEVEMENTS_NAME}-list`

	// ----RENDER----------------------------- //
	const render = Array.from({ length: ACHIEVEMENTS_COUNT }, (_, index) => (
		<motion.div className={ACHIEVEMENT_NAME}
			key={`${ACHIEVEMENT_NAME}-${index + 1}`}
			{...achievementMotion(index + 1)}>
			UNIT {index + 1}
		</motion.div>
	))
	return <>
		<div className={countName}>
			ACHIEVEMENTS
		</div>
		<div className={listName}>
			{render}
		</div>
	</>
}

// --------PP-------------------------------------------------------------- //
const ProfilePicture: React.FC = () => {
	// ----STATES----------------------------- //
	const [profilePicture, setProfilePicture] = useState('')
	const [loading, setLoading] = useState(true)

	// ----EFFECTS---------------------------- //
	/*
	useEffect(() => {
		const blobToBase64 = (blob: Blob): Promise<string> => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader()
				reader.onerror = reject
				reader.onload = () => resolve(reader.result as string)
				reader.readAsDataURL(blob)
			})
		}

		const fetchData = async () => {
			try {
				const userId = 'users/0'
				const response = await fetch(`http://10.11.12.2:3000/${userId}`)
				if (response.ok) {
					// const blob = await response.blob()
					// const base64Image = await blobToBase64(blob)
					const txt = await response.text()
					setProfilePicture(txt)
					setLoading(false)
				} else {
					console.error(`[ERROR] fetch('http://10.11.12.2:3000/${userId}') failed`)
					setLoading(false)
				}
			} catch (error) {
				console.error('[ERROR] ', error)
				setLoading(false)
			}
		}

		fetchData()
	}, [])
	*/

	// ----RENDER----------------------------- //
	return <>
		{loading ?
			<>Loading...</>
			:
			<>{profilePicture}</>
		}
	</>
}

// --------INFOS----------------------------------------------------------- //
const Infos: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-picture`

	// ----RENDER----------------------------- //
	return <>
		<div className={boxName}>
			<ProfilePicture />
		</div >
	</>
}

// --------ACCOUNT-INFOS--------------------------------------------------- //
const AccountInfos: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })
	const achievementsMotion = heightChangeByPercent({ inDuration: 0.8 })
	const historyMotion = widthChangeByPercent({ inDuration: 0.8 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-infos main`
	const historyBoxName = `${HISTORY_NAME}-box`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...boxMotion}>
		<motion.div className={INFOS_NAME}
			{...boxMotion}>
			<Infos />
		</motion.div>
		<motion.div className={ACHIEVEMENTS_NAME}
			{...achievementsMotion}>
			<Achievements />
		</motion.div>
		<motion.div className={historyBoxName}
			{...historyMotion}>
			<div className={STATS_NAME}>
				0 MATCHES - 0 WINS - 0 LOSES<br />RATIO: 0% - SCORED: 0
			</div>
			<div className={HISTORY_NAME}>
				<History />
			</div>
		</motion.div>
	</motion.div>
}
export default AccountInfos