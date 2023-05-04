import React from 'react'
import { motion } from 'framer-motion'

import { fadeInOut } from '../tsx-utils/ftSam/ftFramerMotion.tsx'

// --------ERROS----------------------------------------------------------- //
interface ErrorPageProps {
	code: number
}
const ErrorPage: React.FC<ErrorPageProps> = ({ code }) => {
	// ----RENDER----------------------------- //
	return <motion.main className='error main'
		{...fadeInOut()}>
		{code === 403 && <>403 Forbidden</>}
		{code === 404 && <>404 Not found</>}
	</motion.main>
}
export default ErrorPage