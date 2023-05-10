import React, { useState, useEffect, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

import { tglOnOver } from '../tsx-utils/ftHooks.tsx'
import { FtDiv, FtMotionBtn } from '../tsx-utils/ftBox.tsx'
import { fade, xMove, yMove } from '../tsx-utils/ftFramerMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const CHAR_COUNT = 9

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'character'
const PRESSED_NAME = `${NAME}-box--pressed`

// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBox: React.FC<CharBoxProps> = memo(({ id, setSelected }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`

	// ----RENDER----------------------------- //
	return <FtMotionBtn className={boxName}
		pressedName={PRESSED_NAME}
		handler={{ onMouseUp: () => setSelected(id) }}
		motionProps={yMove({
			from: 200 * id,
			inDuration: 0.7 + (0.025 * id),
			outDuration: 0.5
		})}
		content={`[Character #${id}]`}
	/>
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
	const [tooltip, tglTooltip] = tglOnOver(false)

	// ----CLASSNAMES------------------------- //
	const boxName = `${spellName}-box`
	const tooltipName = `${spellName}-tooltip`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...fade({ inDuration: 0.25 })}>

		<FtDiv className={spellName}
			handler={tglTooltip}
			content={content}
		/>

		<AnimatePresence>
			{tooltip && <motion.div className={tooltipName}
				{...xMove({ from: 50, inDuration: 0.3 })}>

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
	const contentMotionDuration = 0.25

	// ----CLASSNAMES------------------------- //
	const skinName = `${NAME}-skin`
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellName = `${NAME}-spell`
	const spellzName = `${spellName}s`
	const contentName = (preffix: string) => `${preffix}-content`

	// ----RENDER----------------------------- //
	return <motion.div className={NAME}
		{...fade({ inDuration: 1, outDuration: 0.5 })}>
		<AnimatePresence mode='wait'>
			<div className={skinName} key={`${skinName}-${selected}`}>
				<motion.div className={contentName(skinName)}
					{...fade({ inDuration: contentMotionDuration })}>
					CHARACTER #{selected}
				</motion.div>
			</div>
		</AnimatePresence>

		<AnimatePresence mode='wait'>
			<div className={statsName} key={`${statsName}-${selected}`}>
				<motion.div className={contentName(statsName)}
					{...fade({ inDuration: contentMotionDuration })}>
					STATS
				</motion.div>
			</div>
		</AnimatePresence>

		<AnimatePresence mode='wait'>
			<div className={storyName} key={`${storyName}-${selected}`}>
				<motion.div className={contentName(storyName)}
					{...fade({ inDuration: contentMotionDuration })}>
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
		{...fade({ inDuration: 1, outDuration: 0.5 })}>
		<Character selected={selected} />
		<CharBoxes setSelected={setSelected} />
	</motion.main>
}
export default Characters