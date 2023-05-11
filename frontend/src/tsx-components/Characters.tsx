import React, { useState, useEffect, memo } from 'react'
import { AnimatePresence, MotionProps, motion } from 'framer-motion'
import { fade, xMove, yMove } from '../tsx-utils/ftMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const CHAR_COUNT = 9

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'character'

// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBox: React.FC<CharBoxProps> = memo(({ id, setSelected }) => {
	// ----HANDLERS--------------------------- //
	const boxHdl = { onMouseUp: () => setSelected(id) }

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`

	// ----RENDER----------------------------- //
	return <motion.button className={boxName}
		{...boxHdl}
		{...yMove({ from: 200 * id }) as MotionProps}>
		[Character #${id}]
	</motion.button>
})

// --------CHARACTER-BOXES------------------------------------------------- //
interface CharBoxesProps {
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBoxes: React.FC<CharBoxesProps> = memo(({ setSelected }) => {
	// ----STATES----------------------------- //
	const [animating, setAnimating] = useState(true)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const timer = setTimeout(() => setAnimating(false), 1250)
		return () => clearTimeout(timer)
	}, [])

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s-select`

	// ----RENDER----------------------------- //
	const render = Array.from({ length: CHAR_COUNT }, (_, index) => (
		<CharBox key={index + 1} id={index + 1} setSelected={setSelected} />
	))

	return <motion.div className={boxName}
		exit={{ overflowY: 'hidden' }}
		style={{ overflowY: (animating ? 'hidden' : 'auto') }}>
		{render}
	</motion.div>
})

// --------SPELL----------------------------------------------------------- //
interface SpellProps {
	spellName: string
	content: string
}
const Spell: React.FC<SpellProps> = ({ spellName, content }) => {
	// ----STATES----------------------------- //
	const [tooltip, setToolTip] = useState(false)

	// ----HANDLERS--------------------------- //
	const boxHdl = {
		onMouseEnter: () => setToolTip(true),
		onMouseLeave: () => setToolTip(false)
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${spellName}-box`
	const tooltipName = `${spellName}-tooltip`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...fade({}) as MotionProps}>
		<motion.div className={spellName}
			{...boxHdl}>
			{content}
		</motion.div>

		<AnimatePresence>
			{tooltip && <motion.div className={tooltipName}
				{...xMove({ from: 50 }) as MotionProps}>

				TOOLTIP
			</motion.div>}
		</AnimatePresence>
	</motion.div>
}

// --------CHARACTER------------------------------------------------------- //
interface CharacterProps {
	selected: number
}
const Character: React.FC<CharacterProps> = ({ selected }) => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({})

	// ----CLASSNAMES------------------------- //
	const skinName = `${NAME}-skin`
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellName = `${NAME}-spell`
	const spellzName = `${spellName}s`
	const contentName = (preffix: string) => `${preffix}-content`

	// ----RENDER----------------------------- //
	return <motion.div className={NAME}
		{...boxMotion as MotionProps}>
		<AnimatePresence mode='wait'>
			<div className={skinName} key={`${skinName}-${selected}`}>
				<motion.div className={contentName(skinName)}
					{...boxMotion as MotionProps}>
					CHARACTER #{selected}
				</motion.div>
			</div>
		</AnimatePresence>

		<AnimatePresence mode='wait'>
			<div className={statsName} key={`${statsName}-${selected}`}>
				<motion.div className={contentName(statsName)}
					{...boxMotion as MotionProps}>
					STATS
				</motion.div>
			</div>
		</AnimatePresence>

		<AnimatePresence mode='wait'>
			<div className={storyName} key={`${storyName}-${selected}`}>
				<motion.div className={contentName(storyName)}
					{...boxMotion as MotionProps}>
					STORY
				</motion.div>
			</div>
		</AnimatePresence>

		<AnimatePresence mode='wait'>
			<div className={spellzName} key={`${spellzName}-${selected}`}>
				<Spell spellName={spellName}
					content='ACTIVE'
				/>
				<Spell spellName={spellName}
					content='PASSIVE'
				/>
			</div>
		</AnimatePresence>
	</motion.div>
}

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = () => {
	// ----STATES----------------------------- //
	const [selected, setSelected] = useState(1)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s main`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...fade({}) as MotionProps}>
		<Character selected={selected} />
		<CharBoxes setSelected={setSelected} />
	</motion.main>
}
export default Characters