import React, { useMemo, useCallback, useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

import { FtBtn, FtDiv, FtInput } from '../tsx-utils/ftSam/ftBox.tsx'
import { tglOnOver, tglOnUp } from '../tsx-utils/ftSam/ftHooks.tsx'
import ErrorPage from './ErrorPage.tsx'

// --------INFOS----------------------------------------------------------- //
const Infos: React.FC = () => {
	// ----CLASSNAMES------------------------- //
	const name = 'profile'
	const accountInfosName = `${name}-accountInfos`
	const achievementName = `${name}-achievements`
	const statsName = `${name}-stats`
	const historyName = `${name}-history`

	// ----RENDER----------------------------- //
	return <motion.div
		key={`${name}-infos main`}
		className={`${name}-infos main`}
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	>
		<div className={accountInfosName}>
			<AccountInfos className={accountInfosName} />
		</div>
		<div className={achievementName}>
			<Achievements name={achievementName} />
		</div>
		<div className={statsName}>
			0 MATCHES - 0 WINS - 0 LOSES<br />RATIO: 0% - SCORED: 0
		</div>
		<div className={historyName}>
			<History name={historyName} />
		</div>
	</motion.div>
}

// --------ACCOUNT-INFOS---------------------------------    ------------------ //
interface AccountInfosProps {
	className: string
}
const AccountInfos: React.FC<AccountInfosProps> = ({ className }) => {
	// ----RENDER----------------------------- //
	return <>
		<div className={className + '-pic'}>
			<ProfilePicture />
		</div >
	</>
}

// --------PP-------------------------------------------------------------- //
const ProfilePicture: React.FC = () => {
	// ----STATES----------------------------- //
	const [profilePicture, setProfilePicture] = useState<string>('')
	const [loading, setLoading] = useState<boolean>(true)

	// ----EFFECTS---------------------------- //
	useEffect(() => {
		const blobToBase64 = (blob: Blob): Promise<string> => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader()
				reader.onerror = reject
				reader.onload = () => resolve(reader.result as string)
				reader.readAsDataURL(blob)
			})
		}

		const fetchData = async () => {
			try {
				const userId = 'users/0'
				const response = await fetch(`http://10.11.12.2:3000/${userId}`)
				if (response.ok) {
					// const blob = await response.blob()
					// const base64Image = await blobToBase64(blob)
					const txt = await response.text()
					setProfilePicture(txt)
					setLoading(false)
				} else {
					console.error(`[ERROR] fetch('http://10.11.12.2:3000/${userId}') failed`)
					setLoading(false)
				}
			} catch (error) {
				console.error('[ERROR] ', error)
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	// ----RENDER----------------------------- //
	return <>
		{loading ?
			<>Chargement en cours...</>
			:
			<>{profilePicture}</>
		}
	</>
}

// --------ACHIEVEMENTS---------------------------------------------------- //
interface AchievementsProps {
	name: string
}
const Achievements: React.FC<AchievementsProps> = ({ name }) => {
	// ----STATES----------------------------- //
	const [count, setCount] = useState(18)

	// ----RENDER----------------------------- //
	const render = useMemo(() => Array.from({ length: count }, (_, index) => (
		<Achievement key={index + 1} id={index + 1} name='profile-achievement' />
	)), [count])

	return <>
		<div className={`${name}-count`}>
			ACHIEVEMENTS
		</div>
		<div className={`${name}-list`}>
			{render}
		</div>
	</>
}

// --------ACHIEVEMENT----------------------------------------------------- //
interface AchievementProps {
	id: number
	name: string
}
const Achievement: React.FC<AchievementProps> = ({ id, name }) => {
	// ----STATES----------------------------- //
	const [tooltip, setTooltip] = useState(false)
	const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })

	// ----HANDLERS--------------------------- //
	const toggleTooltip = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		if (event.type === 'mouseenter') {
			const rect = event.currentTarget.getBoundingClientRect()
			setTooltipPos({
				top: window.scrollY + rect.top - 205,
				left: window.scrollX + rect.left,
			})
			setTooltip(true)
		} else if (event.type === 'mouseleave') setTooltip(false)
	}, [tooltip])

	const unitHdl = useMemo(() => ({
		onMouseEnter: toggleTooltip,
		onMouseLeave: toggleTooltip,
	}), [toggleTooltip])

	// ----RENDER----------------------------- //
	return <>
		<FtDiv className={name}
			handler={unitHdl}
			content='UNIT'
		/>
		{tooltip && <div className={`${name}-tooltip`}
			style={{ top: tooltipPos.top, left: tooltipPos.left }}>
			TOOLTIP
		</div>}
	</>
}

// --------HISTORY--------------------------------------------------------- //
interface HistoryProps {
	name: string
}
const History: React.FC<HistoryProps> = ({ name }) => {
	// ----STATES----------------------------- //
	const [count, setCount] = useState(20)

	// ----RENDER----------------------------- //
	const render = useMemo(() => Array.from({ length: count }, (_, index) => (
		<Match key={index + 1} id={index + 1} name={name} />
	)), [count])

	return <>{render}</>
}

// --------MATCH----------------------------------------------------------- //
interface MatchProps {
	id: number
	name: string
}
const Match: React.FC<MatchProps> = ({ id, name }) => {
	// ----RENDER----------------------------- //
	return <div className={`${name}-match`}>
		MATCH #{id}
	</div>
}

// --------FRIENDS--------------------------------------------------------- //
const Friends: React.FC = () => {
	// ----STATES----------------------------- //
	const [friendsCount, setFriendsCount] = useState(20)

	// ----CLASSNAMES------------------------- //
	const name = 'profile'
	const mainName = `${name}-friends`
	const inputName = `${mainName}-add-input`
	const listName = `${mainName}-list`
	const colName = `${mainName}-col`
	const btnName = `${name}-btn`
	const btnPressedName = `${btnName}--pressed`

	// ----RENDER----------------------------- //
	const renderFriends = useMemo(() => Array.from({ length: friendsCount }, (_, index) => (
		<Friend
			key={index + 1}
			id={index + 1}
			name={`${name}-friend`}
			colName={colName}
			btnName={btnName}
			btnPressedName={btnPressedName}
		/>
	)), [friendsCount])

	const listHeadBox = useMemo(() => (nameExt: string, content: string) => (
		<FtBtn className={`${colName}-${nameExt} ${colName}-head ${colName} ${btnName}`}
			pressedName={btnPressedName}
			content={content}
		/>
	), [])

	return <motion.main className={`${mainName} main`}
		initial={{ opacity: 0 }}
		animate={{ opacity: 1 }}
		exit={{ opacity: 0 }}
	>
		<div className={`${mainName}-head`}>
			<FtBtn className={`${inputName}-btn ${btnName}`}
				pressedName={btnPressedName}
				content='[ADD]'
			/>
			<FtInput name={inputName} />
		</div>
		<div className={listName}>
			<div className={`${listName}-head`}>
				<FriendSearch name={name}
					colName={colName}
					btnName={btnName}
					btnPressedName={btnPressedName}
				/>
				{listHeadBox('matches', '[MATCHES]')}
				{listHeadBox('wins', '[WINS]')}
				{listHeadBox('loses', '[LOSES]')}
				{listHeadBox('ratio', '[RATIO]')}
				{listHeadBox('scored', '[SCORED]')}
			</div>
			<div className={`${listName}-body`}>
				{renderFriends}
			</div>
		</div>
	</motion.main >
}

// --------FRIEND-SEARCH--------------------------------------------------- //
interface FriendSearchProps {
	name: string
	colName: string
	btnName: string
	btnPressedName: string
}
const FriendSearch: React.FC<FriendSearchProps> = ({
	name, colName, btnName, btnPressedName
}) => {
	// ----STATES----------------------------- //
	const [searchBtn, toggleSearchBtn] = tglOnOver(false)
	const [searchin, toggleSearchin] = tglOnUp(false)

	// ----CLASSNAMES------------------------- //
	const searchName = `${name}-friend-search`
	const inputName = `${name}-friend-search-input`

	// ----RENDER----------------------------- //
	const childBtnContent = useMemo(() => (!searchin ?
		<FtDiv className={searchName}
			pressedName={btnPressedName}
			content='[NAME]'
		/>
		:
		<FtInput name={inputName} />
	), [searchin])

	const boxContent = useMemo(() => <>
		{childBtnContent}
		{(searchBtn || searchin) && <FtDiv className={`${searchName}-btn ${btnName}`}
			pressedName={btnPressedName}
			handler={toggleSearchin}
			content={searchin ? '[X]' : '[S]'}
		/>}
	</>, [childBtnContent, searchBtn, searchin])

	return <FtDiv className={`${colName}-name ${colName}-head ${colName} ${btnName}`}
		handler={toggleSearchBtn}
		content={boxContent}
	/>
}

// --------FRIEND---------------------------------------------------------- //
interface FriendProps {
	id: number
	name: string
	colName: string
	btnName: string
	btnPressedName: string
}
const Friend: React.FC<FriendProps> = ({
	id, name, colName, btnName, btnPressedName
}) => {
	// ----RENDER----------------------------- //
	const friendBox = useMemo(() => (nameExt: string, content: string) => <div
		className={`${colName}-${nameExt} ${colName}-body ${colName}`}>
		{content}
	</div>, [])

	return <div className={name}>
		<FriendName
			name={name}
			colName={colName}
			btnName={btnName}
			btnPressedName={btnPressedName}
		/>
		{friendBox('matches', '0')}
		{friendBox('wins', '0')}
		{friendBox('loses', '0')}
		{friendBox('ratio', '0')}
		{friendBox('scored', '0')}
	</div>
}

// --------FRIEND-NAME----------------------------------------------------- //
interface FriendNameProps {
	name: string
	colName: string
	btnName: string
	btnPressedName: string
}
const FriendName: React.FC<FriendNameProps> = ({
	name, btnName, btnPressedName, colName
}) => {
	// ----STATES----------------------------- //
	const [delBtn, toggleDelBtn] = tglOnOver(false)

	// ----RENDER----------------------------- //
	const btnContent = useMemo(() => <>
		<div className={`${name}-pic`}>PP</div>
		<div className={`${name}-link`}>[NAME]<br />online</div>
	</>, [])

	const boxContent = useMemo(() => <>
		<FtBtn className={`${name}-name`}
			pressedName={btnPressedName}
			content={btnContent}
		/>
		{delBtn === true && <FtBtn className={`${name}-del-btn ${btnName}`}
			pressedName={btnPressedName}
			content='[X]'
		/>}
	</>, [delBtn])

	return <FtDiv className={`${colName}-name ${colName}-body ${colName}`}
		handler={toggleDelBtn}
		content={boxContent}
	/>
}

// --------PROFILE--------------------------------------------------------- //
const Profile: React.FC = () => {
	// ----LOCATION--------------------------- //
	const location = useLocation()

	// ----RENDER----------------------------- //
	return <AnimatePresence mode='wait'>
		<Routes location={location} key={location.pathname}>
			<Route path='/' element={<Infos />} />
			<Route path='/friends' element={<Friends />} />
			<Route path='*' element={<ErrorPage code={404} />} />
		</Routes>
	</AnimatePresence>
}
export default Profile