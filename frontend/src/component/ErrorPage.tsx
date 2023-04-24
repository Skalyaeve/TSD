import React, { memo } from 'react'

// --------ERROS----------------------------------------------------------- //
interface ErrorPageProps {
	code: number
}
const ErrorPage: React.FC<ErrorPageProps> = memo(({ code }) => {
	// ----RENDER----------------------------- //
	return <main className='error main'>
		{code === 403 && <>403 Forbidden</>}
		{code === 404 && <>404 Not fooouuund</>}
	</main>
})
export default ErrorPage