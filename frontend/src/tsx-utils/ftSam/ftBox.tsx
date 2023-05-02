import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimationControls } from 'framer-motion'

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
	className?: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	content?: any
}
export const FtDiv: React.FC<FtDivProps> = ({
	className, handler, pressedName, overName, style = {}, content
}) => {
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
	), [])

	// ----RENDER----------------------------- //
	return <div className={name}
		style={style}
		{...mergedHandlers}>
		{content}
	</div>
}

// --------BUTTON---------------------------------------------------------- //
interface FtBtnProps {
	className?: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	content?: any
}
export const FtBtn: React.FC<FtBtnProps> = ({
	className, handler, pressedName, overName, style = {}, content
}) => {
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
	), [])

	// ----RENDER----------------------------- //
	return <button className={name}
		style={style}
		{...mergedHandlers}>
		{content}
	</button>
}

// --------LINK------------------------------------------------------------ //
interface FtLinkProps {
	to: string
	className?: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	content?: any
}
export const FtLink: React.FC<FtLinkProps> = ({
	to, className, pressedName, overName, handler, style = {}, content
}) => {
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
	), [])

	// ----RENDER----------------------------- //
	return <Link className={name}
		to={to}
		style={style}
		{...mergedHandlers}>
		{content}
	</Link>
}

// --------INPUT----------------------------------------------------------- //
interface FtInputProps {
	name: string
	PH?: string
}
export const FtInput: React.FC<FtInputProps> = ({
	name, PH = ' ...'
}) => {
	// ----RENDER----------------------------- //
	return <input className={name}
		id={name}
		name={name}
		placeholder={PH}
	/>
}

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
	className?: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	motionProps?: {}
	content?: any
}
export const FtMotionDiv: React.FC<FtMotionDivProps> = ({
	className, handler, pressedName, overName, style = {}, motionProps = {}, content
}) => {
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
	), [])

	// ----RENDER----------------------------- //
	return <motion.div className={name}
		style={style}
		{...motionProps}
		{...mergedHandlers}>
		{content}
	</motion.div>
}

// --------MOTION-BUTTON--------------------------------------------------- //
interface FtMotionBtnProps {
	className?: string;
	pressedName?: string;
	overName?: string;
	handler?: React.HTMLAttributes<HTMLElement>;
	style?: React.CSSProperties;
	motionProps?: {};
	animate?: AnimationControls;
	content?: any;
}
export const FtMotionBtn = React.forwardRef<HTMLButtonElement, FtMotionBtnProps>(
	(
		{
			className,
			handler,
			pressedName,
			overName,
			style = {},
			motionProps = {},
			animate,
			content,
		},
		ref
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
		), [])

		// ----RENDER----------------------------- //
		return <motion.button className={name}
			animate={animate}
			ref={ref}
			style={style}
			{...motionProps}
			{...mergedHandlers}>
			{content}
		</motion.button>
	}
)

// --------MOTION-LINK----------------------------------------------------- //
interface FtMotionLinkProps {
	to: string
	className?: string
	pressedName?: string
	overName?: string
	handler?: React.HTMLAttributes<HTMLElement>
	style?: React.CSSProperties
	motionProps?: {}
	content?: any
}
export const FtMotionLink: React.FC<FtMotionLinkProps> = ({
	to, className, handler, pressedName, overName, style = {}, motionProps = {}, content
}) => {
	// ----CLASSNAMES------------------------- //
	const motionName = `${className}-motion`

	// ----RENDER----------------------------- //
	return <motion.div className={motionName}
		{...motionProps}>
		<FtLink className={className}
			to={to}
			pressedName={pressedName}
			overName={overName}
			handler={handler}
			style={style}
			content={content}
		/>
	</motion.div>
}