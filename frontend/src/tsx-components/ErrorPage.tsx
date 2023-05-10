import React from 'react'
import { motion } from 'framer-motion'

import { fade } from '../tsx-utils/ftFramerMotion.tsx'

// --------ERROS----------------------------------------------------------- //
interface ErrorPageProps {
	code: number
}
const ErrorPage: React.FC<ErrorPageProps> = ({ code }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = 'error main'

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...fade({ inDuration: 1, outDuration: 0.5 })}>

		{code === 403 && <>403 Forbidden</>}
		{code === 404 && <>404 Not found</>}
	</motion.main>
}
export default ErrorPage