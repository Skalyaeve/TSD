import React, { useRef, useState, useLayoutEffect, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { Socket, io } from 'socket.io-client'
import Cookies from 'js-cookie'
import { AnimatePresence, motion } from 'framer-motion'
import { popUp, xMove, yMove } from './utils/ftMotion.tsx'
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
export let inGame: boolean = false
export const setInGame = (value: boolean) => {
	inGame = value
}

// --------FT-FETCH-------------------------------------------------------- //
export const ftFetch = async (uri: string, method?: string) => {
	const servID = `http://${hostIp}:3000`
	try {
		let response = await fetch(`${servID}${uri}`, {
			method: method ? method : 'GET',
			mode: 'cors',
			credentials: 'include'
		})
		if (response.ok) {
			const answ = await response.json()
			return answ
		} else {
			console.error(`[ERROR] fetch('${servID}${uri}') failed`)
			const answ = await response.json()
			return answ
		}
	} catch (error) { console.error('[ERROR] ', error) }
}

// --------IS-CONNECTED---------------------------------------------------- //
const isConnected = async (setUserID: React.Dispatch<React.SetStateAction<number>>) => {
	if (!Cookies.get('access_token')) return false

	const servID = `http://${hostIp}:3000`
	const path = '/users/connected'
	try {
		const response = await fetch(`${servID}${path}`, {
			method: 'GET',
			mode: 'cors',
			credentials: 'include'
		})
		if (response.ok) {
			const answ = await response.json()
			setUserID(answ.id)
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
	const connect = async () => {
		const servID = 'http://' + hostIp + ':3000'
		const path = '/auth/42/login'
		try { window.location.href = `${servID}${path}` }
		catch { console.error('[ERROR] Couldn\'t redirect to' + `${servID}${path}`) }
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

// --------FRIEND-REQUESTS------------------------------------------------- //
interface FriendRequestProps {
	users: React.MutableRefObject<any>
	updateUsers: () => Promise<void>
	userID: number
}
const FriendRequest: React.FC<FriendRequestProps> = ({
	users, updateUsers, userID,
}) => {
	// ----STATES----------------------------- //
	const [friendRequestRecv, setFriendRequestRecv] = useState<any>({})

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		if (userID) checkFriendRequest()
	}, [userID, location.pathname])


	// ----HANDLERS--------------------------- //
	const checkFriendRequest = async () => {
		const data = await ftFetch(`/users/me/friends/requests/received`)
		setFriendRequestRecv(data)
	}

	// ----ANIMATIONS------------------------- //
	const requestMotion = xMove({ from: -30, inDuration: 0.3, outDuration: 0.3 })
	const btnMotion = { whileHover: { scale: 1.05 } }

	// ----CLASSNAMES------------------------- //
	const requestName = 'friend-request'

	// ----RENDER----------------------------- //
	const data: any = Object.entries(friendRequestRecv)
	if (data.length) updateUsers()

	const render = Array.from({ length: data.length }, (_, index) => {
		const requesterID: any = Object.entries(data[index][1])[0][1]
		let requesterName
		for (let x in users.current) {
			if (users.current[x].id === requesterID) {
				requesterName = users.current[x].nickname
				break
			}
		}
		return <motion.div
			key={`${requestName}-${index}`}
			className={requestName}
			{...requestMotion}>
			<div>{requesterName}<br />wants to be friend with you</div>
			<motion.button {...btnMotion}>accept</motion.button>
			<motion.button {...btnMotion}>decline</motion.button>
		</motion.div>
	})
	return <AnimatePresence>{render}</AnimatePresence>
}

// --------ROOT------------------------------------------------------------ //
type lifeType = number | 'init'
interface playerLife {
	left: lifeType
	right: lifeType
}

const Root: React.FC = () => {
	// ----REFS------------------------------- //
	const users = useRef<any>()

	// ----ROUTER----------------------------- //
	const location = useLocation()
	const navigate = useNavigate()
	const init: playerLife = { left: 'init', right: 'init' }

	// ----STATES----------------------------- //
	const [playerLife, setPlayerLife] = useState(init)
	const [userID, setUserID] = useState(0)
	const [showHeader, setShowHeader] = useState(false)
	const [selectedCharacter, setSelectedCharacter] = useState(1)

	// ----EFFECTS---------------------------- //
	useLayoutEffect(() => {
		checkConnection()
	}, [location.pathname])

	useEffect(() => {
		updateUsers()
	}, [])

	// ----HANDLERS--------------------------- //
	const checkConnection = async () => {
		if (await isConnected(setUserID)) {
			if (location.pathname === '/login') {
				navigate('/')
				const timer = setTimeout(() => setShowHeader(true), 500)
				return () => clearTimeout(timer)
			}
			else setShowHeader(true)

			if (socket === undefined) {
				try {
					socket = io('http://' + hostIp + ':3000/chat', {
						transports: ['websocket'],
						withCredentials: true,
					})
				} catch { console.error('[ERROR] Couldn\'t connect to chat gateway') }
			}
		} else {
			if (location.pathname !== '/login') {
				try { window.location.href = '/login' }
				catch { console.error('[ERROR] Couldn\'t redirect to /login') }
				setShowHeader(false)
			}
			if (socket != undefined) socket.disconnect()
		}
	}
	const updateUsers = async () => {
		const data = await ftFetch(`/users/all`)
		users.current = data
	}

	// ----CLASSNAMES------------------------- //
	const headerName = 'header'
	const requestsName = 'friend-requests'

	// ----RENDER----------------------------- //
	return <>
		<AnimatePresence>
			{showHeader && <header className={headerName}>
				<NavBar
					playerLife={playerLife}
				/>
				<Chat location={location.pathname} />
				<Matchmaker />
			</header>}
		</AnimatePresence>
		{showHeader && !inGame && <div
			key={requestsName}
			className={requestsName}>
			<FriendRequest
				users={users}
				updateUsers={updateUsers}
				userID={userID}
			/>
		</div>}
		<AnimatePresence mode='wait'>
			<Routes location={location} key={location.pathname}>
				<Route path='/login' element={<LoginBtn />} />
				<Route path='/' element={<Home
					selectedCharacter={selectedCharacter}
					setSelectedCharacter={setSelectedCharacter}
				/>} />
				<Route path='/profile/*' element={<AccountInfos
					userID={userID}
				/>} />
				<Route path='/profile/friends' element={<Friends
					userID={userID}
					users={users}
					updateUsers={updateUsers}
				/>} />
				<Route path='/characters' element={<Characters
					selectedCharacter={selectedCharacter}
					setSelectedCharacter={setSelectedCharacter}
				/>} />
				<Route path='/leader' element={<Leader
					userID={userID}
					users={users}
					updateUsers={updateUsers}
				/>} />
				<Route path='/game' element={
					<Party
						setPlayerLife={setPlayerLife}
					/>}
				/>
				<Route path='*' element={<ErrorPage code={404} />} />
			</Routes>
		</AnimatePresence>
	</>
}
export default Root