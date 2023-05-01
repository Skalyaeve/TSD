import React, {
	memo, useMemo, useCallback, useState, useEffect, CSSProperties
} from 'react'
import { Link } from 'react-router-dom'
import { useDrag, useDrop } from 'react-dnd'

// --------USE-BOOL-------------------------------------------------------- //
export const useTgl = (def: boolean): [boolean, () => void] => {
	// ----STATES----------------------------- //
	const [value, setValue] = useState(def)

	// ----HANDLERS--------------------------- //
	const valueToggler = useCallback(() => setValue(x => !x), [value])

	// ----RETURN----------------------------- //
	return [value, valueToggler]
}
export const tglOnUp = (def: boolean): [boolean, React.HTMLAttributes<HTMLElement>] => {
	// ----STATES----------------------------- //
	const [value, valueToggler] = useTgl(def)

	// ----HANDLERS--------------------------- //
	const btnHdl = useMemo(() => ({
		onMouseUp: valueToggler
	}), [valueToggler])

	// ----RETURN----------------------------- //
	return [value, btnHdl]
}
export const tglOnOver = (def: boolean): [boolean, React.HTMLAttributes<HTMLElement>] => {
	// ----STATES----------------------------- //
	const [value, valueToggler] = useTgl(def)

	// ----HANDLERS--------------------------- //
	const btnHdl = useMemo(() => ({
		onMouseEnter: valueToggler,
		onMouseLeave: valueToggler
	}), [valueToggler])

	// ----RETURN----------------------------- //
	return [value, btnHdl]
}


// --------STRING-MANIP---------------------------------------------------- //
export const cutThenCompare = (path1: string, path2: string) => {
	const section1 = path1.split('/')[1]
	const section2 = path2.split('/')[1]
	return section1 === section2
}


// --------TIMER----------------------------------------------------------- //
export const Timer: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [timer, setTimer] = useState(0)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const interval = setInterval(() => {
			setTimer((x) => x + 1)
		}, 1000)

		return () => {
			clearInterval(interval)
			setTimer(0)
		}
	}, [])

	// ----RENDER----------------------------- //
	const formatTime = (time: number) => (time < 10 ? `0${time}` : time)

	return <>{formatTime(Math.floor(timer / 60))}:{formatTime(timer % 60)}</>
})


// --------INPUT----------------------------------------------------------- //
interface InputProps {
	name: string
	PH?: string
}
export const Input: React.FC<InputProps> = memo(({ name, PH = ' ...' }) => {
	// ----RENDER----------------------------- //
	return <input
		className={name}
		id={name}
		name={name}
		placeholder={PH}
	/>
})


// --------NEW-BOX--------------------------------------------------------- //
interface NewBoxProps {
	tag: string
	className?: string
	nameIfPressed?: string
	nameIfOver?: string
	to?: string
	handlers?: React.HTMLAttributes<HTMLElement>
	style?: CSSProperties
	motionProps?: any
	content?: any
}
export const NewBox: React.FC<NewBoxProps> = memo(({
	tag, className, nameIfPressed, nameIfOver, to,
	handlers, style = {}, motionProps = {}, content
}) => {
	// ----STATES----------------------------- //
	const [pressed, setPressed] = useState(false)
	const [over, setOver] = useState(false)

	// ----HANDLERS--------------------------- //
	const mergedHandlers = {
		...handlers,
		onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
			handlers?.onMouseEnter?.(event)
			if (nameIfPressed) setPressed(false)
			if (nameIfOver) setOver(true)
		},
		onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
			handlers?.onMouseLeave?.(event)
			if (nameIfPressed) setPressed(false)
			if (nameIfOver) setOver(false)
		},
		onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
			handlers?.onMouseDown?.(event)
			if (nameIfPressed) setPressed(true)
		},
		onMouseUp: (event: React.MouseEvent<HTMLElement>) => {
			handlers?.onMouseUp?.(event)
			if (nameIfPressed) setPressed(false)
		},
		onDragStart: (event: React.DragEvent<HTMLElement>) => {
			handlers?.onDragStart?.(event)
			if (nameIfPressed) setPressed(false)
		},
		onDragEnd: (event: React.DragEvent<HTMLElement>) => {
			handlers?.onDragEnd?.(event)
			if (nameIfPressed) setPressed(false)
		},
		onDrag: (event: React.DragEvent<HTMLElement>) => {
			handlers?.onDrag?.(event)
			if (nameIfPressed) setPressed(false)
		},
		onDrop: (event: React.DragEvent<HTMLElement>) => {
			handlers?.onDrop?.(event)
			if (nameIfPressed) setPressed(false)
		}
	}

	// ----CLASSNAMES------------------------- //
	const pressedExt = nameIfPressed ? ` ${nameIfPressed}` : ''
	const overExt = nameIfOver ? ` ${nameIfOver}` : ''
	const boxName = `${className}${pressed ? pressedExt : ''}${over ? overExt : ''}`

	// ----RENDER----------------------------- //
	const render = useMemo(() => {
		if (tag === 'Link' && to) return (
			<Link to={to} className={boxName}
				style={style}
				{...mergedHandlers}>
				{content}
			</Link>
		)
		else if (tag === 'btn') return (
			<button className={boxName}
				style={style}
				{...mergedHandlers}>
				{content}
			</button>
		)
		else return (
			<div className={boxName}
				style={style}
				{...mergedHandlers}>
				{content}
			</div>
		)
	}, [pressed, over, tag, className, nameIfPressed,
		nameIfOver, to, handlers, style, content])
	return render
})


// --------DRAG-DROP------------------------------------------------------- //
interface DragDropProps extends React.HTMLAttributes<HTMLDivElement> {
	itemId: number
	content: any
	moveItem: (draggedId: number, droppedId: number) => void
}
export const DragDrop: React.FC<DragDropProps> = memo(({
	itemId, content, moveItem, ...divParams
}) => {
	// ----TYPES------------------------------ //
	interface Item {
		id: number
	}

	// ----HANDLERS--------------------------- //
	const [, drag] = useDrag<Item>({
		type: 'item',
		item: { id: itemId }
	})
	const [, drop] = useDrop<Item>({
		accept: 'item',
		drop: (item) => moveItem(item.id, itemId)
	})

	// ----RENDER----------------------------- //
	return <div ref={(node) => drag(drop(node))} {...divParams}>
		{content}
	</div >
})