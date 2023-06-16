import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Timer } from '../tsx-utils/ftNumbers.tsx'
import { fade, heightChangeByPx, bouncyYMove } from '../tsx-utils/ftMotion.tsx'

// --------GAME-INFOS------------------------------------------------------ //
export const GameInfos: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = heightChangeByPx({
		finalHeight: 275,
		inDuration: 0.7
	})
	const childMotion = fade({ inDelay: 0.3 })

	// ----CLASSNAMES------------------------- //
	const name = 'gameInfo'
	const boxName = `${name}s`
	const playerPPName = `${name}-player`
	const scoreName = `${name}-score`
	const timerName = `${name}-timer`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...boxMotion}>
		<motion.div className={playerPPName} {...childMotion} />
		<motion.div className={playerPPName} {...childMotion} />
		<motion.div className={scoreName} {...childMotion}>
			0
		</motion.div>
		<motion.div className={scoreName} {...childMotion}>
			0
		</motion.div>
		<motion.div className={timerName} {...childMotion}>
			<Timer />
		</motion.div>
	</motion.div>
}

// --------MATCHMAKER------------------------------------------------------ //
const Matchmaker: React.FC = () => {
	// ----ROUTER----------------------------- //
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [matchmaking, setMatchmaking] = useState(false)
	const [inGame, setInGame] = useState(() => {
		const value = localStorage.getItem('inGame')
		return value === '1'
	})

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (!matchmaking) return

		const timer = setTimeout(() => {
			setMatchmaking(false)
			setInGame(true)
			navigate('/game')
			localStorage.setItem('inGame', '1')
		}, 2000)
		return () => clearTimeout(timer)
	}, [matchmaking])

	// ----HANDLERS--------------------------- //
	const toggleMatchmaker = () => {
		if (!matchmaking && !inGame) setMatchmaking(true)
		else if (inGame) {
			setInGame(false)
			navigate('/')
			localStorage.setItem('inGame', '0')
		}
		else setMatchmaking(false)
	}
	const matchmakerBtnHdl = { onMouseUp: toggleMatchmaker }

	// ----ANIMATIONS------------------------- //
	const boxMotion = {
		...bouncyYMove({
			from: 100,
			extra: -10,
			inDuration: 0.7,
			outDuration: 0.4,
		})
	}

	// ----CLASSNAMES------------------------- //
	const boxName = 'matchmaker'
	const txtName = `${boxName}-txt custom-txt`
