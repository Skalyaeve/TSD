import React, { memo, useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { NewBox, Timer } from './utils.tsx'

// --------PARTY-INFOS----------------------------------------------------- //
export const GameInfos: React.FC = memo(() => {
	// ----CLASSNAMES------------------------- //
	const gameInfo = 'gameInfo'
	const gameInfoPlayer = `${gameInfo}-player`
	const gameInfoPlayerL = `${gameInfoPlayer}--left`
	const gameInfoPlayerR = `${gameInfoPlayer}--right`
	const gameInfoScore = `${gameInfo}-score`
	const gameInfoScoreL = `${gameInfoScore}--left`
	const gameInfoScoreR = `${gameInfoScore}--right`

	// ----RENDER----------------------------- //
	return <div className={`${gameInfo}s`}>
		<div className={`${gameInfoPlayer} ${gameInfoPlayerL}`}>Player 1</div>
		<div className={`${gameInfoPlayer} ${gameInfoPlayerR}`}>Player 2</div>
		<div className={`${gameInfoScore} ${gameInfoScoreL}`}>0</div>
		<div className={`${gameInfoScore} ${gameInfoScoreR}`}>0</div>
		<div className={`${gameInfo}-timer`}><Timer /></div>
	</div>
})

// --------MATCHMAKER------------------------------------------------------ //
const Matchmaker: React.FC = memo(() => {
	// ----LOCATION--------------------------- //
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [matchmaking, setMatchmaking] = useState(false)
	const [inGame, setInGame] = useState(() => {
		const value = localStorage.getItem('inGame')
		return value === '1'
	})

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		localStorage.setItem('inGame', inGame ? '1' : '0')
	}, [inGame])

	useEffect(() => {
		if (!matchmaking) return

		const interval = setInterval(() => {
			setMatchmaking(false)
			setInGame(true)
			navigate('/game')
		}, 3000)

		return () => clearInterval(interval)
	}, [matchmaking])

	// ----HANDLERS--------------------------- //
	const toggleMatchmaking = useCallback(() => {
		if (!matchmaking && !inGame) setMatchmaking(true)
		else if (inGame) {
			setInGame(false)
			navigate('/')
		} else setMatchmaking(false)
	}, [matchmaking, inGame])

	const matchmakerBtnHdl = useMemo(() => ({
		onMouseUp: toggleMatchmaking
	}), [toggleMatchmaking])

	// ----RENDER----------------------------- //
	const btnContent = useMemo(() => {
		if (!matchmaking) return (inGame ? <>[EXIT]</> : <>[PLAY]</>)
		else return <>[STOP] <Timer /></>
	}, [matchmaking, inGame])

	return <NewBox
		tag='btn'
		className='matchmaker'
		nameIfPressed='matchmaker--pressed'
		handlers={matchmakerBtnHdl}
		content={btnContent}
	/>
})
export default Matchmaker