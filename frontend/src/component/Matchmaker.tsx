import React, { memo, useMemo, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { NewBox, Timer } from './utils.tsx'
import { bouncyComeFromCol } from './framerMotionAnime.tsx'

// --------PARTY-INFOS------------------------------	----------------------- //
export const GameInfos: React.FC = memo(() => {
	// ----CLASSNAMES------------------------- //
	const name = 'gameInfo'
	const playerPPName = `${name}-player`
	const scoreName = `${name}-score`

	// ----RENDER----------------------------- //
	return <div className={`${name}s`}>
		<div className={playerPPName}>Player 1</div>
		<div className={playerPPName}>Player 2</div>
		<div className={scoreName}>0</div>
		<div className={scoreName}>0</div>
		<div className={`${name}-timer`}><Timer /></div>
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
	const animeMatchmaker = useMemo(() => bouncyComeFromCol(185, 20, 0.75, 1), [])

	const btnContent = useMemo(() => {
		if (!matchmaking) return (inGame ? <>[EXIT]</> : <>[PLAY]</>)
		else return <>[STOP] <Timer /></>
	}, [matchmaking, inGame])

	return <motion.div
		key={`${name}-motion`}
		className={`${name}-motion`}
		whileHover={{
			scale: 1.025,
			transition: { ease: 'easeInOut' }
		}}
		{...animeMatchmaker}
	>
		<NewBox
			tag='btn'
			className={name}
			nameIfPressed={`${name}--pressed`}
			handlers={matchmakerBtnHdl}
			content={btnContent}
		/>
	</motion.div>
})
export default Matchmaker