import React from 'react'
import { useLocation } from 'react-router-dom'

function Profil() {
	// Valeurs
	const location = useLocation()

	// Modifieurs
	const renderFriends = () => (
		<div className='profil__friends'>
			Friends
		</div>
	)
	const renderCharacters = () => (
		<div className='profil__characters'>
			Characters
		</div>
	)
	const renderStats = () => (
		<div className='profil__stats'>
			Stats
		</div>
	)
	const getRender = (path: string) => {
		const renderLinksMap: { [key: string]: () => JSX.Element } = {
			'/profil/friends': renderFriends,
			'/profil/characters': renderCharacters,
			'/profil': renderStats
		}
		return renderLinksMap[path]()
	}

	// Retour
	return (
		<div className='profil main__content'>
			{getRender(location.pathname)}
		</div>
	)
}
export default Profil