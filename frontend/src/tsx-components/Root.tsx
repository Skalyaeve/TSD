import React, { useRef, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

import { useTgl } from '../tsx-utils/ftHooks.tsx'
import { FtMotionBtn } from '../tsx-utils/ftBox.tsx'
import { bouncyPopUpByPx } from '../tsx-utils/ftFramerMotion.tsx'
import NavBar from './NavBar.tsx'
import Chat from './Chat.tsx'
import Matchmaker from './Matchmaker.tsx'
import Home from './Home.tsx'
import AccountInfos from './AccountInfos.tsx'
import Friends from './Friends.tsx'
import Characters from './Characters.tsx'
import Party from './Game.tsx'
import Leader from './Leader.tsx'
import ErrorPage from './ErrorPage.tsx'
import '../css/Root.css'

// --------LOG-SCREEN------------------------------------------------------ //
interface LogginBtnProps {
	tglLogged: () => void
}
const LoginBtn: React.FC<LogginBtnProps> = ({ tglLogged }) => {
	// ----REFS------------------------------- //
	const animating = useRef(false)

	// ----ANIMATIONS------------------------- //
	const btnMotion = {
		...bouncyPopUpByPx({ finalWidth: 325, finalHeight: 125 }),
		whileHover: {
			scale: 1.025,
			transition: {
				duration: 1,
				repeat: Infinity,
				repeatType: 'reverse',
				ease: 'linear'
			}
		}
	}

	// ----CLASSNAMES------------------------- //
	const name = 'login-btn'
	const parentName = `${name}-box`
	const pressedName = `${name}--pressed`

	// ----RENDER----------------------------- //
	return <div className={parentName}>
		<FtMotionBtn className={name}
			pressedName={pressedName}
			handler={{
				onMouseUp: () => {
					if (!animating.current) {
						tglLogged()
						animating.current = true
					}
				}
			}}
			motionProps={btnMotion}
			content='[42Auth]'
		/>
	</div>
}

// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----ROUTER----------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [logged, tglLogged] = useTgl(localStorage.getItem('logged') === '1')

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (logged && localStorage.getItem('inGame') === '1')
			navigate('/game')
	}, [location.pathname])

	useEffect(() => {
		localStorage.setItem('logged', logged ? '1' : '0')
	}, [logged])

	// ----CLASSNAMES------------------------- //
	const headerName = 'header'

	// ----RENDER----------------------------- //
	return <AnimatePresence mode='wait'>
		{!logged && <LoginBtn key='login' tglLogged={tglLogged} />}

		{logged && <>
			<header className={headerName}>
				<NavBar tglLogged={tglLogged} />
				<Chat />
				<Matchmaker />
			</header>

			<AnimatePresence mode='wait'>
				<Routes location={location} key={location.pathname}>
					<Route path='/' element={<Home />} />
					<Route path='/profile' element={<AccountInfos />} />
					<Route path='/profile/friends' element={<Friends />} />
					<Route path='/characters' element={<Characters />} />
					<Route path='/leader' element={<Leader />} />
					<Route path='/game' element={<Party />} />
					<Route path='*' element={<ErrorPage code={404} />} />
				</Routes>
			</AnimatePresence>
		</>}
	</AnimatePresence>
}
export default Root