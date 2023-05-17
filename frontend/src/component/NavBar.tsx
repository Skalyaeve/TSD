import React, {
	memo, useMemo, useCallback, useState, useEffect, useRef
} from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { NewBox, cutThenCompare } from './utils.tsx'
import { bouncyHeightGrowByPx, bouncyGrowingListElem } from './framerMotionAnime.tsx'
import { GameInfos } from './Matchmaker.tsx'

// --------VALUES---------------------------------------------------------- //
const animeDuration = 0.5
const backLinkHeight = 50
const linkHeight = 75

// --------LINK------------------------------------------------------------ //
interface NavBarLinkProps {
	name: string
	to: string
	index: number
	content: string
}
const NavBarLink: React.FC<NavBarLinkProps> = memo(({ name, to, index, content }) => {
	// ----RENDER----------------------------- //
	const comeFrom = index ? backLinkHeight + linkHeight * (index - 1) : 0
	const growingListRender = bouncyGrowingListElem(
		-comeFrom, (index ? linkHeight + 1 : backLinkHeight), 0.2, 0.75, animeDuration
	)

	return <motion.div
		key={`${name}-motion`}
		className={`${name}-motion`}
		whileHover={{
			borderRadius: '5px',
			scale: 1.025,
			transition: { ease: 'easeInOut' }
		}}
		{...growingListRender}
	>
		<NewBox
			tag='Link'
			to={to}
			className={name}
			nameIfPressed={`${name}--pressed`}
			content={content}
		/>
	</motion.div>
})


// --------NAVBAR---------------------------------------------------------- //
interface NavBarProps {
	loggedTgl: () => void
}
const NavBar: React.FC<NavBarProps> = memo(({ loggedTgl }) => {
	// ----LOCATION--------------------------- //
	const location = useLocation()

	// ----REFS------------------------------- //
	const previousPath = useRef<string | null>(null)

	// ----STATES----------------------------- //
	const [displayedElement, setDisplayedElement] = useState<JSX.Element>(<></>)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (previousPath.current === null || !cutThenCompare(location.pathname, previousPath.current)) {
			setDisplayedElement(
				<Routes location={location} key={location.pathname}>
					<Route path='/' element={fromHome} />
					<Route path='/profile/*' element={fromProfil} />
					<Route path='/characters' element={fromCharacters} />
					<Route path='/leader' element={fromLeader} />
					<Route path='/game' element={<GameInfos />} />
					<Route path='/chat' element={fromChatBig} />
					<Route path='*' element={from404} />
				</Routes>
			)
		}
		previousPath.current = location.pathname
	}, [location.pathname])

	// ----HANDLERS--------------------------- //
	const handleLogBtn = useCallback(() => {
		loggedTgl()
		setDisplayedElement(<></>)
	}, [loggedTgl])

	const logBtnHdl = useMemo(() => ({
		onMouseUp: handleLogBtn
	}), [handleLogBtn])

	// ----CLASSNAMES------------------------- //
	const name = 'navBar'
	const linkName = `${name}-link`

	// ----RENDER----------------------------- //
	const logoutBoxAnimeRender = useMemo(() => bouncyHeightGrowByPx(
		backLinkHeight + 1, 0.2, 0.75, animeDuration
	), [])

	const logoutBox = useMemo(() => <motion.div
		key={`${linkName}-motion`}
		className={`${linkName}-motion`}
		whileHover={{
			borderRadius: '5px',
			scale: 1.025,
			transition: { ease: 'easeInOut' }
		}}
		{...logoutBoxAnimeRender}
	>
		<NewBox
			tag='btn'
			className={`${linkName}`}
			nameIfPressed={`${linkName}--pressed`}
			handlers={logBtnHdl}
			content='[LOGOUT]'
		/>
	</motion.div>, [])

	const fromHome = useMemo(() => {
		const navBarAnimeRender = bouncyHeightGrowByPx(backLinkHeight + linkHeight * 3, 0.2, 0.75, animeDuration)
		return <motion.nav key={`${name}-fromHome`} className={name} {...navBarAnimeRender}>
			{logoutBox}
			<NavBarLink name={linkName} to='/profile' index={1}
				content='[PROFILE]' />
			<NavBarLink name={linkName} to='/characters' index={2}
				content='[CHARACTERS]' />
			<NavBarLink name={linkName} to='/leader' index={3}
				content='[LEADER]' />
		</motion.nav>
	}, [])

	const fromProfil = useMemo(() => {
		const navBarAnimeRender = bouncyHeightGrowByPx(backLinkHeight + linkHeight * 2, 0.2, 0.75, animeDuration)
		return <motion.nav key={`${name}-fromProfil`} className={name} {...navBarAnimeRender}>
			<NavBarLink name={linkName} to='/' index={0}
				content='[BACK]' />
			<NavBarLink name={linkName} to='/profile' index={1}
				content='[INFOS]' />
			<NavBarLink name={linkName} to='/profile/friends' index={2}
				content='[FRIENDS]' />
		</motion.nav>
	}, [])

	const fromLeader = useMemo(() => {
		const navBarAnimeRender = bouncyHeightGrowByPx(backLinkHeight, 0.2, 0.75, animeDuration)
		return <motion.nav key={`${name}-fromLeader`} className={name} {...navBarAnimeRender}>
			<NavBarLink name={linkName} to='/' index={0}
				content='[BACK]' />
		</motion.nav>
	}, [])

	const fromCharacters = useMemo(() => {
		const navBarAnimeRender = bouncyHeightGrowByPx(backLinkHeight, 0.2, 0.75, animeDuration)
		return <motion.nav key={`${name}-fromCharacters`} className={name} {...navBarAnimeRender}>
			<NavBarLink name={linkName} to='/' index={0}
				content='[BACK]' />
		</motion.nav>
	}, [])

	const from404 = useMemo(() => {
		const navBarAnimeRender = bouncyHeightGrowByPx(backLinkHeight, 0.2, 0.75, animeDuration)
		return <motion.nav key={`${name}-from404`} className={name} {...navBarAnimeRender}>
			<NavBarLink name={linkName} to='/' index={0}
				content='[HOME]' />
		</motion.nav>
	}, [])

	const fromChatBig = useMemo(() => {
		const navBarAnimeRender = bouncyHeightGrowByPx(backLinkHeight, 0.2, 0.75, animeDuration)
		return <motion.nav key={`${name}-fromChatBig`} className={name} {...navBarAnimeRender}>
			<NavBarLink name={linkName} to='/' index={0}
				content='[HOME]' />
		</motion.nav>
	}, [])



	return <AnimatePresence mode='wait'>
		{displayedElement}
	</AnimatePresence>
})
export default NavBar