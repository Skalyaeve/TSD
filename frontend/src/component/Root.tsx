import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { NewBox } from './utils.tsx'
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
	const [logged, setLoged] = useState(() => {
		const value = localStorage.getItem('logged')
		return value === '1'
	})

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		localStorage.setItem('logged', logged ? '1' : '0')
	}, [logged])

	useEffect(() => {
		if (logged && localStorage.getItem('inGame') === '1')
			navigate('/game')
	}, [location.pathname])

	// ----HANDLERS--------------------------- //
	const connect = useCallback(() => {
		setLoged(true)
	}, [])

	const disconnect = useCallback(() => {
		setLoged(false)
	}, [])

	const loginBtnHdl = useMemo(() => ({
		onMouseUp: connect
	}), [])

	// ----RENDER----------------------------- //
	return <>{!logged ? (
		<NewBox
			tag='btn'
			className='login'
			nameIfPressed='login--pressed'
			handlers={loginBtnHdl}
			content='[42Auth]'
		/>
	) : (<>
		<Routes>
			<Route path='/' element={<Home />} />
			<Route path='/profile/*' element={<Profile />} />
			<Route path='/game' element={<Party />} />
			<Route path='/leaderboard' element={<Leader />} />
			<Route path='*' element={<ErrorPage code={404} />} />
		</Routes>

		<header className='header'>
			<NavBar disconnect={disconnect} />
			<Chat />
			<Matchmaker />
		</header>
	</>)}</>
}
export default Root