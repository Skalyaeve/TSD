import React, { memo } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorPage from './ErrorPage.tsx'

// --------STATS----------------------------------------------------------- //
const Stats: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <main className='profil-stats main'>
		Stats
	</main>
})

// --------FRIENDS--------------------------------------------------------- //
const Friends: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <main className='profil-friends main'>
		Friends
	</main>
})

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <main className='profil-characters main'>
		Characters
	</main>
})

// --------PROFIL---------------------------------------------------------- //
const Profil: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <Routes>
		<Route path='/' element={<Stats />} />
		<Route path='/friends' element={<Friends />} />
		<Route path='/characters' element={<Characters />} />
		<Route path='*' element={<ErrorPage code={404} />} />
	</Routes>
})
export default Profil