import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Matchmaker() {
	// Variables
	const [inGame, setInGame] = useState(() => {
		const storedValue = localStorage.getItem('inGame')
		return storedValue === 'true' ? true : false
	})
	const [matchmaker, setMatchmaker] = useState('closed')
	const [button, setButton] = useState('released')
	const navigate = useNavigate();

	// Modifieurs
	const enterGame = () => {
		setInGame(true)
		localStorage.setItem('inGame', 'true')
	}
	const leaveGame = () => {
		setInGame(false)
		localStorage.setItem('inGame', 'false')
	}

	const buttonPressed = () => {
		if (matchmaker === 'closed') {
			if (inGame === false) {
				setMatchmaker('open')
				// Matchmaking
				setMatchmaker('closed')
				enterGame()
				navigate('/party')
			}
			else {
				leaveGame()
				navigate('/')
			}
		}
		else
			setMatchmaker('closed')
	}

	// Retour
	return (
		<div className='matchmaker'>
			<div className={`matchmaker__button ${button === "pressed" ? "matchmaker__button--pressed" : ""}`}
				onMouseDown={() => setButton("pressed")}
				onMouseUp={() => { setButton("released"); buttonPressed(); }}>
				{matchmaker === 'closed' ? (
					inGame === false ? (
						<>[ PLAY ]</>
					) : (
						<>[ EXIT ]</>
					)
				) : (
					<>[ 00:00 STOP ]</>
				)}
			</div>
		</div >
	)
}
export default Matchmaker
