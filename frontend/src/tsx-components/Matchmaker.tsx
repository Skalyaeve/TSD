import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, MotionProps } from 'framer-motion'
import { Timer } from '../tsx-utils/ftNumbers.tsx'
import { fade, bouncyHeightChangeByPx, bouncyYMove } from '../tsx-utils/ftMotion.tsx'

// --------GAME-INFOS------------------------------------------------------ //
export const GameInfos: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = bouncyHeightChangeByPx({ finalHeight: 275, inDuration: 0.7 })
	const childMotion = fade({ inDelay: 0.2 })

	// ----CLASSNAMES------------------------- //
	const name = 'gameInfo'
	const boxName = `${name}s`
	const playerPPName = `${name}-player`
	const scoreName = `${name}-score`
	const timerName = `${name}-timer`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...boxMotion}>
		<motion.div className={playerPPName}
			{...childMotion}>
			Player 1
		</motion.div>
		<motion.div className={playerPPName}
			{...childMotion}>
			Player 2
		</motion.div>
		<motion.div className={scoreName}
			{...childMotion}>
			0
		</motion.div>
		<motion.div className={scoreName}
			{...childMotion}>
			0
		</motion.div>
		<motion.div className={timerName}
			{...childMotion}>
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
			localStorage.setItem('inGame', '1')
			setInGame(true)
			navigate('/game')
		}, 2000)
		return () => clearTimeout(timer)
	}, [matchmaking])

	// ----HANDLERS--------------------------- //
	const toggleMatchmaker = () => {
		if (!matchmaking && !inGame) setMatchmaking(true)
		else if (inGame) {
			localStorage.setItem('inGame', '0')
			setInGame(false)
			navigate('/')
		} else setMatchmaking(false)
	}
	const matchmakerBtnHdl = { onMouseUp: toggleMatchmaker }

	// ----ANIMATIONS------------------------- //
	const boxMotion = {
		...bouncyYMove({ from: 100, extra: -10, inDuration: 0.7 }),
		whileHover: {
			rotate: [0, -5, 5, 0],
			transition: { ease: 'easeIn' }
		},
		whileTap: {
			rotate: [0, 5, -5, 5, -5, 0],
			transition: { ease: 'easeInOut' }
		}
	}

	// ----CLASSNAMES------------------------- //
	const name = 'matchmaker'

	// ----RENDER----------------------------- //
	const render = () => {
		if (!matchmaking) return (inGame ? <>[EXIT]</> : <>[PLAY]</>)
		else return <>[STOP] <Timer /></>
	}
	return <motion.button className={name}
		{...matchmakerBtnHdl}
		{...boxMotion as MotionProps}>
		{render()}
	</motion.button>
}
export default Matchmaker