import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Timer } from './utils/ftNumbers.tsx'
import { fade, heightChangeByPx, bouncyYMove } from './utils/ftMotion.tsx'
import { Socket, io } from 'socket.io-client'
import { inGame, setInGame } from './Root.tsx'

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
export let gameSocket: Socket | undefined = undefined

const Matchmaker: React.FC = () => {
	// ----ROUTER----------------------------- //
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [matchmaking, setMatchmaking] = useState(false)
	const hostIp = process.env.HOST_IP

	const startGameSockets = () => {
		try {
			gameSocket = io('http://' + hostIp + ':3000/game', {
				transports: ["websocket"],
				withCredentials: true,
			})
		}
		catch { console.log("[ERROR] Couldn't connect to chat gateway") }
		gameSocket?.on('matching', () => {
			setMatchmaking(true)
			console.log("Matching")
		})
		gameSocket?.on('matched', () => {
			setMatchmaking(false)
			setInGame(true)
			navigate('/game')
		})
		gameSocket?.on('unmatched', () => {
			console.log("Succesfully stoped matchmaking")
			gameSocket?.disconnect()
			gameSocket = undefined
			setMatchmaking(false)
		})
	}

	const stopMatchmaking = () => {
		gameSocket?.emit('stopMatchmaking')
	}
	// ----EFFECTS---------------------------- //

	// ----HANDLERS--------------------------- //
	function toggleMatchmaker() {
		if (!matchmaking && !inGame)
			startGameSockets()
		else if (matchmaking && !inGame)
			stopMatchmaking()
		else if (inGame) {
			gameSocket?.emit('leavingGame')
		}
	}
	const matchmakerBtnHdl = { onMouseUp: toggleMatchmaker }

	// ----ANIMATIONS------------------------- //
	const boxMotion = {
		...bouncyYMove({
			from: 100,
			extra: -10,
			inDuration: 0.7,
			outDuration: 0.4
		}),
		whileHover: { scale: 1.05 }
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