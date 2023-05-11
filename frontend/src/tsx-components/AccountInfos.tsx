import React, { useState } from 'react'
import { MotionProps, motion } from 'framer-motion'
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
	// ----CLASSNAMES------------------------- //
	const boxName = `${HISTORY_NAME}-match`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...xMove({ from: -100 * (HISTORY_COUNT - id) }) as MotionProps}>
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
	// ----CLASSNAMES------------------------- //
	const countName = `${ACHIEVEMENTS_NAME}-count`
	const listName = `${ACHIEVEMENTS_NAME}-list`

	// ----RENDER----------------------------- //
	const render = Array.from({ length: ACHIEVEMENTS_COUNT }, (_, index) => (
		<motion.div className={ACHIEVEMENT_NAME}
			key={`${ACHIEVEMENT_NAME}-${index + 1}`}
			{...yMove({ from: 300 * (index + 1) }) as MotionProps}>
			{`UNIT ${index + 1}`}
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
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-infos main`
	const historyBoxName = `${HISTORY_NAME}-box main`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...fade({}) as MotionProps}>
		<motion.div className={INFOS_NAME}
			{...fade({}) as MotionProps}>
			<Infos />
		</motion.div>

		<motion.div className={ACHIEVEMENTS_NAME}
			{...heightChangeByPercent({})}>
			<Achievements />
		</motion.div>

		<motion.div className={historyBoxName}
			{...widthChangeByPercent({})}>
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