import React, { useRef, useState, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { io } from 'socket.io-client';
import { AnimatePresence, motion } from 'framer-motion'
import { popUp, yMove } from './ftMotion.tsx'
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

// --------IS-CONNECTED---------------------------------------------------- //
const isConnected = async () => {
	if (!Cookies.get('access_token')) return false

	const servID = 'http://localhost:3000'
	const path = '/users/connected'
	try {
		const response = await fetch(`${servID}${path}`, {
			method: 'GET',
			mode: 'cors',
			credentials: 'include',
		})
		if (response.ok) {
			const txt = await response.json()
			console.log(`[SUCCESS] isConnected() -> fetch(): ${txt}`)
			return true
		}
		else console.error(
			`[ERROR] isConnected() -> fetch(): ${response.status}`
		)
	}
	catch { console.error('[ERROR] isConnected() -> fetch(): failed') }
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
	const connect = () => {
		const servID = 'http://localhost:3000'
		const path = '/auth/42/login'
		try { window.location.href = `${servID}${path}` }
		catch { console.error('[ERROR] fetch() failed') }
	}
	const btnHdl = { onMouseUp: () => !animating.current && setLogged(true) }

	// ----ANIMATIONS------------------------- //
	const selectTxtNameMotion = yMove({
		from: -30,
		inDuration: 0.5,
		outDuration: 0.5
	})
	const login42btnMotion = {
		...popUp({}),
		whileHover: { scaleX: 1.05, scaleY: 1.05 }
	}

	// ----CLASSNAMES------------------------- //
	const selectTxtName = `login-select`
	const login42btnName = `login42-btn`
	const login42btnTxTName = `${login42btnName}-txt custom-txt`

	// ----RENDER----------------------------- //
	return <>
		<motion.div className={selectTxtName} {...selectTxtNameMotion}>
			LOGIN WITH
		</motion.div>
		<motion.button className={login42btnName} {...btnHdl} {...login42btnMotion}>
			<div className={login42btnTxTName} />
		</motion.button>
	</>
}

// --------SOCKET---------------------------------------------------------- //
export const socket = io("http://localhost:3000/chat", {
	transports: ["websocket"],
	withCredentials: true,
	//   autoConnect: false,
});

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
			const connected = await isConnected()
			if (connected) setLogged(true)
			else navigate("/login")
		}
		checkConnection()
	}, [])

	useLayoutEffect(() => {
		if (logged) {
			if (location.pathname === '/login') {
				navigate('/')
				const timer = setTimeout(() => setShowHeader(true), 500)
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

	// ----CLASSNAMES------------------------- //
	const headerName = 'header'

	// ----RENDER----------------------------- //
	return <>
		<AnimatePresence>
			{showHeader && <header className={headerName}>
				<NavBar setLogged={setLogged} />
				<Chat location={location.pathname} />
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
				<Route path='*' element={<ErrorPage code={404} />} />
			</Routes>
		</AnimatePresence>
	</>
}
export default Root