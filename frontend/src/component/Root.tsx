import React, { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { NewBox, useToggle } from './utils.tsx'
import NavBar from './NavBar.tsx'
import Chat from './Chat.tsx'
import Matchmaker from './Matchmaker.tsx'
import Home from './Home.tsx'
import Profile from './Profile.tsx'
import Characters from './Characters.tsx'
import Party from './Game.tsx'
import Leader from './Leader.tsx'
import ErrorPage from './ErrorPage.tsx'

// --------LOGIN-BTN------------------------------------------------------- //
interface LoginButtonProps {
	setLoginBtn: React.Dispatch<React.SetStateAction<boolean>>
	setLogged: React.Dispatch<React.SetStateAction<boolean>>
}
const LoginButton: React.FC<LoginButtonProps> = memo(({ setLoginBtn, setLogged }) => {
	// ----VALUES----------------------------- //
	const transitionTime = 300

	// ----REFS------------------------------- //
	const loginBtnRef = useRef(null)

	// ----STATES----------------------------- //
	const [transition, tglTransition] = useToggle(false)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const timer = setTimeout(() => tglTransition(), 150)
		return () => clearTimeout(timer)
	}, [])

	// ----HANDLERS--------------------------- //
	const login = useCallback(() => {
		tglTransition()
		setTimeout(() => {
			setLoginBtn(false)
			setLogged(true)
		}, transitionTime)
	}, [])

	// ----HANDLERS--------------------------- //
	const loginBtnHdl = useMemo(() => ({
		onMouseUp: login
	}), [])

	// ----CLASSNAMES------------------------- //
	const name = 'login-btn'

	// ----RENDER----------------------------- //
	return <CSSTransition
		nodeRef={loginBtnRef}
		in={transition}
		timeout={transitionTime}
		classNames='opacity'
	>
		<NewBox
			tag='btn'
			className={name}
			nameIfPressed={`${name}--pressed`}
			handlers={loginBtnHdl}
			ref={loginBtnRef}
			content='[42Auth]'
		/>
	</CSSTransition>
})


// --------ROOT------------------------------------------------------------ //
const Root: React.FC = () => {
	// ----LOCATION--------------------------- //
	const location = useLocation()
	const navigate = useNavigate()

	// ----STATES----------------------------- //
	const [logged, setLogged] = useState(localStorage.getItem('logged') === '1')
	const [loginBtn, setLoginBtn] = useState(logged ? false : true)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		localStorage.setItem('logged', logged ? '1' : '0')
	}, [logged])

	useEffect(() => {
		if (logged && localStorage.getItem('inGame') === '1')
			navigate('/game')
	}, [location.pathname])

	// ----HANDLERS--------------------------- //
	const logout = useCallback(() => {
		setLogged(false)
		setLoginBtn(true)
	}, [])

	const logoutBtnHdl = useMemo(() => ({
		onMouseUp: logout
	}), [])

	// ----RENDER----------------------------- //
	return <>
		{loginBtn && <LoginButton
			setLoginBtn={setLoginBtn}
			setLogged={setLogged}
		/>}
		{logged && <>
			<header className='header'>
				<NavBar logoutBtnHdl={logoutBtnHdl} />
				<Chat />
				<Matchmaker />
			</header>

			<Routes>
				<Route path='/' element={<Home />} index />
				<Route path='/profile/*' element={<Profile />} />
				<Route path='/characters' element={<Characters />} />
				<Route path='/leader' element={<Leader />} />
				<Route path='/game' element={<Party />} />
				<Route path='*' element={<ErrorPage code={404} />} />
			</Routes>
		</>}
	</>
}
export default Root