import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Header from './Header'
import Matchmaker from './Matchmaker'
import Chat from './Chat'
import Home from './Home'
import Profile from './Profile'
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

					<Header disconnect={disconnect} />
					<Chat />
					<Matchmaker />

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/profile/friends" element={<Profile />} />
						<Route path="/profile/characters" element={<Profile />} />
						<Route path="/party" element={<Party />} />
						<Route path="/leaderboard" element={<Leaderboard />} />
						<Route path="*" element={<NotFound />} />
					</Routes>

				</Router>
			)}
		</>
	)
}
export default Main