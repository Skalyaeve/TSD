import React, { useRef, useState, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cutThenCompare } from '../tsx-utils/ftStrings.tsx'
import { bouncyHeightChangeByPercent, bouncyHeightChangeByPx, bouncyYMove, mergeMotions } from '../tsx-utils/ftMotion.tsx'
import { GameInfos } from './Matchmaker.tsx'

// --------ANIMATIONS------------------------------------------------------ //
const BACK_LINK_HEIGHT = 50
const LINK_HEIGHT = 75

const navBarMotion = (height: number) => bouncyHeightChangeByPx({
	finalHeight: height,
	maxHeight: height + height * 0.3
})
const navBarLinkMotion = (from: number) => mergeMotions(
	bouncyHeightChangeByPercent({ finalHeight: 101, maxHeight: 101 }),
	bouncyYMove({ from: from, extra: 0 })
)

// --------CLASSNAMES------------------------------------------------------ //
const NAME = 'navBar'
const LINK_NAME = `${NAME}-link`
const MOTION_LINK_NAME = `${LINK_NAME}-motion`

// --------LINK------------------------------------------------------------ //
interface NavBarLinkProps {
	index: number
	to: string
	content: string
	animating: React.MutableRefObject<boolean>
}
const NavBarLink: React.FC<NavBarLinkProps> = ({
	index, to, content, animating
}) => {
	// ----HANDLERS--------------------------- //
	const linkHdl = {
		onClick: (e: React.MouseEvent) => {
			if (animating.current || localStorage.getItem('inGame') === '1')
				e.preventDefault()
		}
	}

	// ----ANIMATIONS------------------------- //
	const comeFrom = (index ?
		BACK_LINK_HEIGHT + LINK_HEIGHT * (index - 1) : 0
	)
	const linkMotion = {
		...navBarLinkMotion(-comeFrom),
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
	return <motion.div className={MOTION_LINK_NAME} {...linkMotion}>
		<NavLink className={LINK_NAME} to={to} {...linkHdl}>
			{content}
		</NavLink>
	</motion.div>
}

// --------RENDER-FROM-HOME------------------------------------------------ //
interface FromHomeProps {
	setLogged: React.Dispatch<React.SetStateAction<boolean>>
	setRender: React.Dispatch<React.SetStateAction<JSX.Element>>
	animating: React.MutableRefObject<boolean>
}
const FromHome: React.FC<FromHomeProps> = ({
	setLogged, setRender, animating
}) => {
	// ----HANDLERS--------------------------- //
	const logoutBtnHdl = {
		onMouseUp: () => {
			if (animating.current) return
			setLogged(false)
			setRender(<></>)
			animating.current = true
		}
	}

	// ----ANIMATIONS------------------------- //
	const logoutBtnMotion = {
		...navBarLinkMotion(0),
		whileHover: {
			scale: 1.025,
			borderBottomLeftRadius: '5px',
			borderBottomRightRadius: '5px',
			transition: { ease: 'easeInOut' }
		}
	}

	// ----CLASSNAMES------------------------- //
	const logoutBtnName = `${LINK_NAME} ${MOTION_LINK_NAME}`

	// ----RENDER----------------------------- //
	return <motion.nav className={NAME}
		{...navBarMotion(BACK_LINK_HEIGHT + LINK_HEIGHT * 3)}>
		<motion.button
			className={logoutBtnName}
			{...logoutBtnHdl}
			{...logoutBtnMotion}>
			[LOGOUT]
		</motion.button>
		<NavBarLink
			index={1}
			to='/profile'
			content='[PROFILE]'
			animating={animating}
		/>
		<NavBarLink
			index={2}
			to='/characters'
			content='[CHARACTERS]'
			animating={animating}
		/>
		<NavBarLink
			index={3}
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
		{...navBarMotion(BACK_LINK_HEIGHT + LINK_HEIGHT * 2)}>
		<NavBarLink
			index={0}
			to='/'
			content='[BACK]'
			animating={animating}
		/>
		<NavBarLink
			index={1}
			to='/profile'
			content='[INFOS]'
			animating={animating}
		/>
		<NavBarLink
			index={2}
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
		{...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
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
	<motion.nav className={NAME} {...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
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
	<motion.nav className={NAME} {...navBarMotion(BACK_LINK_HEIGHT)}>
		<NavBarLink
			index={0}
			to='/'
			content='[HOME]'
			animating={animating}
		/>
	</motion.nav>
)

// --------NAVBAR---------------------------------------------------------- //
interface NavBarProps {
	setLogged: React.Dispatch<React.SetStateAction<boolean>>
}
const NavBar: React.FC<NavBarProps> = ({ setLogged }) => {
	// ----ROUTER----------------------------- //
	const location = useLocation()

	// ----REFS------------------------------- //
	const previousPath = useRef<string | null>(null)
	const animating = useRef(false)

	// ----STATES----------------------------- //
	const [render, setRender] = useState(<></>)

	// ----EFFECTS---------------------------- //
	useLayoutEffect(() => {
		if (previousPath.current !== null
			&& cutThenCompare(location.pathname, previousPath.current, '/', 1)) {
			animating.current = true
			previousPath.current = location.pathname
			const timer = setTimeout(() => { animating.current = false }, 550)
			return () => clearTimeout(timer)
		}
		else if (previousPath.current === null
			|| !cutThenCompare(location.pathname, previousPath.current, '/', 1)) {
			animating.current = true
			setRender(<Routes location={location} key={location.pathname}>
				<Route path='/login' element={<></>} />
				<Route path='/' element={<FromHome setLogged={setLogged} setRender={setRender} animating={animating} />} />
				<Route path='/profile/*' element={<FromProfile animating={animating} />} />
				<Route path='/characters' element={<FromCharacters animating={animating} />} />
				<Route path='/leader' element={<FromLeader animating={animating} />} />
				<Route path='/game' element={<GameInfos />} />
				<Route path='*' element={<From404 animating={animating} />} />
			</Routes>)
		}
		previousPath.current = location.pathname
	}, [location.pathname])

	// ----RENDER----------------------------- //
	return <AnimatePresence mode='wait'
		onExitComplete={() => animating.current = false}>
		{render}
	</AnimatePresence>
}
export default NavBar