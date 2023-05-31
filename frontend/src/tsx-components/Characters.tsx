import React, { useRef, useState, useEffect, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, xMove, yMove } from '../tsx-utils/ftMotion.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'character'

// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	swapping: React.MutableRefObject<boolean>
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBox: React.FC<CharBoxProps> = ({ id, swapping, setSelected }) => {
	// ----HANDLERS--------------------------- //
	const boxHdl = {
		onMouseUp: () => {
			if (!swapping.current) {
				setSelected(id)
				swapping.current = true
				const timer = setTimeout(() => swapping.current = false, 300)
				return () => clearTimeout(timer)
			}
		}
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 200 * id,
		inDuration: 0.7 + 0.02 * id,
		outDuration: 0.5 - 0.01 * id
	})

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...boxHdl} {...boxMotion} />
}

// --------CHARACTER-BOXES------------------------------------------------- //
interface CharBoxesProps {
	swapping: React.MutableRefObject<boolean>
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBoxes: React.FC<CharBoxesProps> = memo(({ swapping, setSelected }) => {
	// ----VALUES----------------------------- //
	const count = 9

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s-select`

	// ----RENDER----------------------------- //
	const render = Array.from({ length: count }, (_, index) =>
		<CharBox
			key={index + 1}
			id={index + 1}
			swapping={swapping}
			setSelected={setSelected}
		/>
	)
	return <div className={boxName}>{render}</div>
})

// --------SPELL----------------------------------------------------------- //
interface SpellProps {
	spellName: string
	content: string
}
const Spell: React.FC<SpellProps> = ({ spellName, content }) => {
	// ----REFS------------------------------- //
	const spellNameRef = useRef<HTMLDivElement | null>(null)

	// ----STATES----------------------------- //
	const [tooltip, setToolTip] = useState(false)
	const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

	// ----EFFECTS----------------------------//
	useEffect(() => {
		const chatSizeObserver = new ResizeObserver(updateTooltipPos)
		spellNameRef.current && chatSizeObserver.observe(spellNameRef.current)
		window.addEventListener('scroll', updateTooltipPos)
		window.addEventListener('resize', updateTooltipPos)
		return () => {
			spellNameRef.current && (
				chatSizeObserver.unobserve(spellNameRef.current)
			)
		}
	}, [])

	// ----HANDLERS--------------------------- //
	const updateTooltipPos = () => {
		if (spellNameRef.current) {
			const rect = spellNameRef.current.getBoundingClientRect()
			setTooltipPos({ x: rect.left, y: rect.top })
		}
	}
	const boxHdl = {
		onMouseEnter: () => setToolTip(true),
		onMouseLeave: () => setToolTip(false)
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 0.3, outDuration: 0.3 })
	const tooltipMotion = xMove({
		from: -50,
		inDuration: 0.3,
		outDuration: 0.3
	})

	// ----CLASSNAMES------------------------- //
	const tooltipName = `${spellName}-tooltip`

	// ----RENDER----------------------------- //
	return <>
		<motion.div
			ref={spellNameRef}
			className={spellName}
			{...boxHdl}
			{...boxMotion}>
			{content}
		</motion.div>
		<AnimatePresence>
			{tooltip && <motion.div
				className={tooltipName}
				{...tooltipMotion}
				style={{
					top: `${tooltipPos.y - 305}px`,
					left: `${tooltipPos.x - 260}px`
				}}>
				TOOLTIP
			</motion.div>}
		</AnimatePresence>
	</>
}

// --------CHARACTER------------------------------------------------------- //
interface CharacterProps {
	selected: number
}
const Character: React.FC<CharacterProps> = ({ selected }) => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 0.3, outDuration: 0.3 })

	// ----CLASSNAMES------------------------- //
	const skinName = `${NAME}-skin`
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellName = `${NAME}-spell`
	const spellzName = `${spellName}s`
	const contentName = (preffix: string) => `${preffix}-content ${NAME}-content`

	// ----RENDER----------------------------- //
	return <motion.div className={NAME}>
		<AnimatePresence mode='wait'>
			<div className={skinName} key={`${skinName}-${selected}`}>
				<motion.div className={contentName(skinName)} {...boxMotion} />
			</div>
		</AnimatePresence>
		<AnimatePresence mode='wait'>
			<div className={statsName} key={`${statsName}-${selected}`}>
				<motion.div className={contentName(statsName)} {...boxMotion}>
					STATS
				</motion.div>
			</div>
		</AnimatePresence>
		<AnimatePresence mode='wait'>
			<div className={storyName} key={`${storyName}-${selected}`}>
				<motion.div className={contentName(storyName)} {...boxMotion}>
					STORY
				</motion.div>
			</div>
		</AnimatePresence>
		<AnimatePresence mode='wait'>
			<div className={spellzName} key={`${spellzName}-${selected}`}>
				<Spell spellName={spellName} content='' />
				<Spell spellName={spellName} content='' />
			</div>
		</AnimatePresence>
	</motion.div>
}

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = () => {
	// ----REFS------------------------------- //
	const swapping = useRef(false)

	// ----STATES----------------------------- //
	const [selected, setSelected] = useState(1)

	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s main`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName} {...boxMotion}>
		<CharBoxes swapping={swapping} setSelected={setSelected} />
		<Character selected={selected} />
	</motion.main>
}
export default Characters