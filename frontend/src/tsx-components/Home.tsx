import React from 'react'
import { motion } from 'framer-motion'

import { fade } from '../tsx-utils/ftFramerMotion.tsx'

// --------HOME------------------------------------------------------------ //
const Home: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const boxName = 'home main'

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...fade({ inDuration: 1, outDuration: 0.5 })}>
		HOME
	</motion.main>
}
export default Home