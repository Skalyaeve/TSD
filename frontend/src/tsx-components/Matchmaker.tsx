import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import { FtMotionBtn } from '../tsx-utils/ftSam/ftBox.tsx'
import { Timer } from '../tsx-utils/ftSam/ftNumbers.tsx'
import { bouncyComeFromCol, bouncyHeightGrowByPx } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------PARTY-INFOS----------------------------------------------------- //
export const GameInfos: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const name = 'gameInfo'
	const boxName = `${name}s`
	const playerPPName = `${name}-player`
	const scoreName = `${name}-score`
	const timerName = `${name}-timer`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...bouncyHeightGrowByPx(275)}>
		<div className={playerPPName}>Player 1</div>
		<div className={playerPPName}>Player 2</div>
		<div className={scoreName}>0</div>
		<div className={scoreName}>0</div>
		<div className={timerName}><Timer /></div>
	</motion.div>
}

// --------MATCHMAKER------------------------------------------------------ //
const Matchmaker: React.FC = () => {
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
	const toggleMatchmaker = useCallback(() => {
		if (!matchmaking && !inGame) setMatchmaking(true)
		else if (inGame) {
			localStorage.setItem('inGame', '0')
			setInGame(false)
			navigate('/')
		} else setMatchmaking(false)
	}, [matchmaking, inGame])

	const matchmakerBtnHdl = useMemo(() => ({
		onMouseUp: toggleMatchmaker
	}), [toggleMatchmaker])

	// ----ANIMATIONS------------------------- //
	const btnMotion = useMemo(() => {
		const bouncyComeFromColAnimation = bouncyComeFromCol(185, 20, 0.75, 0.9)
		return {
			...bouncyComeFromColAnimation,
			whileHover: {
				rotate: [0, -5, 5, 0],
				transition: { ease: 'easeIn' }
			},
			whileTap: {
				rotate: [0, 5, -5, 5, -5, 0],
				transition: { ease: 'easeInOut' }
			}
		}
	}, [])

	// ----CLASSNAMES------------------------- //
	const name = 'matchmaker'
	const pressedName = `${name}--pressed`

	// ----RENDER----------------------------- //
	const btnContent = useMemo(() => {
		if (!matchmaking) return inGame ? <>[EXIT]</> : <>[PLAY]</>
		else return <>[STOP] <Timer /></>
	}, [matchmaking, inGame])

	return <FtMotionBtn
		className={name}
		pressedName={pressedName}
		handler={matchmakerBtnHdl}
		motionProps={btnMotion}
		content={btnContent}
	/>
}
export default Matchmaker	