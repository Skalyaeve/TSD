import React, { useState, useEffect } from 'react'

// --------TIMER----------------------------------------------------------- //
export const timeFormat = (time: number) => (time < 10 ? `0${time}` : time)

export const Timer: React.FC = () => {
	// ----STATES----------------------------- //
	const [timer, setTimer] = useState(0)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const interval = setInterval(() => setTimer(x => x + 1), 1000)
		return () => clearInterval(interval)
	}, [])

	// ----RENDER----------------------------- //
	return <>{timeFormat(Math.floor(timer / 60))}:{timeFormat(timer % 60)}</>
}

// --------RANDOM---------------------------------------------------------- //
export const getRandXY = (min: number, max: number) => ({
	x: min + Math.random() * (max - min),
	y: min + Math.random() * (max - min)
})

export const getRand = (min: number, max: number) => (
	min + Math.random() * (max - min)
)

export const getSignChangingRandXY = (min: number, max: number) => ({
	x: (min + Math.random() * (max - min)) * (Math.random() < 0.5 ? -1 : 1),
	y: (min + Math.random() * (max - min)) * (Math.random() < 0.5 ? -1 : 1)
})

export const getSignChangingRand = (min: number, max: number) => (
	(min + Math.random() * (max - min)) * (Math.random() < 0.5 ? -1 : 1)
)