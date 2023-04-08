import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

interface HeaderProps {
	disconnect: () => void;
}

function Header({ disconnect }: HeaderProps) {
	// Variables
	const location = useLocation()

	// Modifieurs
	const renderHomeLinks = () => (
		<>
			<div className="header__first header__backLink logout__button" onClick={disconnect}>[ OUT ]</div>
			<Link to="/profile">[ PROFIL ]</Link>
			<Link className="header__last" to="/leaderboard">[ LEADERBOARD ]</Link>
		</>
	)
	const renderProfileLinks = () => (
		<>
			<Link className="header__first header__backLink" to="/">[ BACK ]</Link>
			<Link to="/profile">[ STATS ]</Link>
			<Link to="/profile/characters">[ CHARACTERS ]</Link>
			<Link className="header__last" to="/profile/friends">[ FRIENDS ]</Link>
		</>
	)
	const renderLeaderboardLinks = () => (
		<>
			<Link className="header__first header__last header__backLink" to="/">[ BACK ]</Link>
		</>
	)
	const render404 = () => (
		<>
			<Link className="header__first" to="/">[ HOME ]</Link>
			<Link to="/profile">[ PROFIL ]</Link>
			<Link className="header__last" to="/leaderboard">[ LEADERBOARD ]</Link>
		</>
	)
	const renderPartyLinks = () => <></>

	const getRender = (path: string) => {
		const renderLinksMap: { [key: string]: () => JSX.Element } = {
			'/': renderHomeLinks,
			'/profile': renderProfileLinks,
			'/profile/friends': renderProfileLinks,
			'/profile/characters': renderProfileLinks,
			'/leaderboard': renderLeaderboardLinks,
			'/party': renderPartyLinks,
			'404': render404
		}
		return renderLinksMap[path] ? renderLinksMap[path]() : renderLinksMap['404']()
	}

	// Retour
	return (
		<header className="header">
			{getRender(location.pathname)}
		</header>
	)
}
export default Header