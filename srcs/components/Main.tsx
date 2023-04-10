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

function Main() {
	// Variables
	const [isAuthentified, setIsAuthenticated] = useState(() => {
		const storedValue = localStorage.getItem('isAuthentified')
		return storedValue === 'true' ? true : false
	})
	const [loginButton, setLoginButton] = useState("released")

	// Modifieurs
	const connect = () => {
		setIsAuthenticated(true)
		localStorage.setItem('isAuthentified', 'true')
	}

	const disconnect = () => {
		setIsAuthenticated(false)
		localStorage.setItem('isAuthentified', 'false')
	}

	// Retour
	return (
		<>
			{!isAuthentified ? (
				<div className={`login__button ${loginButton === "released" ? "" : "login__button--pressed"}`}
					onMouseDown={() => setLoginButton("pressed")}
					onMouseUp={() => { setLoginButton("released"); connect() }}>
					[ 42Auth ]
				</div>
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

					<div className='header'>
						<NavBar disconnect={disconnect} />
						<Chat />
						<Matchmaker />
					</div>
				</Router>
			)}
		</>
	)
}
export default Main