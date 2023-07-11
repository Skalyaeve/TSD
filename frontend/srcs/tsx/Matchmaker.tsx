import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Timer } from './utils/ftNumbers.tsx'
import { bouncyYMove } from './utils/ftMotion.tsx'
import { Socket, io } from 'socket.io-client'
import { inGame, setInGame } from './Root.tsx'

// --------MATCHMAKER------------------------------------------------------ //
export let gameSocket: Socket | undefined = undefined
export const setGameSocket = (value: Socket | undefined) => {
	gameSocket = value
}

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
			gameSocket?.disconnect()
			setGameSocket(undefined)
			setInGame(false)
			navigate('/')
			setTimeout(() => {
				window.alert('You lost :(')
			}, 100)
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
	const txtMotion = popUp({})

	// ----CLASSNAMES------------------------- //
	const boxName = 'matchmaker'
	const txtName = `custom-txt ${boxName}-txt-${(
		inGame ? 'exit' : (matchmaking ? 'stop' : 'play')
	)}`

	// ----RENDER----------------------------- //
	return <motion.button
		className={boxName}
		{...matchmakerBtnHdl}
		{...boxMotion}>
		<AnimatePresence>
			<motion.div key={txtName} className={txtName} {...txtMotion}>
				{matchmaking && <Timer />}
			</motion.div>
		</AnimatePresence>
	</motion.button>
}
export default Matchmaker