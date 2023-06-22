import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { popUp } from './ftMotion.tsx'
import { characterNames } from './Characters.tsx'

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'home'

// --------HOME------------------------------------------------------------ //
interface HomeProps {
	selectedCharacter: number
}
const Home: React.FC<HomeProps> = ({ selectedCharacter }) => {
	// ----ANIMATIONS------------------------- //
	const charBoxMotion = popUp({})
	const swapBtnMotion = {
		whileHover: {
			scale: 1.05,
			borderTopLeftRadius: '5px',
			borderBottomRightRadius: '5px'
		}
	}

	// ----CLASSNAMES------------------------- //
	const charBoxName = `${NAME}-char-box`
	const charBoxTxtName = `${NAME}-char-box-txt`
	const charSkinName = `${NAME}-character character-skin character-skin-${characterNames(selectedCharacter)}`
	const swapBoxName = `${NAME}-swap-box`
	const swapBtnName = `${NAME}-swap-btn`
	const swapBtnTxtName = `${NAME}-swap-btn-txt`

	// ----RENDER----------------------------- //
	return <div className={NAME}>
		<motion.div className={charBoxName} {...charBoxMotion}>
			<div className={charSkinName} />
			<div className={swapBoxName}>
				<motion.div className={swapBtnName} {...swapBtnMotion}>
					<Link className={swapBtnTxtName} to='/characters'>characters</Link>
				</motion.div>
			</div>
			<div className={charBoxTxtName} {...charBoxMotion}>
				selected character
			</div>
		</motion.div>
	</div>
}
export default Home