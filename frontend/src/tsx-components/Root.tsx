import { useMemo } from 'react';
import React, { useRef, useState, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Cookies from 'js-cookie';
import { AnimatePresence, motion } from 'framer-motion'
import { bouncyPopUp, bouncyYMove } from '../tsx-utils/ftMotion.tsx'
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
import background from '../resource/background.png';
import { io } from 'socket.io-client';
import Modal from 'react-modal';


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
		window.location.href = `${servID}${path}`
	}

	const btnHdl = { onMouseUp: () => !animating.current && connect() }

	// ----ANIMATIONS------------------------- //
	const btnMotion = bouncyPopUp({})

	// ----CLASSNAMES------------------------- //
	const boxName = `login-btn`
	const txtName = `${boxName}-txt custom-txt`

	// ----RENDER----------------------------- //
	return <motion.button className={boxName} {...btnHdl} {...btnMotion}>
		<div className={txtName} />
	</motion.button>
}

// ----SOCKET----------------------------- //

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
			if (location.pathname !== '/login') navigate('/login')
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
				<Chat />
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