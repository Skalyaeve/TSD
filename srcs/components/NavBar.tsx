import React from 'react'
import { useLocation, Link } from 'react-router-dom'

interface NavBarProps {
	disconnect: () => void;
}

function NavBar({ disconnect }: NavBarProps) {
	// Variables
	const location = useLocation()

	// Modifieurs
	const renderHomeLinks = () => (
		<>
			<div className="navbBar__first navbBar__backLink logout__button" onClick={disconnect}>[ LOGOUT ]</div>
			<Link to="/profil">[ PROFIL ]</Link>
			<Link className="navbBar__last" to="/leaderboard">[ LEADERBOARD ]</Link>
		</>
	)
	const renderProfilLinks = () => (
		<>
			<Link className="navbBar__first navbBar__backLink" to="/">[ BACK ]</Link>
			<Link to="/profil">[ STATS ]</Link>
			<Link to="/profil/characters">[ CHARACTERS ]</Link>
			<Link className="navbBar__last" to="/profil/friends">[ FRIENDS ]</Link>
		</>
	)
	const renderLeaderboardLinks = () => (
		<>
			<Link className="navbBar__first navbBar__last navbBar__backLink" to="/">[ BACK ]</Link>
		</>
	)
	const render404 = () => (
		<>
			<Link className="navbBar__first" to="/">[ HOME ]</Link>
			<Link to="/profil">[ PROFIL ]</Link>
			<Link className="navbBar__last" to="/leaderboard">[ LEADERBOARD ]</Link>
		</>
	)
	const renderPartyLinks = () => <></>

	const getRender = (path: string) => {
		const renderLinksMap: { [key: string]: () => JSX.Element } = {
			'/': renderHomeLinks,
			'/profil': renderProfilLinks,
			'/profil/friends': renderProfilLinks,
			'/profil/characters': renderProfilLinks,
			'/leaderboard': renderLeaderboardLinks,
			'/party': renderPartyLinks,
			'404': render404
		}
		return renderLinksMap[path] ? renderLinksMap[path]() : renderLinksMap['404']()
	}

	// Retour
	return (
		<nav className="navbBar">
			{getRender(location.pathname)}
		</nav>
	)
}
export default NavBar