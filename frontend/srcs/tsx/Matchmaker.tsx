import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Timer } from './ftNumbers.tsx'
import { fade, heightChangeByPx, bouncyYMove } from './ftMotion.tsx'
import { Socket, io } from 'socket.io-client'


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

	const [leftScore, setLeftScore] = useState(0)
	const [rightScore, setRightScore] = useState(0)

	const getLeft = (): number => {
		return leftScore
	}

	const getRight = (): number => {
		return rightScore
	}

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

// ----EXPORTED FUNCTIONS----------------------------- //
/*
export const getLeft = () => {
	return GameInfos.getLeft();
};

export const getRight = () => {
	return GameInfos.getRight();
};

*/
// --------MATCHMAKER------------------------------------------------------ //
export let gameSocket: Socket | undefined = undefined

const Matchmaker: React.FC = () => {
	// ----ROUTER----------------------------- //
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [matchmaking, setMatchmaking] = useState(false)
	const [inGame, setInGame] = useState(() => {
		const value = localStorage.getItem('inGame')
		return value === '1'
	})

	/*
	const hostIp = process.env.HOST_IP

	const startGameSockets = () => {
		gameSocket = io('http://' + hostIp + ':3000/game')
		gameSocket.on('Welcome', () => {
			gameSocket?.emit('identification', "PHASER-WEB-CLIENT")
			setMatchmaking(true)
			console.log("Ongoing matchmaging")
		})
		gameSocket.on('matched', () => {
			console.log('Opponent found, starting game')
			setMatchmaking(false)
			setInGame(true)
			localStorage.setItem('inGame', '1')
			navigate('/game')
		})
		gameSocket.on('unmatched', () => {
			console.log("Succesfully stoped matchmaking")
			gameSocket?.disconnect()
			gameSocket = undefined
			setMatchmaking(false)
		})
	}

	const stopMatchmaking = () => {
		console.log("Requesting stop matchmaking")
		gameSocket?.emit('stopMatchmaking')
	}
	// ----EFFECTS---------------------------- //
	useEffect(() => {
		console.log("matchmaking:", matchmaking)
	}, [matchmaking])

	useEffect(() => {
		console.log("inGame:", inGame)
	}, [inGame])

	// ----HANDLERS--------------------------- //
	function toggleMatchmaker() {
		console.log("test")
		if (!matchmaking && !inGame)
			startGameSockets()
		else if (matchmaking && !inGame)
			stopMatchmaking()
		else if (inGame) {
			setInGame(false)
			localStorage.setItem('inGame', '0')
			navigate('/')
		}
	}
	const matchmakerBtnHdl = { onMouseUp: toggleMatchmaker }
*/
	const matchmakerBtnHdl = {}

	// ----ANIMATIONS------------------------- //
	const boxMotion = {
		...bouncyYMove({
			from: 100,
			extra: -10,
			inDuration: 0.7,
			outDuration: 0.4
		}),
		whileHover: {
			scale: 1.05,
			borderTopLeftRadius: '5px',
			borderTopRightRadius: '5px'
		}
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