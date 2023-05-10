import React, { useRef, useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { FtMotionBtn, FtMotionLink } from '../tsx-utils/ftBox.tsx'
import { cutThenCompare } from '../tsx-utils/ftStrings.tsx'
import { bouncyHeightChangeByPercent, bouncyHeightChangeByPx, bouncyYMove, mergeMotions } from '../tsx-utils/ftFramerMotion.tsx'
import { GameInfos } from './Matchmaker.tsx'

// --------VALUES---------------------------------------------------------- //
const BACK_LINK_HEIGHT = 50
const LINK_HEIGHT = 75

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'navBar'
const LINK_NAME = `${NAME}-link`
const LOGOUT_NAME = `${LINK_NAME} ${LINK_NAME}-motion`
const PRESSED_NAME = `${LINK_NAME}--pressed`

// --------LINK------------------------------------------------------------ //
interface NavBarLinkProps {
	index: number
	to: string
	content: string
	animating: React.MutableRefObject<boolean>
}
const NavBarLink: React.FC<NavBarLinkProps> = ({ index, to, content, animating }) => {
	// ----ANIMATIONS------------------------- //
	const comeFrom = (index ? BACK_LINK_HEIGHT + LINK_HEIGHT * (index - 1) : 0)
	const linkMotion = {
		...mergeMotions(
			bouncyHeightChangeByPercent({ finalHeight: 101, maxHeight: 101 }),
			bouncyYMove({ from: -comeFrom, extra: 0 })
		),
		whileHover: {
			scale: 1.025,
			borderTopLeftRadius: '5px',
			borderTopRightRadius: '5px',
			borderBottomLeftRadius: '5px',
			borderBottomRightRadius: '5px',
			transition: { ease: 'easeInOut' }
		}
	}

	// ----RENDER----------------------------- //
	return <FtMotionLink className={LINK_NAME}
		pressedName={PRESSED_NAME}
		to={to}
		handler={{
			onClick: (e: React.MouseEvent) => {
				if (animating.current || localStorage.getItem('inGame') === '1')
					e.preventDefault()
			}
		}}
		motionProps={linkMotion}
		content={content}
	/>
}

// --------RENDER-FROM-HOME------------------------------------------------ //
interface FromHomeProps {
	tglLogged: () => void
	setRender: React.Dispatch<React.SetStateAction<JSX.Element>>
	animating: React.MutableRefObject<boolean>
}
const FromHome: React.FC<FromHomeProps> = ({ tglLogged, setRender, animating }) => {
	// ----ANIMATIONS------------------------- //
	const logoutBtnMotion = {
		...mergeMotions(
			bouncyHeightChangeByPercent({ finalHeight: 101, maxHeight: 101 }),
			bouncyYMove({ from: 0, extra: 0 })
		),
		whileHover: {
			scale: 1.025,
			borderBottomLeftRadius: '5px',
			borderBottomRightRadius: '5px',
			transition: { ease: 'easeInOut' }
		}
	}

	// ----RENDER----------------------------- //
	return <motion.nav className={NAME}
		{...bouncyHeightChangeByPx({ finalHeight: BACK_LINK_HEIGHT + LINK_HEIGHT * 3 })}>
		<FtMotionBtn className={LOGOUT_NAME}
			handler={{
				onMouseUp: () => {
					if (animating.current) return
					tglLogged()
					animating.current = true
					setRender(<></>)
				}
			}}
			motionProps={logoutBtnMotion}
			content='[LOGOUT]'
		/>
		<NavBarLink index={1}
			to='/profile'
			content='[PROFILE]'
			animating={animating}
		/>
		<NavBarLink index={2}
			to='/characters'
			content='[CHARACTERS]'
			animating={animating}
		/>
		<NavBarLink index={3}
			to='/leader'
			content='[LEADER]'
			animating={animating}
		/>
	</motion.nav >
}

// --------RENDER-FROM-PROFILE--------------------------------------------- //
interface FromProfileProps {
	animating: React.MutableRefObject<boolean>
}
const FromProfile: React.FC<FromProfileProps> = ({ animating }) => (
	<motion.nav className={NAME}
		{...bouncyHeightChangeByPx({ finalHeight: BACK_LINK_HEIGHT + LINK_HEIGHT * 2 })}>
		<NavBarLink index={0}
			to='/'
			content='[BACK]'
			animating={animating}
		/>
		<NavBarLink index={1}
			to='/profile'
			content='[INFOS]'
			animating={animating}
		/>
		<NavBarLink index={2}
			to='/profile/friends'
			content='[FRIENDS]'
			animating={animating}
		/>
	</motion.nav>
)

// --------RENDER-FROM-CHARACTERS------------------------------------------ //
interface FromCharactersProps {
	animating: React.MutableRefObject<boolean>
}
const FromCharacters: React.FC<FromCharactersProps> = ({ animating }) => (
	<motion.nav className={NAME}
		{...bouncyHeightChangeByPx({ finalHeight: BACK_LINK_HEIGHT })}>
		<NavBarLink index={0}
			to='/'
			content='[BACK]'
			animating={animating}
		/>
	</motion.nav>
)

// --------RENDER-FROM-LEADER---------------------------------------------- //
interface FromLeaderProps {
	animating: React.MutableRefObject<boolean>
}
const FromLeader: React.FC<FromLeaderProps> = ({ animating }) => (
	<motion.nav className={NAME}
		{...bouncyHeightChangeByPx({ finalHeight: BACK_LINK_HEIGHT })}>
		<NavBarLink index={0}
			to='/'
			content='[BACK]'
			animating={animating}
		/>
	</motion.nav>
)

// --------RENDER-FROM-404------------------------------------------------- //
interface From404Props {
	animating: React.MutableRefObject<boolean>
}
const From404: React.FC<From404Props> = ({ animating }) => (
	<motion.nav className={NAME}
		{...bouncyHeightChangeByPx({ finalHeight: BACK_LINK_HEIGHT })}>
		<NavBarLink index={0}
			to='/'
			content='[HOME]'
			animating={animating}
		/>
	</motion.nav>
)

// --------NAVBAR---------------------------------------------------------- //
interface NavBarProps {
	tglLogged: () => void
}
const NavBar: React.FC<NavBarProps> = ({ tglLogged }) => {
	// ----ROUTER----------------------------- //
	const location = useLocation()

	// ----REFS------------------------------- //
	const previousPath = useRef<string | null>(null)
	const animating = useRef(false)

	// ----STATES----------------------------- //
	const [render, setRender] = useState(<></>)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (previousPath.current !== null && cutThenCompare(location.pathname, previousPath.current, '/', 1)) {
			animating.current = true
			const timer = setTimeout(() => { animating.current = false }, 500)
			return () => clearTimeout(timer)
		}
		else if (previousPath.current === null
			|| !cutThenCompare(location.pathname, previousPath.current, '/', 1)) {
			animating.current = true
			setRender(
				<Routes location={location} key={location.pathname}>
					<Route path='/login' element={<></>} />
					<Route path='/' element={
						<FromHome
							tglLogged={tglLogged}
							setRender={setRender}
							animating={animating}
						/>
					} />
					<Route path='/profile/*' element={<FromProfile animating={animating} />} />
					<Route path='/characters' element={<FromCharacters animating={animating} />} />
					<Route path='/leader' element={<FromLeader animating={animating} />} />
					<Route path='/game' element={<GameInfos />} />
					<Route path='*' element={<From404 animating={animating} />} />
				</Routes>
			)
		}
		previousPath.current = location.pathname
	}, [location.pathname])

	// ----RENDER----------------------------- //
	return <AnimatePresence mode='wait'
		onExitComplete={() => { animating.current = false }}>
		{render}
	</AnimatePresence>
}
export default NavBar