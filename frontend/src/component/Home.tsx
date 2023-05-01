import React, { memo } from 'react'
import { motion } from 'framer-motion'

// --------HOME------------------------------------------------------------ //
const Home: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <motion.main className='home main'
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	>
		HOME
	</motion.main>
})
export default Home