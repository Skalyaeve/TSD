import React, { useRef, useState, useEffect, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, xMove, yMove } from './utils/ftMotion.tsx'
import * as characters from '../resources/characters.json'

// --------VALUES---------------------------------------------------------- //
const data = Object.entries(characters)
export const characterNames = (id: number) => {
	switch (id) {
		case 1: return `${data[0][0]}`
		case 2: return `${data[1][0]}`
		case 3: return `${data[2][0]}`
		case 4: return `${data[3][0]}`
		case 5: return `${data[4][0]}`
		case 6: return `${data[5][0]}`
		case 7: return `${data[6][0]}`
		case 8: return `${data[7][0]}`
		case 9: return `${data[8][0]}`
		default: return 'error'
	}
}

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'character'
const SPELLNAME = `${NAME}-spell`

// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	swapping: React.MutableRefObject<boolean>
	setSelected: React.Dispatch<React.SetStateAction<number>>
	selectedCharacter: number
	setSelectedCharacter: React.Dispatch<React.SetStateAction<number>>
}
const CharBox: React.FC<CharBoxProps> = ({
	id, swapping, setSelected, selectedCharacter, setSelectedCharacter
}) => {
	// ----HANDLERS--------------------------- //
	const boxHdl = {
		onMouseUp: () => {
			if (!swapping.current) {
				setSelected(id)
				swapping.current = true
				const timer = setTimeout(() => swapping.current = false, 500)
				return () => clearTimeout(timer)
			}
		}
	}
	const selectBtnHdl = {
		onMouseUp: () => { setSelectedCharacter(id) }
	}

	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 200 * id,
		inDuration: 0.7 + 0.02 * id,
		outDuration: 0.5 - 0.01 * id
	})
	const selectBtnMotion = {
		whileHover: { scale: 1.05 }
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`
	const mainBoxName = `${boxName}`
	const skinBoxName = `${NAME}-skin ${NAME}-skin-${characterNames(id)}`
	const selectBoxName = `${NAME}-selectBox`
	const selectBtnName = `${NAME}-select-btn`

	// ----RENDER----------------------------- //
	return <motion.div className={mainBoxName} {...boxMotion}>
		<div className={skinBoxName} {...boxHdl} />
		<div className={selectBoxName}>
			{selectedCharacter !== id && <motion.button
				className={selectBtnName}
				{...selectBtnHdl}
				{...selectBtnMotion}>
				select
			</motion.button>}
			{selectedCharacter === id && <>selected</>}
		</div>
	</motion.div>
}

// --------CHARACTER-BOXES------------------------------------------------- //
interface CharBoxesProps {
	swapping: React.MutableRefObject<boolean>
	setSelected: React.Dispatch<React.SetStateAction<number>>
	selectedCharacter: number
	setSelectedCharacter: React.Dispatch<React.SetStateAction<number>>
}
const CharBoxes: React.FC<CharBoxesProps> = memo(({
	swapping, setSelected, selectedCharacter, setSelectedCharacter
}) => {
	// ----VALUES----------------------------- //
	const count = 9

	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({ from: 500, inDuration: 0.7 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s-select`

	// ----RENDER----------------------------- //
	const render = Array.from({ length: count }, (_, index) =>
		<CharBox
			key={index + 1}
			id={index + 1}
			swapping={swapping}
			setSelected={setSelected}
			selectedCharacter={selectedCharacter}
			setSelectedCharacter={setSelectedCharacter}
		/>
	)
	return <motion.div className={boxName} {...boxMotion}>
		{render}
	</motion.div>
})

// --------SPELL----------------------------------------------------------- //
interface SpellProps {
	selected: number
	isPassive?: boolean
}
const Spell: React.FC<SpellProps> = ({ selected, isPassive = true }) => {
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
		onMouseEnter: () => {
			updateTooltipPos()
			setToolTip(true)
		},
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
	const tooltipName = `${SPELLNAME}-tooltip`
	const childBoxName = `${SPELLNAME}-childBox`

	// ----RENDER----------------------------- //
	return <>
		<motion.div
			ref={spellNameRef}
			className={SPELLNAME}
			{...boxHdl}
			{...boxMotion}>
			<div className={childBoxName}>
				{isPassive && <>passive</>}
				{!isPassive && <>active</>}
			</div>
			{!isPassive && <>tba</>}
		</motion.div>
		<AnimatePresence>
			{tooltip && isPassive && <motion.div
				className={tooltipName}
				{...tooltipMotion}
				style={{ translate: 'calc(-100% + 172px) calc(-100% + 20px)' }}>
				<h1>{data[selected - 1][1].passive.name}</h1>
				<p>{data[selected - 1][1].passive.effect}</p>
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
	const xMoveMotion = (index: number) => xMove({
		from: 300,
		inDuration: 0.25 * index,
		outDuration: 0.25 * (4 - index)
	})

	// ----CLASSNAMES------------------------- //
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellzName = `${SPELLNAME}s`

	// ----RENDER----------------------------- //
	return <div className={NAME}>
		<motion.div className={storyName} {...xMoveMotion(3)}>
			<AnimatePresence mode='wait'>
				<motion.div key={`${storyName}-${selected}`} {...boxMotion}>					{data[selected - 1][1].story}
				</motion.div>
			</AnimatePresence>
		</motion.div>
		<motion.div className={statsName} {...xMoveMotion(2)}>
			<AnimatePresence mode='wait'>
				<motion.div key={`${statsName}-${selected}`} {...boxMotion}>
					HP: {data[selected - 1][1].hp}<br />
					ATK: {data[selected - 1][1].attack}<br />
					DEF: {data[selected - 1][1].defense}<br />
					SPD: {data[selected - 1][1].speed}
				</motion.div>
			</AnimatePresence>
		</motion.div>
		<motion.div className={spellzName} {...xMoveMotion(1)}>
			<AnimatePresence mode='wait'>
				<Spell
					key={`${spellzName}-${selected}`}
					selected={selected}
				/>
			</AnimatePresence>
			<AnimatePresence mode='wait'>
				<Spell
					key={`${spellzName}-${selected}`}
					selected={selected}
					isPassive={false}
				/>
			</AnimatePresence>
		</motion.div>
	</div>
}

// --------CHARACTERS------------------------------------------------------ //
interface CharactersProps {
	selectedCharacter: number
	setSelectedCharacter: React.Dispatch<React.SetStateAction<number>>
}
const Characters: React.FC<CharactersProps> = ({
	selectedCharacter, setSelectedCharacter
}) => {
	// ----REFS------------------------------- //
	const swapping = useRef(false)

	// ----STATES----------------------------- //
	const [selected, setSelected] = useState(selectedCharacter)

	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s main`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName} {...boxMotion}>
		<CharBoxes
			swapping={swapping}
			setSelected={setSelected}
			selectedCharacter={selectedCharacter}
			setSelectedCharacter={setSelectedCharacter}
		/>
		<Character selected={selected} />
	</motion.main>
}
export default Characters