import React from 'react'
import { Routes, Route, useLocation, NavLink } from 'react-router-dom'
import Cookies from 'js-cookie';
import { AnimatePresence, motion } from 'framer-motion'
import { heightChangeByPx, yMove } from '../tsx-utils/ftMotion.tsx'
import { GameInfos } from './Matchmaker.tsx'

// --------ANIMATIONS------------------------------------------------------ //
const BACK_LINK_HEIGHT = 55
const LINK_HEIGHT = 75
const GRID_GAP = 5

const navBarMotion = (height: number) => heightChangeByPx({ finalHeight: height })
const navBarLinkMotion = (from: number) => yMove({ from: from })

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'navBar'
const LINK_NAME = `${NAME}-link`

// --------LINK------------------------------------------------------------ //
interface NavBarLinkProps {
	index: number
	to: string
	ext: string
}
const NavBarLink: React.FC<NavBarLinkProps> = ({ index, to, ext }) => {
	// ----HANDLERS--------------------------- //
	const linkHdl = {
		onMouseUp: (e: React.MouseEvent) => {
			if (localStorage.getItem('inGame') === '1')
				e.preventDefault()
		}
	}

	// ----ANIMATIONS------------------------- //
	const comeFrom = (index ? BACK_LINK_HEIGHT + LINK_HEIGHT * (index - 1) + 75 : 0)
	const linkMotion = navBarLinkMotion(-comeFrom)

	// ----CLASSNAMES------------------------- //
	const boxName = `${LINK_NAME}-motion`
	const linkTxtName = `${LINK_NAME} ${LINK_NAME}-${ext} custom-txt`

	// ----RENDER----------------------------- //
	return <motion.div className={boxName} {...linkMotion}>
		<NavLink to={to} {...linkHdl} className={linkTxtName} />
	</motion.div>
}

// --------RENDER-FROM-HOME------------------------------------------------ //
const FromHome: React.FC = () => {
	// ----HANDLERS--------------------------- //
	const logoutBtnHdl = {
		onMouseUp: () => {
			Cookies.remove('access_token', { path: '/', domain: 'localhost' })
			window.location.href = '/login'
		}
	}

	// ----ANIMATIONS------------------------- //
	const logoutBtnMotion = navBarLinkMotion(0)

	// ----CLASSNAMES------------------------- //
	const logoutBtnName = `${LINK_NAME}-motion`
	const logoutBtnTxTName = `${LINK_NAME} ${LINK_NAME}-logout custom-txt`

	// ----RENDER----------------------------- //
	return <motion.nav
		className={NAME}
		{...navBarMotion(BACK_LINK_HEIGHT + LINK_HEIGHT * 3 + GRID_GAP * 3)}>
		<motion.button
			className={logoutBtnName}
			{...logoutBtnHdl}
			{...logoutBtnMotion}>
			<div className={logoutBtnTxTName} />
		</motion.button>
		<NavBarLink
			index={1}
			to='/profile'
			ext='profile'
		/>
		<NavBarLink
			index={2}
			to='/characters'
			ext='characters'
		/>
		<NavBarLink
			index={3}
			to='/leader'
			ext='leader'
		/>
	</motion.nav >
}

// --------RENDER-FROM-INFOS----------------------------------------------- //
const FromInfos: React.FC = () => (
	<motion.nav
		className={NAME}
		{...navBarMotion(BACK_LINK_HEIGHT + LINK_HEIGHT + GRID_GAP)}>
		<NavBarLink
			index={0}
			to='/'
			ext='back'
		/>
		<NavBarLink
			index={2}
			to='/profile/friends'
			ext='friends'
		/>
	</motion.nav>
)

// --------RENDER-FROM-FRIENDS--------------------------------------------- //
const FromFriends: React.FC = () => (
	<motion.nav className={NAME} {...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
			to='/profile'
			ext='back'
		/>
	</motion.nav>
)

// --------RENDER-FROM-CHARACTERS------------------------------------------ //
const FromCharacters: React.FC = () => (
	<motion.nav className={NAME} {...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
			to='/'
			ext='back'
		/>
	</motion.nav>
)

// --------RENDER-FROM-LEADER---------------------------------------------- //
const FromLeader: React.FC = () => (
	<motion.nav className={NAME} {...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
			to='/'
			ext='back'
		/>
	</motion.nav>
)

// --------RENDER-FROM-404------------------------------------------------- //
const From404: React.FC = () => (
	<motion.nav className={NAME} {...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
			to='/'
			ext='home'
		/>
	</motion.nav>
)

// --------RENDER-FROM-CHAT------------------------------------------------ //
const FromChat: React.FC = () => (
	<motion.nav className={NAME} {...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
			to='/'
			ext='home'
		/>
	</motion.nav>
)

// --------NAVBAR---------------------------------------------------------- //
const NavBar: React.FC = () => {
	// ----ROUTER----------------------------- //
	const location = useLocation()

	// ----RENDER----------------------------- //
	return <AnimatePresence mode='wait'>
		<Routes location={location} key={location.pathname}>
			<Route path='/login' element={<></>} />
			<Route path='/' element={<FromHome />} />
			<Route path='/profile' element={<FromInfos />} />
			<Route path='/profile/friends' element={<FromFriends />} />
			<Route path='/characters' element={<FromCharacters />} />
			<Route path='/leader' element={<FromLeader />} />
			<Route path='/game' element={<GameInfos />} />
			<Route path='/chat' element={<FromChat />} />
			<Route path='*' element={<From404 />} />
		</Routes>
	</AnimatePresence>
}
export default NavBar