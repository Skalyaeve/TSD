import React, { useEffect, SetStateAction } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { popUp } from './utils/ftMotion.tsx'
import { characterNames, characterIds } from './Characters.tsx'
import { ftFetch } from './Root.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'home'

// --------HOME------------------------------------------------------------ //
interface HomeProps {
	selectedCharacter: number
	setSelectedCharacter: React.Dispatch<SetStateAction<number>>
}

const updateSelected = async (setSelectedCharacter: React.Dispatch<SetStateAction<number>>) => {
	let user = await ftFetch('/users/self')
	if (user) {
		let character = user.character
		if (character){
			console.log("Updating character from db:", character)
			let id = characterIds(character)
			console.log("ID:", id)
			if (typeof id === 'number')
				setSelectedCharacter(id)
		}
	}
}

const Home: React.FC<HomeProps> = ({ selectedCharacter, setSelectedCharacter }) => {
	// ----EFFECTS---------------------------- //
	useEffect(() => {
		updateSelected(setSelectedCharacter)
	}, [])
	
	// ----ANIMATIONS------------------------- //
	const charBoxMotion = popUp({})
	const swapBtnMotion = { whileHover: { scale: 1.05 } }

	// ----CLASSNAMES------------------------- //
	const charBoxName = `${NAME}-char-box`
	const charBoxTxtName = `${NAME}-char-box-txt`
	const charSkinName = `${NAME}-character character-skin character-skin-${characterNames(selectedCharacter)}`
	const swapBoxName = `${NAME}-swap-box`
	const swapBtnName = `${NAME}-swap-btn`
	const swapBtnTxtName = `${NAME}-swap-btn-txt custom-txt`

	// ----RENDER----------------------------- //
	return <div className={NAME}>
		<motion.div className={charBoxName} {...charBoxMotion}>
			<div className={charSkinName} />
			<div className={swapBoxName}>
				<motion.div className={swapBtnName} {...swapBtnMotion}>
					<Link className={swapBtnTxtName} to='/characters'>
					</Link>
				</motion.div>
			</div>
			<div className={charBoxTxtName} {...charBoxMotion}>
				selected character
			</div>
		</motion.div>
	</div>
}
export default Home