import React, { memo, useState } from 'react'
import { motion } from 'framer-motion'

import { FtMotionBtn, FtDiv } from '../tsx-utils/ftSam/ftBox.tsx'
import { tglOnOver } from '../tsx-utils/ftSam/ftHooks.tsx'
import { fade, yMove, heightChangeByPercent, heightChangeByPx } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const CHAR_COUNT = 9

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'character'
const PRESSED_NAME = `${NAME}-btn--pressed`

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
	return <div className={boxName}>
		<FtDiv className={spellName}
			handler={tglTooltip}
			content={content}
		/>
		{tooltip && <div className={tooltipName}>
			TOOLTIP
		</div>}
	</div>
}

// --------CHARACTER------------------------------------------------------- //
interface CharacterProps {
	selected: number
}
const Character: React.FC<CharacterProps> = ({ selected }) => {
	// ----CLASSNAMES------------------------- //
	const skinName = `${NAME}-skin`
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellName = `${NAME}-spell`
	const spellzName = `${spellName}s`

	// ----RENDER----------------------------- //
	return <motion.div className={NAME}
		{...heightChangeByPercent({ inDuration: 1 })}>
		<div className={skinName}>CHARACTER #{selected}</div>
		<div className={statsName}>STATS</div>
		<div className={storyName}>STORY</div>
		<div className={spellzName}>
			<Spell spellName={spellName}
				content='ACTIVE'
			/>
			<Spell spellName={spellName}
				content='PASSIVE'
			/>
		</div>
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
		motionProps={yMove({ from: 200 * id, inDuration: 1.25 })}
		content={`[Character #${id}]`}
	/>
}

// --------CHARACTER-BOXES------------------------------------------------- //
interface CharBoxesProps {
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBoxes: React.FC<CharBoxesProps> = memo(({ setSelected }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s-select`

	// ----RENDER----------------------------- //
	const renderCharPic = Array.from({ length: CHAR_COUNT }, (_, index) => (
		<CharBox key={index + 1} id={index + 1} setSelected={setSelected} />
	))

	return <motion.div className={boxName}
		{...heightChangeByPercent({ inDuration: 1 })}>
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
		{...fade({ inDuration: 1 })}>
		<CharBoxes setSelected={setSelected} />
		<Character selected={selected} />
	</motion.main>
}
export default Characters