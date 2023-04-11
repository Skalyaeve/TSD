import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './NavBar.tsx'
import Matchmaker from './Matchmaker.tsx'
import Chat from './Chat.tsx'
import Home from './Home.tsx'
import Profil from './Profil.tsx'
import Party from './Party.tsx'
import Leaderboard from './Leaderboard.tsx'
import NotFound from './NotFound.tsx'
import { newBox } from './utils.tsx'

function Main() {
	// Valeurs
	const [boxPressed, setBoxPressed] = useState(0)
	const [logged, setLoged] = useState(() => {
		const value = localStorage.getItem('logged')
		return value === '1' ? true : false
	})

	const isPressed = (id: integer) => (boxPressed === id ? 'login__button--pressed' : '')
	const loginBoxName = `${isPressed(1)} login__button`

	const loginBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(1),
			onMouseUp: () => { setBoxPressed(0); connect() },
			content: '[ 42Auth ]'
		})
	)

	// Modifieurs
	const connect = () => {
		setLoged(true)
		localStorage.setItem('logged', '1')
	}
	const disconnect = () => {
		setLoged(false)
		localStorage.setItem('logged', '0')
	}

	// Retour
	return (
		<>
			{!logged ? (
				loginBox(loginBoxName)
			) : (
				<Router>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/profil' element={<Profil />} />
						<Route path='/profil/friends' element={<Profil />} />
						<Route path='/profil/characters' element={<Profil />} />
						<Route path='/party' element={<Party />} />
						<Route path='/leaderboard' element={<Leaderboard />} />
						<Route path='*' element={<NotFound />} />
					</Routes>

					<header className='header'>
						<NavBar disconnect={disconnect} />
						<Chat />
						<Matchmaker />
					</header>
				</Router>
			)}
		</>
	)
}
export default Main