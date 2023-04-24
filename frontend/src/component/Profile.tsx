import React, { memo } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorPage from './ErrorPage.tsx'

// --------STATS----------------------------------------------------------- //
const Infos: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <main className='profile-infos profile main'>
		<div className='home-body'>Infos</div>
	</main>
})

// --------FRIENDS--------------------------------------------------------- //
const Friends: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <main className='profile-friends profile main'>
		<div className='home-body'>Friends</div>
	</main>
})

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <main className='profile-characters profile main'>
		<div className='home-body'>Characters</div>
	</main>
})

// --------PROFILE--------------------------------------------------------- //
const Profile: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <Routes>
		<Route path='/' element={<Infos />} />
		<Route path='/friends' element={<Friends />} />
		<Route path='/characters' element={<Characters />} />
		<Route path='*' element={<ErrorPage code={404} />} />
	</Routes>
})
export default Profile