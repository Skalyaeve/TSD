
import React, { useRef, useState, useLayoutEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { bouncyPopUp } from '../tsx-utils/ftMotion.tsx'
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
import { Socket, io } from 'socket.io-client';


// --------IS-CONNECTED---------------------------------------------------- //
const isConnected = async () => {
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

const LoginBtn: React.FC = () => {
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

export let socket: Socket | undefined = undefined

// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----ROUTER----------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [showHeader, setShowHeader] = useState(false)

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
				socket = io("http://localhost:3000/chat", {
					transports: ["websocket"],
					withCredentials: true,
					//   autoConnect: false,
				});
			}
		}
		else {
			if (location.pathname != '/login') {
				window.location.href = '/login'
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
	return <>
		<AnimatePresence>
			{showHeader && <header className={headerName}>
				<NavBar />
				<Chat />
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