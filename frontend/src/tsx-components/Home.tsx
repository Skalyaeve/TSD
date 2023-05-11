import React from 'react'
import { MotionProps, motion } from 'framer-motion'
import { fade } from '../tsx-utils/ftMotion.tsx'

// --------HOME------------------------------------------------------------ //
const Home: React.FC = () => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({
		inDuration: 1,
		outDuration: 0.5
	})

	// ----CLASSNAMES------------------------- //
	const boxName = 'home main'

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...boxMotion as MotionProps}>
		HOME
	</motion.main>
}
export default Home