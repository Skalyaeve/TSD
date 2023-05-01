import React, { memo } from 'react'
import { motion } from 'framer-motion'

// --------ERROS----------------------------------------------------------- //
interface ErrorPageProps {
	code: number
}
const ErrorPage: React.FC<ErrorPageProps> = memo(({ code }) => {
	// ----RENDER----------------------------- //
	return <motion.main className='error main'
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	>
		{code === 403 && <>403 Forbidden</>}
		{code === 404 && <>404 Not found</>}
	</motion.main>
})
export default ErrorPage