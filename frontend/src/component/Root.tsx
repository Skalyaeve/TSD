import React, { useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { NewBox, toggleOnUp } from './utils.tsx'
import NavBar from './NavBar.tsx'
import Chat from './Chat.tsx'
import Matchmaker from './Matchmaker.tsx'
import Home from './Home.tsx'
import Profile from './Profile.tsx'
import Party from './Game.tsx'
import Leader from './Leader.tsx'
import ErrorPage from './ErrorPage.tsx'

// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----LOCATION--------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [logged, toggleLoged] = toggleOnUp(localStorage.getItem('logged') === '1')

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		localStorage.setItem('logged', logged ? '1' : '0')
	}, [logged])

	useEffect(() => {
		if (logged && localStorage.getItem('inGame') === '1')
			navigate('/game')
	}, [location.pathname])

	// ----RENDER----------------------------- //
	return <>{!logged ?
		<NewBox
			tag='btn'
			className='login'
			nameIfPressed='login--pressed'
			handlers={toggleLoged}
			content='[42Auth]'
		/>
		:
		<>
			<header className='header'>
				<NavBar toggleLoged={toggleLoged} />
				<Chat />
				<Matchmaker />
			</header>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/profile/*' element={<Profile />} />
				<Route path='/game' element={<Party />} />
				<Route path='/leaderboard' element={<Leader />} />
				<Route path='*' element={<ErrorPage code={404} />} />
			</Routes>
		</>
	}</>
}
export default Root