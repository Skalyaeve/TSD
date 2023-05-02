import React, { useState, useEffect } from 'react'

// --------TIMER----------------------------------------------------------- //
export const timeFormat = (time: number) => (time < 10 ? `0${time}` : time)

export const Timer: React.FC = () => {
	// ----STATES----------------------------- //
	const [timer, setTimer] = useState(0)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const interval = setInterval(() => setTimer((x) => x + 1), 1000)
		return () => clearInterval(interval)
	}, [])

	// ----RENDER----------------------------- //
	return <>{timeFormat(Math.floor(timer / 60))}:{timeFormat(timer % 60)}</>
}

// --------RANDOM---------------------------------------------------------- //
export const getMaxedXYrand = (maxDist: number) => ({
	x: Math.random() * maxDist * (Math.random() < 0.5 ? -1 : 1),
	y: Math.random() * maxDist * (Math.random() < 0.5 ? -1 : 1)
})

export const getMaxedRand = (maxDist: number) => (
	Math.random() * maxDist * (Math.random() < 0.5 ? -1 : 1)
)