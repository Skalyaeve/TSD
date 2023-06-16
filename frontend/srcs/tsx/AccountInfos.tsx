import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { fade, widthChangeByPercent, heightChangeByPercent, yMove, mergeMotions } from './ftMotion.tsx'

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
	return <div className={boxName}>
		MATCH #{id}
	</div>
}

// --------HISTORY--------------------------------------------------------- //
const History: React.FC = () => {
	// ----VALUES----------------------------- //
	const count = 5

	// ----RENDER----------------------------- //
	const render = Array.from({ length: count }, (_, index) =>
		<Match key={index + 1} id={index + 1} />
	)
	return <>{render}</>
}

// --------ACHIEVEMENTS---------------------------------------------------- //
const Achievements: React.FC = () => {
	// ----VALUES----------------------------- //
	const count = 10

	// ----ANIMATIONS------------------------- //
	const achievementMotion = (index: number) => yMove({
		from: 400 * index,
		inDuration: 0.9 + 0.02 * index,
		outDuration: 0.5 - 0.01 * index
	})

	// ----CLASSNAMES------------------------- //
	const countName = `${ACHIEVEMENTS_NAME}-head`
	const listName = `${ACHIEVEMENTS_NAME}-list`

	// ----RENDER----------------------------- //
	const render = Array.from({ length: count }, (_, index) =>
		<motion.div
			className={ACHIEVEMENT_NAME}
			key={`${ACHIEVEMENT_NAME}-${index + 1}`}
			{...achievementMotion(index + 1)}>
			UNIT {index + 1}
		</motion.div>
	)
	return <>
		<div className={countName}>ACHIEVEMENTS</div>
		<div className={listName}>{render}</div>
	</>
}

// --------PP-------------------------------------------------------------- //
const ProfilePicture: React.FC = () => {
	// ----STATES----------------------------- //
	const [profilePicture, setProfilePicture] = useState('')

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
				const userId = 'users/avatar/download'
				const response = await fetch(`http://localhost:3000/${userId}`)
				if (response.ok) {
					const blob = await response.blob()
					const base64Image = await blobToBase64(blob)
					setProfilePicture(base64Image)
					setLoading(false)
				} else
					console.error(`[ERROR] fetch('http://localhost:3000/${userId}') failed`)
			} catch (error) {
				console.error('[ERROR] ', error)
				setLoading(false)
			}
		}
		fetchData()
	}, [])
	*/

	// ----RENDER----------------------------- //
	return <>{profilePicture}</>
}

// --------INFOS----------------------------------------------------------- //
const Infos: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-picture`

	// ----RENDER----------------------------- //
	return <><div className={boxName}><ProfilePicture /></div ></>
}

// --------ACCOUNT-INFOS--------------------------------------------------- //
const AccountInfos: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })
	const txtMotion = fade({ inDuration: 0.2, outDuration: 0.2, inDelay: 0.5 })
	const achievementsMotion = heightChangeByPercent({ inDuration: 0.8 })
	const historyMotion = mergeMotions(
		widthChangeByPercent({ inDuration: 0.8 }),
		heightChangeByPercent({ inDuration: 0.8, initialHeight: 32 })
	)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-infos main`
	const historyBoxName = `${HISTORY_NAME}-box`
	const statsFirstLineName = `${STATS_NAME}-firstLine`
	const statsSecondLineName = `${STATS_NAME}-secondLine`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...boxMotion}>
		<motion.div className={INFOS_NAME} {...boxMotion}>
			<Infos />
		</motion.div>
		<motion.div className={ACHIEVEMENTS_NAME} {...achievementsMotion}>
			<Achievements />
		</motion.div>
		<motion.div className={historyBoxName} {...historyMotion}>
			<div className={STATS_NAME}>
				<motion.div className={statsFirstLineName} {...txtMotion}>
					0 MATCHES - 0 WINS - 0 LOSES
				</motion.div>
				<motion.div className={statsSecondLineName} {...txtMotion}>
					RATIO: 100% - RANK: 1
				</motion.div>
			</div>
			<div className={HISTORY_NAME}><History /></div>
		</motion.div>
	</motion.div >
}
export default AccountInfos