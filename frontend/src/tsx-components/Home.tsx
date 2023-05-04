import React from 'react'
import { motion } from 'framer-motion'

import { fadeInOut } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------HOME------------------------------------------------------------ //
const Home: React.FC = () => {
	// ----RENDER----------------------------- //
	return <motion.main className='home main'
		{...fadeInOut(0.5)}>
		HOME
	</motion.main>
}
export default Home