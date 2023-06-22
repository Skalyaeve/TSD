import React, { useRef, useState, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Socket, io } from 'socket.io-client'
import Cookies from 'js-cookie'
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

// --------VALUES---------------------------------------------------------- //
const hostIp: string | undefined = process.env.HOST_IP

export let socket: Socket | undefined = undefined

// --------IS-CONNECTED---------------------------------------------------- //
const isConnected = async () => {
	return true
	if (!Cookies.get('access_token')) return false

	const servID = 'http://' + hostIp + ':3000'
	const path = '/users/connected'
	try {
		const response = await fetch(`${servID}${path}`, {
			method: 'GET',
			mode: 'cors',
			credentials: 'include'
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
	const login42btnHdl = { onMouseUp: () => !animating.current && connect() }

	// ----ANIMATIONS------------------------- //
	const loginSelectMotion = yMove({ from: -30 })
	const login42btnMotion = {
		...popUp({}),
		whileHover: {
			scaleX: 1.1,
			scaleY: 1.1
		}
	}

	// ----CLASSNAMES------------------------- //
	const loginSelectName = `login-select`
	const login42btnName = `login-btn`

	// ----RENDER----------------------------- //
	return <>
		<motion.div className={loginSelectName} {...loginSelectMotion}>
			login with
		</motion.div>
		<motion.button
			className={login42btnName}
			{...login42btnHdl}
			{...login42btnMotion}
		/>
	</>
}

// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----ROUTER----------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----REFS------------------------------- //
	const selectedCharacter = useRef(1)

	// ----STATES----------------------------- //
	const [showHeader, setShowHeader] = useState(false)

	// ----EFFECTS---------------------------- //
	useLayoutEffect(() => {
		checkConnection()
	}, [location.pathname])

	// ----HANDLERS--------------------------- //
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
						transports: ['websocket'],
						withCredentials: true,
						//   autoConnect: false,
					})
				} catch { console.log('[ERROR] Couldn\'t connect to chat gateway') }
			}
		} else {
			if (location.pathname != '/login') {
				try { window.location.href = '/login' }
				catch { console.log('[ERROR] Couldn\'t redirect to /login') }
				setShowHeader(false)
			}
			if (socket != undefined) socket.disconnect()
		}
	}

	// ----CLASSNAMES------------------------- //
	const headerName = 'header'

	// ----RENDER----------------------------- //
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
				<Route path='/' element={<Home selectedCharacter={selectedCharacter.current} />} />
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