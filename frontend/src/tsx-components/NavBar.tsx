import React, { useMemo, useCallback, useState, useLayoutEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { FtMotionLink, FtMotionBtn } from '../tsx-utils/ftSam/ftBox.tsx'
import { cutThenCompare } from '../tsx-utils/ftSam/ftStrings.tsx'
import { bouncyHeightGrowByPx, bouncyGrowingListElem } from '../tsx-utils/ftSam/ftFramerMotion.tsx'
import { GameInfos } from './Matchmaker.tsx'

// --------LINK------------------------------------------------------------ //
interface NavBarLinkProps {
	name: string
	to: string
	index: number
	content: string
}
const NavBarLink: React.FC<NavBarLinkProps> = ({ name, to, index, content }) => {
	// ----ANIMATIONS------------------------- //
	const animeDuration = 0.5
	const backLinkHeight = 50
	const linkHeight = 75

	const barHeight = (index ? linkHeight + 1 : backLinkHeight + 1)
	const comeFrom = (index ? backLinkHeight + linkHeight * (index - 1) : 0)
	const linkMotion = {
		...bouncyGrowingListElem(-comeFrom, barHeight, 0.2, 0.75, animeDuration),
		whileHover: {
			borderTopLeftRadius: '5px',
			borderTopRightRadius: '5px',
			borderBottomLeftRadius: '5px',
			borderBottomRightRadius: '5px',
			scale: 1.025,
			transition: {
				ease: 'easeInOut',
				repeat: Infinity,
				repeatType: "reverse"
			}
		}
	}

	// ----RENDER----------------------------- //
	return <FtMotionLink className={name}
		pressedName={`${name}--pressed`}
		to={to}
		motionProps={linkMotion}
		content={content}
	/>
}

// --------NAVBAR---------------------------------------------------------- //
interface NavBarProps {
	loggedFalse: () => void
}
const NavBar: React.FC<NavBarProps> = ({ loggedFalse }) => {
	// ----LOCATION--------------------------- //
	const location = useLocation()

	// ----REFS------------------------------- //
	const previousPath = useRef<string | null>(null)

	// ----STATES----------------------------- //
	const [render, setRender] = useState(<></>)

	// ----EFFECTS---------------------------- //
	useLayoutEffect(() => {
		if (previousPath.current === null
			|| !cutThenCompare(location.pathname, previousPath.current, '/', 1)) {
			setRender(
				<Routes location={location} key={location.pathname}>
					<Route path='/' element={fromHome} />
					<Route path='/profile/*' element={fromProfil} />
					<Route path='/characters' element={fromCharacters} />
					<Route path='/leader' element={fromLeader} />
					<Route path='/game' element={<GameInfos />} />
					<Route path='*' element={from404} />
				</Routes>
			)
		}
		previousPath.current = location.pathname
	}, [location.pathname])

	// ----HANDLERS--------------------------- //
	const logout = useCallback(() => {
		setRender(<></>)
		loggedFalse()
	}, [])

	const logoutBtnHdl = useMemo(() => ({
		onMouseUp: logout
	}), [])

	// ----CLASSNAMES------------------------- //
	const name = 'navBar'
	const linkName = `${name}-link`

	// ----ANIMATIONS------------------------- //
	const animeDuration = 0.5
	const backLinkHeight = 50
	const linkHeight = 75

	const logoutBtnMotion = useMemo(() => ({
		...bouncyHeightGrowByPx(backLinkHeight + 1, 0.2, 0.75, animeDuration),
		whileHover: {
			borderBottomLeftRadius: '5px',
			borderBottomRightRadius: '5px',
			scale: 1.025,
			transition: {
				ease: 'easeInOut',
				repeat: Infinity,
				repeatType: "reverse"
			}
		}
	}), [])

	const navBarMotion = useCallback((height: number) => (
		bouncyHeightGrowByPx(height, 0.2, 0.75, animeDuration)
	), [])

	// ----RENDER----------------------------- //
	const fromHome = useMemo(() => <motion.nav className={name}
		{...navBarMotion(backLinkHeight + linkHeight * 3)}>

		<FtMotionBtn className={`${linkName} ${linkName}-motion`}
			pressedName={`${linkName}--pressed`}
			handler={logoutBtnHdl}
			motionProps={logoutBtnMotion}
			content='[LOGOUT]'
		/>
		<NavBarLink name={linkName}
			to='/profile'
			index={1}
			content='[PROFILE]' />
		<NavBarLink name={linkName}
			to='/characters'
			index={2}
			content='[CHARACTERS]' />
		<NavBarLink name={linkName}
			to='/leader'
			index={3}
			content='[LEADER]' />
	</motion.nav>, [])

	const fromProfil = useMemo(() => <motion.nav className={name}
		{...navBarMotion(backLinkHeight + linkHeight * 2)}>

		<NavBarLink name={linkName}
			to='/'
			index={0}
			content='[BACK]' />
		<NavBarLink name={linkName}
			to='/profile'
			index={1}
			content='[INFOS]' />
		<NavBarLink name={linkName}
			to='/profile/friends'
			index={2}
			content='[FRIENDS]' />
	</motion.nav>, [])

	const fromLeader = useMemo(() => <motion.nav className={name}
		{...navBarMotion(backLinkHeight)}>

		<NavBarLink
			name={linkName} to='/'
			index={0}
			content='[BACK]' />
	</motion.nav>, [])

	const fromCharacters = useMemo(() => <motion.nav className={name}
		{...navBarMotion(backLinkHeight)}>

		<NavBarLink
			name={linkName} to='/'
			index={0}
			content='[BACK]' />
	</motion.nav>, [])

	const from404 = useMemo(() => <motion.nav className={name}
		{...navBarMotion(backLinkHeight)}>

		<NavBarLink name={linkName}
			to='/'
			index={0}
			content='[HOME]' />
	</motion.nav>, [])

	return <AnimatePresence mode='wait'>
		{render}
	</AnimatePresence>
}
export default NavBar