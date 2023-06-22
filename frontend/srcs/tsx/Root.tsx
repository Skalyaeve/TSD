import React, { useRef, useState, useEffect, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Socket, io } from 'socket.io-client';
import Cookies from 'js-cookie';
import { AnimatePresence, motion } from 'framer-motion'
import { bouncyPopUp } from './ftMotion.tsx'
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


// --------VALUES---------------------------------------------------------- //
const hostIp: string | undefined = process.env.HOST_IP

// --------IS-CONNECTED---------------------------------------------------- //
const isConnected = async () => {
	if (!Cookies.get('access_token')) return false

	const servID = 'http://' + hostIp + ':3000'
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
		else console.log(
			`[ERROR] isConnected() -> fetch(): ${response.status}`
		)
	}
	catch { console.log('[ERROR] isConnected() -> fetch(): failed') }
	return false
}


// --------LOGIN-BTN------------------------------------------------------- //
const LoginBtn: React.FC = () => {
	// ----REFS------------------------------- //
	const animating = useRef(false)

	// ----HANDLERS--------------------------- //
	const connect = async () => {
		
		const servID = 'http://' + hostIp + ':3000'
		const path = '/auth/42/login'
		try { window.location.href = `${servID}${path}` }
		catch { console.log('[ERROR] Couldn\'t redirect to' + `${servID}${path}`) }
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
export let socket: Socket | undefined = undefined

// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {

	// ----ROUTER----------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [showHeader, setShowHeader] = useState(false)
	const [leftScore, setLeftScore] = useState(0)
	const [rightScore, setRightScore] = useState(0)

	// ----EFFECTS---------------------------- //
	const checkConnection = async () => {
		if (await isConnected()) {
			if (location.pathname == '/login') {
				navigate('/')
				const timer = setTimeout(() => setShowHeader(true), 500)
				return () => clearTimeout(timer)
			}
			else setShowHeader(true)
			if (socket == undefined) {
				try {
					socket = io('http://' + hostIp + ':3000/chat', {
						transports: ["websocket"],
						withCredentials: true,
						//   autoConnect: false,
					})
				}
				catch { console.log("[ERROR] Couldn't connect to chat gateway") }
			}
		}
		else {
			if (location.pathname != '/login') {
				try { window.location.href = '/login' }
				catch { console.log("[ERROR] Couldn't redirect to /login") }
				setShowHeader(false)
			}
			if (socket != undefined)
				socket.disconnect()
		}
	}

	useLayoutEffect(() => {
		checkConnection()
	}, [location.pathname])

	// ----CLASSNAMES------------------------- //
	const headerName = 'header'

	// ----RENDER----------------------------- //
	console.log(showHeader)
	return <>
		<AnimatePresence>
			{showHeader && <header className={headerName}>
				<NavBar />
				<Chat location={location.pathname} />
				<Matchmaker />
			</header>}
		</AnimatePresence>
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				<Route path='/login' element={<LoginBtn />} />
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