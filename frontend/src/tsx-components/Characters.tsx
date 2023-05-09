import React, { memo, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, MotionStyle, motion } from 'framer-motion'

import { FtMotionBtn, FtDiv } from '../tsx-utils/ftSam/ftBox.tsx'
import { tglOnOver } from '../tsx-utils/ftSam/ftHooks.tsx'
import { fade, yMove, heightChangeByPercent } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const CHAR_COUNT = 9

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'character'
const PRESSED_NAME = `${NAME}-btn--pressed`

// --------SPELL----------------------------------------------------------- //
interface SpellProps {
	spellName: string
	content: string
	selected: number
}
const Spell: React.FC<SpellProps> = ({ spellName, content, selected }) => {
	// ----STATES----------------------------- //
	const [tooltip, tglTooltip] = tglOnOver(false)

	// ----ANIMATIONS------------------------- //
	const boxMotion = useMemo(() => fade({ inDuration: 0.2 }), [])

	// ----CLASSNAMES------------------------- //
	const boxName = `${spellName}-box`
	const tooltipName = `${spellName}-tooltip`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName}
		{...boxMotion}>
		<FtDiv className={spellName}
			handler={tglTooltip}
			content={content}
		/>
		{tooltip && <motion.div className={tooltipName}
			{...fade({})}>
			TOOLTIP
		</motion.div>}
	</motion.div>
}

// --------CHARACTER------------------------------------------------------- //
interface CharacterProps {
	selected: number
}
const Character: React.FC<CharacterProps> = ({ selected }) => {
	// ----ANIMATIONS------------------------- //
	const contentMotionDuration = 0.2

	// ----CLASSNAMES------------------------- //
	const skinName = `${NAME}-skin`
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellName = `${NAME}-spell`
	const spellzName = `${spellName}s`

	// ----RENDER----------------------------- //
	return <motion.div className={NAME}
		{...heightChangeByPercent({
			inDuration: 1,
			outDuration: 0.5
		})}>
		<AnimatePresence mode='wait'>
			<div className={skinName}
				key={`${skinName}-${selected}`}>
				<motion.div className={`${skinName}-content`}
					{...fade({ inDuration: contentMotionDuration })}>
					CHARACTER #{selected}
				</motion.div>
			</div>
			<div className={statsName}
				key={`${statsName}-${selected}`}>
				<motion.div className={`${statsName}-content`}
					{...fade({ inDuration: contentMotionDuration })}>
					STATS
				</motion.div>
			</div>
			<div className={storyName}
				key={`${storyName}-${selected}`}>
				<motion.div className={`${storyName}-content`}
					{...fade({ inDuration: contentMotionDuration })}>
					STORY
				</motion.div>
			</div>
			<div className={spellzName}
				key={`${spellzName}-${selected}`}>
				<Spell spellName={spellName}
					content='ACTIVE'
					selected={selected}
				/>
				<Spell spellName={spellName}
					content='PASSIVE'
					selected={selected}
				/>
			</div>
		</AnimatePresence>
	</motion.div>
}

// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBox: React.FC<CharBoxProps> = ({ id, setSelected }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`

	// ----RENDER----------------------------- //
	return <FtMotionBtn className={boxName}
		pressedName={PRESSED_NAME}
		handler={{ onMouseUp: () => setSelected(id) }}
		motionProps={yMove({ from: 200 * id, inDuration: 1.25, outDuration: 0.5 })}
		content={`[Character #${id}]`}
	/>
}

// --------CHARACTER-BOXES------------------------------------------------- //
interface CharBoxesProps {
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBoxes: React.FC<CharBoxesProps> = memo(({ setSelected }) => {
	// ----STATES----------------------------- //
	const [animating, setAnimating] = useState(true)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const timer = setTimeout(() => {
			setAnimating(false)
		}, 1250)

		return () => clearTimeout(timer)
	}, [])

	// ----ANIMATION-------------------------- //
	const heightChange = useMemo(() => heightChangeByPercent({ inDuration: 1, outDuration: 0.5 }), [])
	const boxStyle: MotionStyle = {
		overflowY: (animating ? 'hidden' : 'auto')
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s-select`

	// ----RENDER----------------------------- //
	const renderCharPic = useMemo(() => Array.from({ length: CHAR_COUNT }, (_, index) => (
		<CharBox key={index + 1} id={index + 1} setSelected={setSelected} />
	)), [])

	return <motion.div className={boxName}
		{...heightChange}
		exit={{
			...heightChange.exit,
			overflowY: 'hidden'
		}}
		style={boxStyle}>
		{renderCharPic}
	</motion.div>
})

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = () => {
	// ----STATES----------------------------- //
	const [selected, setSelected] = useState(1)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s main`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...fade({ inDuration: 1, outDuration: 0.5 })}>
		<CharBoxes setSelected={setSelected} />
		<Character selected={selected} />
	</motion.main>
}
export default Characters