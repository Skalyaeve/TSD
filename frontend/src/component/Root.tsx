import React, { memo, useMemo, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { NewBox, useTgl } from './utils.tsx'
import { bouncyPopUpByPx, fadeInOut } from './framerMotionAnime.tsx'
import NavBar from './NavBar.tsx'
// import Chat from './Chat.tsx'
import Matchmaker from './Matchmaker.tsx'
import Home from './Home.tsx'
import Profile from './Profile.tsx'
import Characters from './Characters.tsx'
import Party from './Game.tsx'
import Leader from './Leader.tsx'
import ErrorPage from './ErrorPage.tsx'
import ChatLink from './Chat/ChatLink.tsx'
import Chat from './Chat/Chat.tsx'
import { Link } from 'react-router-dom'


// --------LOG-SCREEN------------------------------------------------------ //
interface LogScreenProps {
	loggedTgl: () => void
}
const LogScreen: React.FC<LogScreenProps> = memo(({ loggedTgl }) => {
	// ----HANDLERS--------------------------- //
	const logBtnHdl = useMemo(() => ({
		onMouseUp: loggedTgl
	}), [loggedTgl])

	// ----CLASSNAMES------------------------- //
	const loginBtnName = 'login-btn'
	const logScreenMotionName = 'logScreen-motion'

	// ----RENDER----------------------------- //
	const bouncyPopUpByPxRender = bouncyPopUpByPx(325, 125)

	return <motion.div
		key={logScreenMotionName}
		className={logScreenMotionName}
		whileHover={{
			scale: 1.025,
			transition: { ease: 'easeInOut' }
		}}
		{...bouncyPopUpByPxRender}
	>
		<NewBox
			tag='btn'
			className={loginBtnName}
			nameIfPressed={`${loginBtnName}--pressed`}
			handlers={logBtnHdl}
			content='[42Auth]'
		/>
	</motion.div>
})


// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----LOCATION--------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [logged, loggedTgl] = useTgl(localStorage.getItem('logged') === '1')

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		localStorage.setItem('logged', logged ? '1' : '0')
	}, [logged])

	useEffect(() => {
		if (logged && localStorage.getItem('inGame') === '1') navigate('/game')
	}, [location.pathname])

	// ----CLASSNAMES------------------------- //
	const rootMotionName = 'root-motion'

	// ----RENDER----------------------------- //
	const fadeInOutRender = useMemo(() => fadeInOut(1, 1), [])

	return <AnimatePresence mode='wait'>
		{!logged && <LogScreen loggedTgl={loggedTgl} />}
		{logged && <motion.div
			key={rootMotionName}
			className={rootMotionName}
			{...fadeInOutRender}>

			<header className='header'>
				<NavBar loggedTgl={loggedTgl} />
				<ChatLink />
				<Matchmaker />
			</header>

			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/profile/*' element={<Profile />} />
				<Route path='/characters' element={<Characters />} />
				<Route path='/leader' element={<Leader />} />
				<Route path='/game' element={<Party />} />
				<Route path="/chat" element={<Chat name="PIERINA"/>} />
				<Route path='*' element={<ErrorPage code={404} />} />
			</Routes>

		</motion.div>
		}
	</AnimatePresence>
}
export default Root