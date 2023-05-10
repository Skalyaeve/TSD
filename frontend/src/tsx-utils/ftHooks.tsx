import { useMemo, useCallback, useState } from 'react'

import { getSignChangeRandXY } from './ftNumbers.tsx'

// --------USE-BOOL-------------------------------------------------------- //
export const useTgl = (def: boolean): [boolean, () => void] => {
	const [value, setValue] = useState(def)
	const valueToggler = useCallback(() => setValue(x => !x), [])

	return [value, valueToggler]
}

export const tglOnUp = (def: boolean): [boolean, React.HTMLAttributes<HTMLElement>] => {
	const [value, tglValue] = useTgl(def)
	const valueHdl = useMemo(() => ({ onMouseUp: tglValue }), [])

	return [value, valueHdl]
}

export const tglOnOver = (def: boolean): [boolean, React.HTMLAttributes<HTMLElement>] => {
	const [value, tglValue] = useTgl(def)
	const valueHdl = useMemo(() => ({
		onMouseEnter: tglValue,
		onMouseLeave: tglValue
	}), [])

	return [value, valueHdl]
}

// --------USE-NUMBER------------------------------------------------------ //
export const useRandomXY = (min: number, max: number): [
	{ x: number, y: number }, () => void
] => {
	const [randomXY, setRandomXY] = useState(getSignChangeRandXY(min, max))

	const doRandomXY = useCallback(() => {
		setRandomXY(getSignChangeRandXY(min, max))
	}, [])

	return [randomXY, doRandomXY]
}