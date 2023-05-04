import React, { memo, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, MotionStyle } from 'framer-motion'

// ------------------------------------------------------------------------ //
// --------BOX------------------------------------------------------------- //
// ------------------------------------------------------------------------ //

// --------BOX-HANDLERS---------------------------------------------------- //
const newBoxHandlers = (
	setPressed: React.Dispatch<React.SetStateAction<boolean>>,
	setOver: React.Dispatch<React.SetStateAction<boolean>>,
	handler?: React.HTMLAttributes<HTMLElement>,
	pressedName?: string,
	overName?: string
) => ({
	...handler,
	onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseEnter?.(event)
		if (overName) setOver(true)
	},
	onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseLeave?.(event)
		if (overName) setOver(false)
		if (pressedName) setPressed(false)
	},
	onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseDown?.(event)
		if (pressedName) setPressed(true)
	},
	onMouseUp: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseUp?.(event)
		if (pressedName) setPressed(false)
	},
	onDragStart: (event: React.DragEvent<HTMLElement>) => {
		handler?.onDragStart?.(event)
	},
	onDragEnd: (event: React.DragEvent<HTMLElement>) => {
		handler?.onDragEnd?.(event)
	},
	onDrag: (event: React.DragEvent<HTMLElement>) => {
		handler?.onDrag?.(event)
	},
	onDrop: (event: React.DragEvent<HTMLElement>) => {
		handler?.onDrop?.(event)
	}
})

// --------DIV------------------------------------------------------------- //
interface FtDivProps {
	className: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	content?: any
}
export const FtDiv = memo(React.forwardRef<HTMLDivElement, FtDivProps>((
	{ className, pressedName, overName, handler, style, content }, ref
) => {
	// ----STATES----------------------------- //
	const [pressed, setPressed] = useState(false)
	const [over, setOver] = useState(false)

	// ----CLASSNAMES------------------------- //
	const pressedExtName = pressedName ? ` ${pressedName}` : ''
	const overExtName = overName ? ` ${overName}` : ''
	const name = `${className}${pressed ? pressedExtName : ''}${over ? overExtName : ''}`

	// ----HANDLERS--------------------------- //
	const mergedHandlers = useMemo(() => (
		newBoxHandlers(setPressed, setOver, handler, pressedName, overName)
	), [handler, pressedName, overName])

	// ----RENDER----------------------------- //
	return <div className={name}
		ref={ref}
		style={style}
		{...mergedHandlers}>
		{content}
	</div>
}))

// --------BUTTON---------------------------------------------------------- //
interface FtBtnProps {
	className: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	content?: any
}
export const FtBtn = memo(React.forwardRef<HTMLButtonElement, FtBtnProps>((
	{ className, pressedName, overName, handler, style, content }, ref
) => {
	// ----STATES----------------------------- //
	const [pressed, setPressed] = useState(false)
	const [over, setOver] = useState(false)

	// ----CLASSNAMES------------------------- //
	const pressedExtName = pressedName ? ` ${pressedName}` : ''
	const overExtName = overName ? ` ${overName}` : ''
	const name = `${className}${pressed ? pressedExtName : ''}${over ? overExtName : ''}`

	// ----HANDLERS--------------------------- //
	const mergedHandlers = useMemo(() => (
		newBoxHandlers(setPressed, setOver, handler, pressedName, overName)
	), [handler, pressedName, overName])

	// ----RENDER----------------------------- //
	return <button className={name}
		ref={ref}
		style={style}
		{...mergedHandlers}>
		{content}
	</button>
}))

// --------LINK------------------------------------------------------------ //
interface FtLinkProps {
	to: string
	className: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	content?: any
}
export const FtLink = memo(React.forwardRef<HTMLAnchorElement, FtLinkProps>((
	{ to, className, pressedName, overName, handler, style, content }, ref
) => {
	// ----STATES----------------------------- //
	const [pressed, setPressed] = useState(false)
	const [over, setOver] = useState(false)

	// ----CLASSNAMES------------------------- //
	const pressedExtName = pressedName ? ` ${pressedName}` : ''
	const overExtName = overName ? ` ${overName}` : ''
	const name = `${className}${pressed ? pressedExtName : ''}${over ? overExtName : ''}`

	// ----HANDLERS--------------------------- //
	const mergedHandlers = useMemo(() => (
		newBoxHandlers(setPressed, setOver, handler, pressedName, overName)
	), [handler, pressedName, overName])

	// ----RENDER----------------------------- //
	return <Link className={name}
		ref={ref}
		to={to}
		style={style}
		{...mergedHandlers}>
		{content}
	</Link>
}))

// --------INPUT----------------------------------------------------------- //
interface FtInputProps {
	name: string
	PH?: string
}
export const FtInput = memo(React.forwardRef<HTMLInputElement, FtInputProps>((
	{ name, PH = ' ...' }, ref
) => {
	// ----RENDER----------------------------- //
	return <input className={name}
		ref={ref}
		id={name}
		name={name}
		placeholder={PH}
	/>
}))

// ------------------------------------------------------------------------ //
// --------MOTION-BOX------------------------------------------------------ //
// ------------------------------------------------------------------------ //

// --------MOTION-BOX-HANDLERS--------------------------------------------- //
const newMotionBoxHandlers = (
	setPressed: React.Dispatch<React.SetStateAction<boolean>>,
	setOver: React.Dispatch<React.SetStateAction<boolean>>,
	handler?: React.HTMLAttributes<HTMLElement>,
	pressedName?: string,
	overName?: string
) => ({
	onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseEnter?.(event)
		if (overName) setOver(true)
	},
	onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseLeave?.(event)
		if (overName) setOver(false)
		if (pressedName) setPressed(false)
	},
	onMouseDown: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseDown?.(event)
		if (pressedName) setPressed(true)
	},
	onMouseUp: (event: React.MouseEvent<HTMLElement>) => {
		handler?.onMouseUp?.(event)
		if (pressedName) setPressed(false)
	}
})

// --------MOTION-DIV------------------------------------------------------ //
interface FtMotionDivProps {
	className: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	motionProps?: {}
	style?: MotionStyle
	content?: any
}
export const FtMotionDiv = memo(React.forwardRef<HTMLDivElement, FtMotionDivProps>((
	{ className, pressedName, overName, handler, motionProps, style, content }, ref
) => {
	// ----STATES----------------------------- //
	const [pressed, setPressed] = useState(false)
	const [over, setOver] = useState(false)

	// ----CLASSNAMES------------------------- //
	const pressedExtName = pressedName ? ` ${pressedName}` : ''
	const overExtName = overName ? ` ${overName}` : ''
	const name = `${className}${pressed ? pressedExtName : ''}${over ? overExtName : ''}`

	// ----HANDLERS--------------------------- //
	const mergedHandlers = useMemo(() => (
		newMotionBoxHandlers(setPressed, setOver, handler, pressedName, overName)
	), [handler, pressedName, overName])

	// ----RENDER----------------------------- //
	return <motion.div className={name}
		ref={ref}
		style={style}
		{...motionProps}
		{...mergedHandlers}>
		{content}
	</motion.div>
}))

// --------MOTION-BUTTON--------------------------------------------------- //
interface FtMotionBtnProps {
	className: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	motionProps?: {}
	style?: MotionStyle
	content?: any
}
export const FtMotionBtn = memo(React.forwardRef<HTMLButtonElement, FtMotionBtnProps>((
	{ className, pressedName, overName, handler, motionProps, style, content }, ref
) => {
	// ----STATES----------------------------- //
	const [pressed, setPressed] = useState(false)
	const [over, setOver] = useState(false)

	// ----CLASSNAMES------------------------- //
	const pressedExtName = pressedName ? ` ${pressedName}` : ''
	const overExtName = overName ? ` ${overName}` : ''
	const name = `${className}${pressed ? pressedExtName : ''}${over ? overExtName : ''}`

	// ----HANDLERS--------------------------- //
	const mergedHandlers = useMemo(() => (
		newMotionBoxHandlers(setPressed, setOver, handler, pressedName, overName)
	), [handler, pressedName, overName])

	// ----RENDER----------------------------- //
	return <motion.button className={name}
		ref={ref}
		style={style}
		{...motionProps}
		{...mergedHandlers}>
		{content}
	</motion.button>
}))

// --------MOTION-LINK----------------------------------------------------- //
interface FtMotionLinkProps {
	to: string
	className: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	motionProps?: {}
	style?: MotionStyle
	content?: any
}
export const FtMotionLink = memo(React.forwardRef<HTMLDivElement, FtMotionLinkProps>((
	{ to, className, pressedName, overName, handler, motionProps, style, content }, ref
) => {
	// ----RENDER----------------------------- //
	return <motion.div className={`${className}-motion`}
		ref={ref}
		style={style}
		{...motionProps}>
		<FtLink className={className}
			to={to}
			pressedName={pressedName}
			overName={overName}
			handler={handler}
			content={content}
		/>
	</motion.div>
}))