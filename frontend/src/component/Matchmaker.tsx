import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Transition } from 'react-transition-group'
import { NewBox, Timer, useToggle } from './utils.tsx'

// --------PARTY-INFOS----------------------------------------------------- //
export const GameInfos: React.FC = memo(() => {
	// ----VALUES----------------------------- //
	const transitionTime = 500
	const transitionTemplate = {
		transition: `height ${transitionTime}ms ease-in-out, opacity ${transitionTime}ms ease-in-out`,
		height: 0,
		opacity: 0,
	}
	const transitionSteps = {
		entering: { height: 0, opacity: 0 },
		entered: { height: '275px', opacity: 1 },
		exiting: { height: '275px', opacity: 1 },
		exited: { height: 0, opacity: 0 },
		unmounted: { height: 0, opacity: 0 }
	}

	// ----REFS------------------------------- //
	const gameInfosRef = useRef(null)

	// ----STATES----------------------------- //
	const [transition, tglTransition] = useToggle(false)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		tglTransition()
	}, [])

	// ----CLASSNAMES------------------------- //
	const name = 'gameInfo'
	const playerPPName = `${name}-player`
	const scoreName = `${name}-score`

	// ----RENDER----------------------------- //
	return <Transition
		nodeRef={gameInfosRef}
		in={transition}
		timeout={transitionTime}
	>
		{state => (<div className={`${name}s`} ref={gameInfosRef}
			style={{
				...transitionTemplate,
				...transitionSteps[state]
			}}>
			<div className={playerPPName}>Player 1</div>
			<div className={playerPPName}>Player 2</div>
			<div className={scoreName}>0</div>
			<div className={scoreName}>0</div>
			<div className={`${name}-timer`}><Timer /></div>
		</div>)}
	</Transition>
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
	useEffect(() => localStorage.setItem('inGame', inGame ? '1' : '0'), [inGame])

	useEffect(() => {
		if (!matchmaking) return

		const interval = setInterval(() => {
			setMatchmaking(false)
			setInGame(true)
			navigate('/game')
		}, 1000)

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

	// ----CLASSNAMES------------------------- //
	const name = 'matchmaker'

	// ----RENDER----------------------------- //
	const btnContent = useMemo(() => {
		if (!matchmaking) return (inGame ? <>[EXIT]</> : <>[PLAY]</>)
		else return <>[STOP] <Timer /></>
	}, [matchmaking, inGame])

	return <NewBox
		tag='btn'
		className={name}
		nameIfPressed={`${name}--pressed`}
		handlers={matchmakerBtnHdl}
		content={btnContent}
	/>
})
export default Matchmaker