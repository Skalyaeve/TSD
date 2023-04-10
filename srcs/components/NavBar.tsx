import React, { useState } from 'react'
import { useLocation, Link } from 'react-router-dom'

interface NavBarProps {
	disconnect: () => void
}

function NavBar({ disconnect }: NavBarProps) {
	// Variables
	const location = useLocation()

	const [backButton, setBackButton] = useState("released")
	const [logoutButton, setLogoutButton] = useState("released")

	const [homeButton, setHomeButton] = useState("released")
	const [profilButton, setProfilButton] = useState("released")
	const [leaderboardButton, setLeaderboardButton] = useState("released")

	const [statsButton, setStatsButton] = useState("released")
	const [charactersButton, setCharactersButton] = useState("released")
	const [friendsButton, setFriendsButton] = useState("released")

	// Modifieurs
	const renderHomeLinks = () => (
		<>
			<div className={`navbBar__first navbBar__backLink logout__button ${logoutButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setLogoutButton("pressed")}
				onMouseUp={() => { setLogoutButton("released"); disconnect() }}>
				[ LOGOUT ]
			</div>
			<Link className={`${profilButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setProfilButton("pressed")}
				onMouseUp={() => setProfilButton("released")}
				to='/profil' >
				[ PROFIL ]
			</Link>
			<Link className={`navbBar__last ${leaderboardButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setLeaderboardButton("pressed")}
				onMouseUp={() => setLeaderboardButton("released")}
				to='/leaderboard'>
				[ LEADERBOARD ]
			</Link>
		</>
	)
	const renderProfilLinks = () => (
		<>
			<Link className={`navbBar__first navbBar__backLink ${backButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setBackButton("pressed")}
				onMouseUp={() => setBackButton("released")}
				to='/'>
				[ BACK ]
			</Link>
			<Link className={`${statsButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setStatsButton("pressed")}
				onMouseUp={() => setStatsButton("released")}
				to='/profil'>
				[ STATS ]
			</Link>
			<Link className={`${charactersButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setCharactersButton("pressed")}
				onMouseUp={() => setCharactersButton("released")}
				to='/profil/characters'>
				[ CHARACTERS ]
			</Link>
			<Link className={`navbBar__last ${friendsButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setFriendsButton("pressed")}
				onMouseUp={() => setFriendsButton("released")}
				to='/profil/friends'>
				[ FRIENDS ]
			</Link>
		</>
	)
	const renderLeaderboardLinks = () => (
		<>
			<Link className={`navbBar__first navbBar__last navbBar__backLink ${backButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setBackButton("pressed")}
				onMouseUp={() => setBackButton("released")}
				to='/'>[ BACK ]
			</Link>
		</>
	)
	const render404 = () => (
		<>
			<Link className={`navbBar__first ${homeButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setHomeButton("pressed")}
				onMouseUp={() => setHomeButton("released")}
				to='/'>
				[ HOME ]
			</Link>
			<Link className={`${profilButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setProfilButton("pressed")}
				onMouseUp={() => setProfilButton("released")}
				to='/profil'>
				[ PROFIL ]
			</Link>
			<Link className={`navbBar__last ${leaderboardButton === "pressed" ? "navBar__button--pressed" : ""}`}
				onMouseDown={() => setLeaderboardButton("pressed")}
				onMouseUp={() => setLeaderboardButton("released")}
				to='/leaderboard'>
				[ LEADERBOARD ]
			</Link>
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
		<nav className='navbBar'>
			{getRender(location.pathname)}
		</nav>
	)
}
export default NavBar