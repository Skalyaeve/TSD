import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Timer } from '../tsx-utils/ftNumbers.tsx'
import { fade, heightChangeByPx, bouncyYMove } from '../tsx-utils/ftMotion.tsx'
import { io, Socket } from 'socket.io-client'

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
export let gameSocket: Socket

const startGameSockets = () => {
	const navigate = useNavigate()
	// Connect to the backend server
	gameSocket = io("http://localhost:3000/game")

	// ********** BACK TO CLIENT SPECIFIC EVENTS ********** //
	// WORKER <x= BACK ==> CLIENT

	// Get the player's own ID
	gameSocket.on('Welcome', () => {
		gameSocket.emit('identification', "PHASER-WEB-CLIENT")
	})

	gameSocket.on('matched', () => {
		console.log('Opponent found, starting game')
		navigate('/game')
	})
}

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
		console.log("matchmaking now:", matchmaking)
		if (!matchmaking) return
		setMatchmaking(false)
		//startGameSockets()
		setInGame(true)
		localStorage.setItem('inGame', '1')
	}, [matchmaking])

	// ----HANDLERS--------------------------- //
	const toggleMatchmaker = () => {
		if (!matchmaking && !inGame) {
			console.log("toggling matchmaker")
			setMatchmaking(true)
		}
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

	// ----RENDER----------------------------- //
	return <motion.button
		className={boxName}
		{...matchmakerBtnHdl}
		{...boxMotion}>
		<div className={txtName}>{matchmaking && <Timer />}</div>
	</motion.button>
}
export default Matchmaker