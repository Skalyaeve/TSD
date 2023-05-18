import React, { useRef, useState, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, MotionProps, motion } from 'framer-motion'
import { bouncyPopUpByPx, bouncyYMove } from '../tsx-utils/ftMotion.tsx'
import NavBar from './NavBar.tsx'
import SideChat from './SideChat.tsx'
import Matchmaker from './Matchmaker.tsx'
import Home from './Home.tsx'
import AccountInfos from './AccountInfos.tsx'
import Friends from './Friends.tsx'
import Characters from './Characters.tsx'
import Party from './Game.tsx'
import Leader from './Leader.tsx'
import ErrorPage from './ErrorPage.tsx'
import Chat from './Chat/Chat.tsx'
import '../css/Root.css'

// --------IS-CONNECTED---------------------------------------------------- //
const isConnected = async () => {
	const servID = 'http://localhost:3000'
	const path = '/users/connected'
	try {
		const response = await fetch(`${servID}${path}`, {
			method: 'GET',
			mode: 'cors',
			credentials: 'include'
		})
		if (response.ok) {
			const txt = await response.json()
			console.log(txt)
			return true
		}
		else console.error(`[ERROR] ${response.status}`)
	}
	catch { console.error('[ERROR] fetch() failed') }
	return false
}

// --------LOGIN-BTN------------------------------------------------------- //
interface LogginBtnProps {
	setLogged: React.Dispatch<React.SetStateAction<boolean>>
}
const LoginBtn: React.FC<LogginBtnProps> = ({ setLogged }) => {
	// ----REFS------------------------------- //
	const animating = useRef(false)

	// ----HANDLERS--------------------------- //
	const connect = async () => {
		const address = 'https://api.intra.42.fr'
		const clientID = 'u-s4t2ud-a460194637c8c56d45ed62db554eb664f3c2f05ad3bdcd5021f4f213fcda2bef'
		const redirectURI = 'http%3A%2F%2Flocalhost%3A3000%2Fauth%2F42%2Fcallback'
		const url = `${address}/oauth/authorize?response_type=code&redirect_uri=${redirectURI}&client_id=${clientID}`
		window.location.href = url
		const connected = await isConnected()
		if (connected) setLogged(true)
	}
	const btnHdl = { onMouseUp: () => !animating.current && connect() }

	// ----ANIMATIONS------------------------- //
	const btnMotion = {
		...bouncyPopUpByPx({ finalWidth: 325, finalHeight: 125 }),
		whileHover: {
			scale: 1.05,
			transition: {
				duration: 1.5,
				repeat: Infinity,
				repeatType: 'reverse',
				ease: 'linear'
			}
		}
	}

	// ----CLASSNAMES------------------------- //
	const name = 'login-btn'
	const boxName = `${name}-box`

	// ----RENDER----------------------------- //
	return <div className={boxName}>
		<motion.button
			className={name}
			{...btnHdl}
			{...btnMotion as MotionProps}>
			[42Auth]
		</motion.button>
	</div >
}

// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----ROUTER----------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [logged, setLogged] = useState(false)
	const [showHeader, setShowHeader] = useState(false)

	// ----EFFECTS---------------------------- //
	useLayoutEffect(() => {
		const checkConnection = async () => {
			if (!logged) {
				const connected = await isConnected()
				if (connected) setLogged(true)
				else navigate('/login')
			}
		}
		checkConnection()
	}, [])

	useLayoutEffect(() => {
		console.log(location.pathname)
		if (logged) {
			location.pathname !== '/' && navigate('/')
			if (location.pathname === '/login') {
				const timer = setTimeout(() => { setShowHeader(true) }, 500)
				return () => clearTimeout(timer)
			}
			else setShowHeader(true)
		}
		else if (!logged) {
			location.pathname !== '/login' && navigate('/login')
			setShowHeader(false)
		}
	}, [logged])

	useLayoutEffect(() => {
		if (logged && localStorage.getItem('inGame') === '1')
			navigate('/game')
	}, [location.pathname])

	// ----ANIMATIONS------------------------- //
	const boxMotion = bouncyYMove({ from: 100, extra: -10, inDuration: 0.8 })

	// ----CLASSNAMES------------------------- //
	const headerName = 'header'
	const headerMiddleName = `${headerName}-middleContent`

	// ----RENDER----------------------------- //
	return <>
		<AnimatePresence>
			{showHeader && <header className={headerName}>
				<NavBar setLogged={setLogged} />
				<motion.div className={headerMiddleName} {...boxMotion}>
					<AnimatePresence>
						{location.pathname !== '/chat' && <SideChat />}
					</AnimatePresence>
				</motion.div>
				<Matchmaker />
			</header>}
		</AnimatePresence>
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				<Route path='/login' element={<LoginBtn setLogged={setLogged} />} />
				<Route path='/' element={<Home />} />
				<Route path='/profile' element={<AccountInfos />} />
				<Route path='/profile/friends' element={<Friends />} />
				<Route path='/characters' element={<Characters />} />
				<Route path='/leader' element={<Leader />} />
				<Route path='/game' element={<Party />} />
				<Route path='/chat' element={<Chat />} />
				<Route path='*' element={<ErrorPage code={404} />} />
			</Routes>
		</AnimatePresence>
	</>
}
export default Root