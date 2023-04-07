import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import Party from './Party';
import Leaderboard from './Leaderboard';
import NotFound from './NotFound';

function Main() {
	// Variables

	// Modifieurs

	// Retour
	return (
		<Router>

			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/party" element={<Party />} />
				<Route path="/leaderboard" element={<Leaderboard />} />
				<Route path="*" element={<NotFound />} />
			</Routes>

			<Header />
			<Chat />

		</Router>
	);
};
export default Main;