import React, { useRef, useState, useEffect, memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { fade, xMove, yMove } from './ftMotion.tsx'

// --------VALUES---------------------------------------------------------- //
export const characterNames = (id: number) => {
	switch (id) {
		case 1: return 'Selene'
		case 2: return 'Rylan'
		case 3: return 'Thorian'
		case 4: return 'Liliana'
		case 5: return 'Garrick'
		case 6: return 'Orion'
		case 7: return 'Faeleen'
		case 8: return 'Boreas'
		case 9: return 'Helios'
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
}
const CharBox: React.FC<CharBoxProps> = ({ id, swapping, setSelected }) => {
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

	// ----ANIMATIONS------------------------- //
	const boxMotion = yMove({
		from: 200 * id,
		inDuration: 0.7 + 0.02 * id,
		outDuration: 0.5 - 0.01 * id
	})
	const selectBtnMotion = {
		whileHover: {
			scale: 1.05,
			borderTopLeftRadius: '5px',
			borderBottomRightRadius: '5px'
		}
	}

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}-box`
	const mainBoxName = `${boxName} ${boxName}-${characterNames(id)}`
	const selectBoxName = `${NAME}-selectBox`
	const selectBtnName = `${NAME}-select-btn`

	// ----RENDER----------------------------- //
	return <motion.div className={mainBoxName} {...boxHdl} {...boxMotion}>
		<div className={selectBoxName}>
			{id !== 1 && <>rank 0 required</>}
			{id === 1 && <motion.button
				className={selectBtnName}
				{...selectBtnMotion}>
				select
			</motion.button>}
		</div>
	</motion.div>
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
	isPassive?: boolean
}
const Spell: React.FC<SpellProps> = ({ isPassive = true }) => {
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
	characters: {}
}
const Character: React.FC<CharacterProps> = ({ selected, characters }) => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 0.3, outDuration: 0.3 })
	const fromTop = yMove({ from: -150, inDuration: 0.7 })
	const fromBottom = yMove({ from: 150, inDuration: 0.7 })

	// ----CLASSNAMES------------------------- //
	const skinName = `${NAME}-skin`
	const skinBoxName = `${skinName}-box`
	const spriteName = `${skinName} ${skinName}-${characterNames(selected)}`
	const statsName = `${NAME}-stats`
	const storyName = `${NAME}-story`
	const spellzName = `${SPELLNAME}s`

	// ----RENDER----------------------------- //
	return <div className={NAME}>
		<motion.div className={skinBoxName} {...fromTop}>
			<AnimatePresence mode='wait'>
				<motion.div
					className={spriteName}
					key={`${skinName}-${selected}`}
					{...boxMotion}
				/>
			</AnimatePresence>
		</motion.div>

		<motion.div className={statsName} {...fromBottom}>
			<AnimatePresence mode='wait'>
				<motion.div key={`${statsName}-${selected}`} {...boxMotion}>
					STATS
				</motion.div>
			</AnimatePresence>
		</motion.div>

		<motion.div className={storyName} {...fromTop}>
			<AnimatePresence mode='wait'>
				<motion.div key={`${storyName}-${selected}`} {...boxMotion}>
					STORY
				</motion.div>
			</AnimatePresence>
		</motion.div>

		<motion.div className={spellzName} {...fromBottom}>
			<AnimatePresence mode='wait'>
				<Spell key={`${spellzName}-${selected}`} />
			</AnimatePresence>
			<AnimatePresence mode='wait'>
				<Spell key={`${spellzName}-${selected}`} isPassive={false} />
			</AnimatePresence>
		</motion.div>
	</div>
}

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = () => {
	// ----VALUES----------------------------- //
	let characters: Object = {}

	// ----REFS------------------------------- //
	const swapping = useRef(false)

	// ----STATES----------------------------- //
	const [selected, setSelected] = useState(1)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const fetchData = async () => {
			try {
				const uri = 'characters/all'
				const response = await fetch(`http://10.12.3.19:3000/${uri}`)
				if (response.ok) {
					characters = await response.json()
					const arr = Object.values(characters)
					for (let x of arr) console.log(x.name)
				}
				else
					console.error(`[ERROR] fetch('http://10.12.3.19:3000/${uri}') failed`)
			} catch (error) {
				console.error('[ERROR] ', error)
			}
		}
		fetchData()
	}, [])

	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })

	// ----CLASSNAMES------------------------- //
	const boxName = `${NAME}s main`

	// ----RENDER----------------------------- //
	return <motion.main className={boxName} {...boxMotion}>
		<CharBoxes swapping={swapping} setSelected={setSelected} />
		<Character selected={selected} characters={characters} />
	</motion.main>
}
export default Characters