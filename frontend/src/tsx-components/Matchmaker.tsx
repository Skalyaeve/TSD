import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { useMotionValue } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { FtMotionBtn } from '../tsx-utils/ftSam/ftBox.tsx'
import { tglOnOver } from '../tsx-utils/ftSam/ftHooks.tsx'
import { Timer, getMaxedXYrand } from '../tsx-utils/ftSam/ftNumbers.tsx'
import { bouncyComeFromCol } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------PARTY-INFOS----------------------------------------------------- //
export const GameInfos: React.FC = () => {
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
	const [isOver, isOverHdl] = tglOnOver(false)
	const randomXY = useRef(getMaxedXYrand(7))
	const usedXY = useRef(randomXY.current)

	const animation = useMotionValue(0);

	// ----EFFECTS---------------------------- //
	useEffect(() => (
		localStorage.setItem('inGame', inGame ? '1' : '0')
	), [inGame])

	useEffect(() => {
		if (!matchmaking) return

		const timer = setTimeout(() => {
			setMatchmaking(false)
			setInGame(true)
			navigate('/game')
		}, 2000)

		return () => clearTimeout(timer)
	}, [matchmaking])

	useEffect(() => {
		if (!isOver) return

		const randInterval = setInterval(() => {
			randomXY.current = getMaxedXYrand(7)
		}, 4000)

		let usedIntervalFromUsed: NodeJS.Timer | null = null
		const timer = setTimeout(() => {
			usedXY.current = {
				x: -usedXY.current.x,
				y: -usedXY.current.y,
			}
			usedIntervalFromUsed = setInterval(() => {
				usedXY.current = {
					x: -usedXY.current.x,
					y: -usedXY.current.y,
				}
			}, 4000)
		}, 2000)

		const usedIntervalFromRand = setInterval(() => {
			usedXY.current = {
				x: randomXY.current.x,
				y: randomXY.current.y,
			}
		}, 4000)

		return () => {
			clearInterval(randInterval)
			clearTimeout(timer)
			if (usedIntervalFromUsed) clearInterval(usedIntervalFromUsed)
			clearInterval(usedIntervalFromRand)
		}
	}, [isOver])

	useEffect(() => {
		if (isOver) animation.start({
			x: 100,
			transition: {
				duration: 1,
				ease: "easeInOut",
			},
		});
	}, [usedXY.current.x, usedXY.current.y, isOver])

	// ----HANDLERS--------------------------- //
	const toggleMatchmaker = useCallback(() => {
		if (!matchmaking && !inGame) setMatchmaking(true)
		else if (inGame) {
			setInGame(false)
			navigate('/')
		} else setMatchmaking(false)
	}, [matchmaking, inGame])

	const matchmakerBtnHdl = useMemo(() => ({
		...isOverHdl,
		onMouseUp: toggleMatchmaker
	}), [toggleMatchmaker])

	// ----CLASSNAMES------------------------- //
	const name = 'matchmaker'

	// ----ANIMATIONS------------------------- //
	const btnMotion = useMemo(() => {
		const bouncyComeFromColAnimation = bouncyComeFromCol(185, 20, 0.75, 1)
		return {
			...bouncyComeFromColAnimation,
			whileHover: {
				scale: 1.02,
				transition: {
					duration: 1,
					ease: 'linear',
					repeat: Infinity,
					repeatType: 'reverse',
				},
			},
		}
	}, [])

	// ----RENDER----------------------------- //
	const btnContent = useMemo(() => {
		if (!matchmaking) return (inGame ? <>[EXIT]</> : <>[PLAY]</>)
		else return <>[STOP] <Timer /></>
	}, [matchmaking, inGame])

	return <FtMotionBtn className={name}
		pressedName={`${name}--pressed`}
		handler={matchmakerBtnHdl}
		motionProps={btnMotion}
		animate={animation}
		content={btnContent}
	/>
}
export default Matchmaker