import React from 'react'
import { motion } from 'framer-motion'
import { fade } from '../tsx-utils/ftMotion.tsx'

// --------ERROS----------------------------------------------------------- //
interface ErrorPageProps {
	code: number
}
const ErrorPage: React.FC<ErrorPageProps> = ({ code }) => {
	// ----ANIMATIONS------------------------- //
	const boxMotion = fade({ inDuration: 1 })

	// ----CLASSNAMES------------------------- //
	const boxName = 'error main'

	// ----RENDER----------------------------- //
	return <motion.main className={boxName}
		{...boxMotion}>
		{code === 403 && <>403 Forbidden</>}
		{code === 404 && <>404 Not found</>}
	</motion.main>
}
export default ErrorPage