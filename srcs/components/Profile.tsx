import React, { useState } from "react"
import { useLocation } from 'react-router-dom'

function Profile() {
	// Variables
	const location = useLocation()

	// Modifieurs
	const rendeFriends = () => (
		<div className="profile__friends">
			Friends
		</div>
	)
	const renderCharacters = () => (
		<div className="profile__characters">
			Characters
		</div>
	)
	const renderStats = () => (
		<div className="profile__stats">
			Stats
		</div>
	)

	const getRender = (path: string) => {
		const renderLinksMap: { [key: string]: () => JSX.Element } = {
			'/profile/friends': rendeFriends,
			'/profile/characters': renderCharacters,
			'/profile': renderStats
		}
		return renderLinksMap[path] ? renderLinksMap[path]() : renderLinksMap['404']()
	}

	// Retour
	return (
		<main className="profile main__content">
			{getRender(location.pathname)}
		</main>
	)
}
export default Profile