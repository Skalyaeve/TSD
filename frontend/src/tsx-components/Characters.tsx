import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import { FtBtn, FtDiv } from '../tsx-utils/ftSam/ftBox.tsx'
import { tglOnUp } from '../tsx-utils/ftSam/ftHooks.tsx'

// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	name: string
}
const CharBox: React.FC<CharBoxProps> = ({ id, name }) => {
	// ----RENDER----------------------------- //
	return <FtBtn className={`${name}-box`}
		pressedName={`${name}-btn--pressed`}
		content={`[Character ${id}]`}
	/>
}


// --------CHARACTER------------------------------------------------------- //
interface CharacterProps {
	name: string
}
const Character: React.FC<CharacterProps> = ({ name }) => {
	// ----CLASSNAMES------------------------- //
	const spellName = `${name}-spell`

	// ----RENDER----------------------------- //
	return <div className={name}>
		<div className={`${name}-skin`}>SKIN</div>
		<div className={`${name}-infos`}>
			<div className={`${name}-stats`}>STATS</div>
			<div className={`${name}-story`}>STORY</div>
			<div className={`${spellName}s`}>
				<Spell spellName={spellName} nameExt='A' content='ACTIVE' />
				<Spell spellName={spellName} nameExt='B' content='PASSIVE' />
			</div>
		</div>
	</div>
}
// --------SPELL----------------------------------------------------------- //
interface SpellProps {
	spellName: string
	nameExt: string
	content: string
}
const Spell: React.FC<SpellProps> = ({ spellName, nameExt, content }) => {
	// ----STATES----------------------------- //
	const [tooltip, tglTooltip] = tglOnUp(false)

	// ----CLASSNAMES------------------------- //
	const boxName = `${spellName}-box`

	// ----RENDER----------------------------- //
	return <div className={`${boxName}-${nameExt} ${boxName}`}>
		<FtDiv className={`${spellName}-${nameExt} ${spellName}`}
			handler={tglTooltip}
			content={content}
		/>
		{tooltip && <div className={`${spellName}-tooltip`}>
			TOOLTIP
		</div>}
	</div>
}


// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = () => {
	// ----STATES----------------------------- //
	const [totalCharacters, setTotalCharacters] = useState(9)

	// ----CLASSNAMES------------------------- //
	const name = 'character'

	// ----RENDER----------------------------- //
	const renderFriends = useMemo(() => Array.from({ length: totalCharacters }, (_, index) => (
		<CharBox key={index + 1} id={index + 1} name={name} />
	)), [totalCharacters])

	return <motion.main className={`${name}s main`}
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	>
		<div className={`${name}s-select`}>
			{renderFriends}
		</div>
		<Character name={name} />
	</motion.main>
}
export default Characters