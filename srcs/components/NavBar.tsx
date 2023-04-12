import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { newBox } from './utils.tsx'

interface NavBarProps {
	disconnect: () => void
}

function NavBar({ disconnect }: NavBarProps) {
	// Valeurs
	const location = useLocation()
	const [boxPressed, setBoxPressed] = useState(0)

	const isPressed = (id: number) => (boxPressed === id ? 'navBar__box--pressed' : '')
	const backLink = 'navbBar__backLink'
	const firstLink = 'navbBar__first'
	const lastLink = 'navbBar__last'

	const logoutBoxName = `${isPressed(1)} ${backLink} ${firstLink}`
	const backBoxName = `${isPressed(2)} ${backLink} ${firstLink}`

	const homeBoxName = `${isPressed(3)}`
	const profilBoxName = `${isPressed(4)}`
	const leaderBoxName = `${isPressed(5)} ${lastLink}`

	const statsBoxName = `${isPressed(6)}`
	const charactersBoxName = `${isPressed(7)}`
	const friendsBoxName = `${isPressed(8)} ${lastLink}`

	const logoutBox = (name: string) => (
		newBox({
			tag: 'div',
			className: name,
			onMouseDown: () => setBoxPressed(1),
			onMouseUp: () => { setBoxPressed(0); disconnect() },
			content: '[ LOGOUT ]'
		})
	)
	const backBox = (name: string) => (
		newBox({
			tag: 'Link',
			className: name,
			to: '/',
			onMouseDown: () => setBoxPressed(2),
			onMouseUp: () => setBoxPressed(0),
			content: '[ BACK ]'
		})
	)

	const homeBox = (name: string) => (
		newBox({
			tag: 'Link',
			className: name,
			to: '/',
			onMouseDown: () => setBoxPressed(3),
			onMouseUp: () => setBoxPressed(0),
			content: '[ HOME ]'
		})
	)
	const profilBox = (name: string) => (
		newBox({
			tag: 'Link',
			className: name,
			to: '/profil',
			onMouseDown: () => setBoxPressed(4),
			onMouseUp: () => setBoxPressed(0),
			content: '[ PROFIL ]'
		})
	)
	const leaderBox = (name: string) => (
		newBox({
			tag: 'Link',
			className: name,
			to: '/leaderboard',
			onMouseDown: () => setBoxPressed(5),
			onMouseUp: () => setBoxPressed(0),
			content: '[ LEADER ]'
		})
	)

	const statsBox = (name: string) => (
		newBox({
			tag: 'Link',
			className: name,
			to: '/profil',
			onMouseDown: () => setBoxPressed(6),
			onMouseUp: () => setBoxPressed(0),
			content: '[ STATS ]'
		})
	)
	const charactersBox = (name: string) => (
		newBox({
			tag: 'Link',
			className: name,
			to: '/profil/characters',
			onMouseDown: () => setBoxPressed(7),
			onMouseUp: () => setBoxPressed(0),
			content: '[ CHARACTERS ]'
		})
	)
	const friendsBox = (name: string) => (
		newBox({
			tag: 'Link',
			className: name,
			to: '/profil/friends',
			onMouseDown: () => setBoxPressed(8),
			onMouseUp: () => setBoxPressed(0),
			content: '[ FRIENDS ]'
		})
	)

	const renderFromHome = () => (
		<>
			{logoutBox(logoutBoxName)}
			{profilBox(profilBoxName)}
			{leaderBox(leaderBoxName)}
		</>
	)
	const renderFromProfil = () => (
		<>
			{backBox(backBoxName)}
			{statsBox(statsBoxName)}
			{charactersBox(charactersBoxName)}
			{friendsBox(friendsBoxName)}
		</>
	)
	const renderFromLeader = () => (
		<>
			{backBox(backBoxName + ' navbBar__last')}
		</>
	)
	const renderFrom404 = () => (
		<>
			{logoutBox(logoutBoxName)}
			{profilBox(profilBoxName)}
			{leaderBox(leaderBoxName)}
			{homeBox(homeBoxName)}
		</>
	)

	// Modifieurs
	const render = function (path: string) {
		const linksMap: { [key: string]: () => JSX.Element } = {
			'/': renderFromHome,
			'/profil': renderFromProfil,
			'/profil/friends': renderFromProfil,
			'/profil/characters': renderFromProfil,
			'/leaderboard': renderFromLeader,
			'/party': () => <></>,
			'404': renderFrom404
		}
		return linksMap[path] ? linksMap[path]() : linksMap['404']()
	}

	// Retour
	return <nav className='navbBar'>{render(location.pathname)}</nav>
}
export default NavBar