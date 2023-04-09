import React from "react"
import { useLocation } from 'react-router-dom'

function Profil() {
	// Variables
	const location = useLocation()

	// Modifieurs
	const rendeFriends = () => (
		<div className="profil__friends">
			Friends
		</div>
	)
	const renderCharacters = () => (
		<div className="profil__characters">
			Characters
		</div>
	)
	const renderStats = () => (
		<div className="profil__stats">
			Stats
		</div>
	)

	const getRender = (path: string) => {
		const renderLinksMap: { [key: string]: () => JSX.Element } = {
			'/profil/friends': rendeFriends,
			'/profil/characters': renderCharacters,
			'/profil': renderStats
		}
		return renderLinksMap[path] ? renderLinksMap[path]() : renderLinksMap['404']()
	}

	// Retour
	return (
		<main className="profil main__content">
			{getRender(location.pathname)}
		</main>
	)
}
export default Profil