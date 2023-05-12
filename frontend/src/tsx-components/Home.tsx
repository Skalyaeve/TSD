import React from 'react'
import { motion } from 'framer-motion'
import { fade } from '../tsx-utils/ftMotion.tsx'

// --------HOME------------------------------------------------------------ //
const Home: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })

	// ----CLASSNAMES------------------------- //
	const boxName = 'home main'

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...boxMotion}>
		HOME
	</motion.main>
}
export default Home