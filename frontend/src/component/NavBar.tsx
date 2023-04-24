import React, { memo, useMemo } from 'react'
import { Routes, Route } from 'react-router-dom'
import { NewBox } from './utils.tsx'
import { GameInfos } from './Matchmaker.tsx'

// --------LINK------------------------------------------------------------ //
interface NavBarLinkProps {
	to: string
	nameExt?: string
	content: string
}
const NavBarLink: React.FC<NavBarLinkProps> = memo(({
	to, nameExt, content
}) => {
	// ----CLASSNAMES------------------------- //
	const name = 'navBar-link'

	// ----RENDER----------------------------- //
	return <NewBox
		tag='Link'
		to={to}
		className={`${name}${nameExt || ''}`}
		nameIfPressed={`${name}--pressed`}
		content={content}
	/>
})

// --------NAVBAR---------------------------------------------------------- //
interface NavBarProps {
	disconnect: () => void
}
const NavBar: React.FC<NavBarProps> = memo(({ disconnect }) => {
	// ----HANDLERS--------------------------- //
	const logoutBtnHdl = useMemo(() => ({
		onMouseUp: disconnect
	}), [])

	// ----CLASSNAMES------------------------- //
	const name = 'navBar'
	const linkName = `${name}-link`
	const backLinkName = ` ${linkName}--back`
	const firstLinkName = ` ${linkName}--first`
	const lastLinkName = ` ${linkName}--last`

	// ----RENDER----------------------------- //
	const logoutBox = <NewBox
		tag='btn'
		className={`${linkName}${firstLinkName}${backLinkName}`}
		nameIfPressed={`${linkName}--pressed`}
		handlers={logoutBtnHdl}
		content='[LOGOUT]'
	/>

	const fromHome = <nav className={name}>
		{logoutBox}
		<NavBarLink to='/profile'
			content='[PROFILE]'
		/>
		<NavBarLink to='/leaderboard' nameExt={lastLinkName}
			content='[LEADER]'
		/>
	</nav>

	const fromProfil = <nav className={name}>
		<NavBarLink to='/' nameExt={firstLinkName + backLinkName}
			content='[BACK]'
		/>
		<NavBarLink to='/profile'
			content='[INFOS]'
		/>
		<NavBarLink to={`/profile/friends`}
			content='[FRIENDS]'
		/>
		<NavBarLink to={`/profile/characters`} nameExt={lastLinkName}
			content='[CHARACTERS]'
		/>
	</nav>

	const fromLeader = <nav className={name}>
		<NavBarLink to='/' nameExt={firstLinkName + backLinkName + lastLinkName}
			content='[BACK]'
		/>
	</nav>

	const from404 = <nav className={name}>
		{logoutBox}
		<NavBarLink to='/profile'
			content='[PROFIL]'
		/>
		<NavBarLink to='/leaderboard'
			content='[LEADER]'
		/>
		<NavBarLink to='/' nameExt={lastLinkName}
			content='[HOME]'
		/>
	</nav>

	return <Routes>
		<Route path='/' element={fromHome} />
		<Route path='/profile/*' element={fromProfil} />
		<Route path='/leaderboard' element={fromLeader} />
		<Route path='/game' element={<GameInfos />} />
		<Route path='*' element={from404} />
	</Routes>
})
export default NavBar