import React, { useMemo, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { useTglBis } from '../tsx-utils/ftSam/ftHooks.tsx'
import { FtMotionBtn } from '../tsx-utils/ftSam/ftBox.tsx'
import { bouncyPopUpByPx, fadeInOut } from '../tsx-utils/ftSam/ftFramerMotion.tsx'
import NavBar from './NavBar.tsx'
import Chat from './Chat.tsx'
import Matchmaker from './Matchmaker.tsx'
import Home from './Home.tsx'
import Profile from './Profile.tsx'
import Characters from './Characters.tsx'
import Party from './Game.tsx'
import Leader from './Leader.tsx'
import ErrorPage from './ErrorPage.tsx'

// --------LOG-SCREEN------------------------------------------------------ //
interface LogginBtnProps {
	loggedTrue: () => void
}
const LogginBtn: React.FC<LogginBtnProps> = ({ loggedTrue }) => {
	// ----HANDLERS--------------------------- //
	const btnHdl = { onMouseUp: loggedTrue }

	// ----ANIMATIONS------------------------- //
	const btnMotion = {
		...bouncyPopUpByPx(325, 125),
		whileHover: {
			scale: 1.025,
			transition: {
				ease: 'easeInOut',
				duration: 1,
				repeat: Infinity,
				repeatType: "reverse"
			}
		}
	}

	// ----RENDER----------------------------- //
	return <FtMotionBtn className='login-btn'
		pressedName='login-btn--pressed'
		handler={btnHdl}
		motionProps={btnMotion}
		content='[42Auth]'
	/>
}

// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----LOCATION--------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [logged, loggedTrue, loggedFalse] = useTglBis(
		localStorage.getItem('logged') === '1'
	)

	// ----EFFECTS---------------------------- //
	useEffect(() => (
		localStorage.setItem('logged', logged ? '1' : '0')
	), [logged])

	useEffect(() => {
		if (logged && localStorage.getItem('inGame') === '1')
			navigate('/game')
	}, [location.pathname])

	// ----ANIMATIONS------------------------- //
	const rootMotion = useMemo(() => fadeInOut(1), [])

	// ----RENDER----------------------------- //
	return <AnimatePresence mode='wait'>
		{!logged && <LogginBtn loggedTrue={loggedTrue} />}

		{logged && <motion.div className='root-motion'
			key='root-motion'
			{...rootMotion}>

			<header className='header'>
				<NavBar loggedFalse={loggedFalse} />
				<Chat />
				<Matchmaker />
			</header>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/profile/*' element={<Profile />} />
				<Route path='/characters' element={<Characters />} />
				<Route path='/leader' element={<Leader />} />
				<Route path='/game' element={<Party />} />
				<Route path='*' element={<ErrorPage code={404} />} />
			</Routes>

		</motion.div>}
	</AnimatePresence>
}
export default Root