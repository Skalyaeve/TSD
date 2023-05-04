import { useCallback, useState } from 'react'

import { getMaxedXYrand } from './ftNumbers.tsx'

// --------USE-BOOL-------------------------------------------------------- //
export const useTgl = (def: boolean): [boolean, () => void] => {
	const [value, setValue] = useState(def)
	const valueToggler = useCallback(() => setValue(x => !x), [value])

	return [value, valueToggler]
}

export const useTglBis = (defaultValue: boolean): [
	boolean, () => void, () => void
] => {
	const [state, setState] = useState(defaultValue)
	const setTrue = useCallback(() => setState(true), [])
	const setFalse = useCallback(() => setState(false), [])

	return [state, setTrue, setFalse]
}

export const tglOnUp = (def: boolean): [boolean, React.HTMLAttributes<HTMLElement>] => {
	const [value, valueToggler] = useTgl(def)
	const btnHdl = { onMouseUp: valueToggler }

	return [value, btnHdl]
}

export const tglOnOver = (def: boolean): [boolean, React.HTMLAttributes<HTMLElement>] => {
	const [value, valeTrue, valueFalse] = useTglBis(def)
	const btnHdl = {
		onMouseEnter: valeTrue,
		onMouseLeave: valueFalse
	}

	return [value, btnHdl]
}

// --------USE-NUMBER------------------------------------------------------ //
export const useRandomXY = (maxDistance: number): [
	{ x: number, y: number }, () => void
] => {
	const [randomXY, setRandomXY] = useState(getMaxedXYrand(maxDistance))

	const doRandomXY = useCallback(() => (
		setRandomXY(getMaxedXYrand(maxDistance))
	), [])

	return [randomXY, doRandomXY]
}