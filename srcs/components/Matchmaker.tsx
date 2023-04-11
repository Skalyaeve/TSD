import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { newBox } from './utils.tsx'

function Matchmaker() {
	// Valeurs
	const navigate = useNavigate()
	const [boxPressed, setBoxPressed] = useState(0)
	const [matchmaking, setMatchmaking] = useState(false)
	const [inGame, setInGame] = useState(() => {
		const value = localStorage.getItem('inGame')
		return value === '1' ? true : false
	})

	const isPressed = (id: integer) => (boxPressed === id ? 'matchmaker__button--pressed' : '')
	const matchmakerBoxName = `${isPressed(1)} matchmaker__button`

	const matchmakerBox = (name: string) => (
		newBox({
			className: name,
			to: undefined,
			onMouseDown: () => setBoxPressed(1),
			onMouseUp: () => { setBoxPressed(0); pressingButton() },
			content: matchmaking === false ? (
				inGame === false ? (
					<>[ PLAY ]</>
				) : (
					<>[ EXIT ]</>
				)
			) : (
				updateCount()
			)
		})
	)

	// Modifieurs
	const enterGame = () => {
		setInGame(true)
		localStorage.setItem('inGame', '1')
	}
	const leaveGame = () => {
		setInGame(false)
		localStorage.setItem('inGame', '0')
	}

	const pressingButton = () => {
		if (matchmaking === false) {
			if (inGame === false) {
				setMatchmaking(true)
				// Matchmaking...
				setMatchmaking(false)
				enterGame()
				navigate('/party')
			}
			else {
				leaveGame()
				navigate('/')
			}
		}
		else
			setMatchmaking(false)
	}
	const updateCount = () => (<>[ 00:00 STOP ]</>)

	// Retour
	return (
		<div className='matchmaker'>
			{matchmakerBox(matchmakerBoxName)}
		</div >
	)
}
export default Matchmaker
