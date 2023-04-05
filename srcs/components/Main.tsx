import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import Matchmaking from './Matchmaking';
import Chat from './Chat';
import Home from './Home';
import Profile from './Profile';
import Party from './Party';
import Leaderboard from './Leaderboard';
import NotFound from './NotFound';

const Main = () => {
	return (
		<Router>
			<Header />
			<Matchmaking />
			<Chat />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/party" element={<Party />} />
				<Route path="/leaderboard" element={<Leaderboard />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</Router>
	);
};
export default Main;