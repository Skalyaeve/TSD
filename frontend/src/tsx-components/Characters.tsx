import React, { memo, useState } from 'react'
import { motion } from 'framer-motion'

import { FtBtn, FtDiv } from '../tsx-utils/ftSam/ftBox.tsx'
import { tglOnOver } from '../tsx-utils/ftSam/ftHooks.tsx'
import { fade } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------VALUES---------------------------------------------------------- //
const CHAR_COUNT = 9

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'character'
const PRESSED_NAME = `${NAME}-btn--pressed`

// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	setSelected: React.Dispatch<React.SetStateAction<number>>
}
const CharBox: React.FC<CharBoxProps> = ({ id, setSelected }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`

	// ----RENDER----------------------------- //
	return <FtBtn className={boxName}
		pressedName={PRESSED_NAME}
		handler={{ onMouseUp: () => setSelected(id) }}
		content={`[Character ${id}]`}
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

	return <div className={boxName}>
		{renderCharPic}
	</div>
})

// --------CHARACTER------------------------------------------------------- //
interface CharacterProps {
	selected: number
}
const Character: React.FC<CharacterProps> = ({ selected }) => {
	// ----CLASSNAMES------------------------- //
	const skinName = `${NAME}-skin`
	const infosName = `${NAME}-infos`
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellName = `${NAME}-spell`
	const spellsName = `${spellName}s`

	// ----RENDER----------------------------- //
	return <div className={NAME}>
		<div className={skinName}>CHARACTER #{selected}</div>
		<div className={infosName}>
			<div className={statsName}>STATS</div>
			<div className={storyName}>STORY</div>
			<div className={spellsName}>
				<Spell spellName={spellName}
					content={`ACTIVE`}
				/>
				<Spell spellName={spellName}
					content={`PASSIVE`}
				/>
			</div>
		</div>
	</div>
}

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
	return <div className={`${boxName} ${boxName}`}>
		<FtDiv className={spellName}
			handler={tglTooltip}
			content={content}
		/>
		{tooltip && <div className={tooltipName}>
			TOOLTIP
		</div>}
	</div>
}

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [selected, setSelected] = useState(1)

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s main`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...fade({})}>
		<CharBoxes setSelected={setSelected} />
		<Character selected={selected} />
	</motion.main>
})
export default Characters