import React, { memo } from 'react'
import { motion } from 'framer-motion'

import { fade } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------HOME------------------------------------------------------------ //
const Home: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <motion.main className='home main'
		{...fade({})}>
		HOME
	</motion.main>
})
export default Home