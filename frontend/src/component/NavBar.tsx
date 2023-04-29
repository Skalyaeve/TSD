import React, { memo, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { NewBox } from './utils.tsx'
import { GameInfos } from './Matchmaker.tsx'

// --------LINK------------------------------------------------------------ //
interface NavBarLinkProps {
	to: string
	content: string
}
const NavBarLink: React.FC<NavBarLinkProps> = memo(({ to, content }) => {
	// ----CLASSNAMES---- ---------------- //
	const name = 'navBar-link'

	// ----RENDER----------------------------- //
	return <NewBox
		tag='Link'
		to={to}
		className={name}
		nameIfPressed={`${name}--pressed`}
		content={content}
	/>
})


// --------NAVBAR---------------------------------------------------------- //
interface NavBarProps {
	logoutBtnHdl: React.HTMLAttributes<HTMLElement>
}
const NavBar: React.FC<NavBarProps> = memo(({ logoutBtnHdl }) => {
	// ----VALUES----------------------------- //
	const backLinkSize = 50
	const linkSize = 75

	// ----CLASSNAMES------------------------- //
	const name = 'navBar'
	const linkName = `${name}-link`

	// ----RENDER----------------------------- //
	const logoutBox = useMemo(() => <NewBox
		tag='btn'
		className={`${linkName}`}
		nameIfPressed={`${linkName}--pressed`}
		handlers={logoutBtnHdl}
		content='[LOGOUT]'
	/>, [])

	const fromHome = useMemo(() => {
		const height = backLinkSize + linkSize * 3
		return <nav className={name} style={{ height: height }}>
			{logoutBox}
			<NavBarLink to='/profile' content='[PROFILE]' />
			<NavBarLink to='/characters' content='[CHARACTERS]' />
			<NavBarLink to='/leader' content='[LEADER]' />
		</nav>
	}, [])

	const fromProfil = useMemo(() => {
		const height = backLinkSize + linkSize * 2
		return <nav className={name} style={{ height: height }}>
			<NavBarLink to='/' content='[BACK]' />
			<NavBarLink to='/profile' content='[INFOS]' />
			<NavBarLink to='/profile/friends' content='[FRIENDS]' />
		</nav>
	}, [])

	const fromLeader = useMemo(() => {
		const height = backLinkSize
		return <nav className={name} style={{ height: height }}>
			<NavBarLink to='/' content='[BACK]' />
		</nav>
	}, [])

	const fromCharacters = useMemo(() => {
		const height = backLinkSize
		return <nav className={name} style={{ height: height }}>
			<NavBarLink to='/' content='[BACK]' />
		</nav>
	}, [])

	const from404 = useMemo(() => {
		const height = backLinkSize + linkSize * 3
		return <nav className={name} style={{ height: height }}>
			{logoutBox}
			<NavBarLink to='/profile' content='[PROFIL]' />
			<NavBarLink to='/leader' content='[LEADER]' />
			<NavBarLink to='/' content='[HOME]' />
		</nav>
	}, [])

	return <Routes>
		<Route path='/' element={fromHome} index />
		<Route path='/profile/*' element={fromProfil} />
		<Route path='/characters' element={fromCharacters} />
		<Route path='/leader' element={fromLeader} />
		<Route path='/game' element={<GameInfos />} />
		<Route path='*' element={from404} />
	</Routes>
})
export default NavBar