import React, { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import NavBar from './NavBar'
import Matchmaker from './Matchmaker'
import Chat from './Chat'
import Home from './Home'
import Profil from './Profil'
import Party from './Party'
import Leaderboard from './Leaderboard'
import NotFound from './NotFound'

function Main() {
	// Variables
	const [isAuthenticated, setIsAuthenticated] = useState(() => {
		const storedAuth = localStorage.getItem('isAuthenticated')
		return storedAuth === 'true' ? true : false
	})

	// Modifieurs
	const connect = () => {
		setIsAuthenticated(true)
		localStorage.setItem('isAuthenticated', 'true')
	}

	const disconnect = () => {
		setIsAuthenticated(false)
		localStorage.setItem('isAuthenticated', 'false')
	}

	// Retour
	return (
		<>
			{!isAuthenticated ? (
				<div className="login__button" onClick={connect}>
					[ 42Auth ]
				</div>
			) : (
				<Router>

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/profil" element={<Profil />} />
						<Route path="/profil/friends" element={<Profil />} />
						<Route path="/profil/characters" element={<Profil />} />
						<Route path="/party" element={<Party />} />
						<Route path="/leaderboard" element={<Leaderboard />} />
						<Route path="*" element={<NotFound />} />
					</Routes>

					<div className="header">
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