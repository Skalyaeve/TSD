import React, { memo, useState, useMemo, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom'
import ErrorPage from './ErrorPage.tsx'
import { NewBox } from './utils.tsx'

// --------STATS----------------------------------------------------------- //
const Infos: React.FC = memo(() => {
	// ----CLASSNAMES------------------------- //
	const name = 'profile'

	// ----RENDER----------------------------- //
	return <main className={`${name}-infos main`}>
		<div className={`${name}-accountInfos`}>Infos</div>
		<div className={`${name}-achievements`}>Achievements</div>
		<div className={`${name}-stats`}>Stats</div>
		<div className={`${name}-history`}>History</div>
	</main>
})

// --------FRIENDS--------------------------------------------------------- //
const Friends: React.FC = memo(() => {
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

	const listHeadBox = (nameExt: string, content: string) => <NewBox
		tag='btn'
		className={`${colName}-${nameExt} ${colName}-head ${colName} ${btnName}`}
		nameIfPressed={btnPressedName}
		content={content}
	/>

	return <main className={`${mainName} main`}>
		<div className={`${mainName}-head`}>
			<NewBox
				tag='btn'
				className={`${inputName}-btn ${btnName}`}
				nameIfPressed={btnPressedName}
				content='[ADD]'
			/>
			<input
				className={inputName}
				id={inputName}
				name={inputName}
				placeholder=' ...'
			/>
		</div>
		<div className={listName}>
			<div className={`${listName}-head`}>
				<FriendSearch
					name={name}
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
	</main >
})
// --------FRIEND-SEARCH--------------------------------------------------- //
interface FriendSearchProps {
	name: string
	colName: string
	btnName: string
	btnPressedName: string
}
const FriendSearch: React.FC<FriendSearchProps> = memo(({
	name, colName, btnName, btnPressedName
}) => {
	// ----STATES----------------------------- //
	const [searchBtn, setSearchBtn] = useState(false)
	const [searchin, setSearchin] = useState(false)

	// ----HANDLERS--------------------------- //
	const toggleSearchBtn = useCallback(() => {
		setSearchBtn(x => !x)
	}, [searchBtn])

	const toggleSearchin = useCallback(() => {
		setSearchin(x => !x)
	}, [searchin])

	const nameBtnHdl = useMemo(() => ({
		onMouseEnter: toggleSearchBtn,
		onMouseLeave: toggleSearchBtn
	}), [toggleSearchBtn])

	const searchBtnHdl = useMemo(() => ({
		onMouseUp: toggleSearchin,
	}), [toggleSearchin])

	// ----CLASSNAMES------------------------- //
	const searchName = `${name}-friend-search`
	const inputName = `${name}-friend-search-input`

	// ----RENDER----------------------------- //
	return <NewBox
		tag='btn'
		className={`${colName}-name ${colName}-head ${colName} ${btnName}`}
		handlers={nameBtnHdl}
		content={<>
			{!searchin ?
				<NewBox
					tag='btn'
					className={searchName}
					nameIfPressed={btnPressedName}
					content='[NAME]'
				/>
				:
				<input
					className={inputName}
					id={inputName}
					name={inputName}
					placeholder=' ...'
				/>
			}
			{(searchBtn || searchin) && <NewBox
				tag='btn'
				className={`${searchName}-btn ${btnName}`}
				nameIfPressed={btnPressedName}
				handlers={searchBtnHdl}
				content={searchin ? '[X]' : '[S]'}
			/>}
		</>}
	/>
})
// --------FRIEND---------------------------------------------------------- //
interface FriendProps {
	id: number
	name: string
	colName: string
	btnName: string
	btnPressedName: string
}
const Friend: React.FC<FriendProps> = memo(({
	id, name, colName, btnName, btnPressedName
}) => {
	// ----RENDER----------------------------- //
	const friendBox = (nameExt: string, content: string) => <div
		className={`${colName}-${nameExt} ${colName}-body ${colName}`}>
		{content}
	</div>

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
})
// --------FRIEND-NAME----------------------------------------------------- //
interface FriendNameProps {
	name: string
	colName: string
	btnName: string
	btnPressedName: string
}
const FriendName: React.FC<FriendNameProps> = memo(({
	name, btnName, btnPressedName, colName
}) => {
	// ----STATES----------------------------- //
	const [delBtn, setDelBtn] = useState(false)

	// ----HANDLERS--------------------------- //
	const toggleDelBtn = useCallback(() => {
		setDelBtn(x => !x)
	}, [delBtn])

	// ----RENDER----------------------------- //
	const bodyContent = useMemo(() => <>
		<div className={`${name}-pic`}>PP</div>
		<div className={`${name}-link`}>[NAME]<br />online</div>
	</>, [])

	return <div className={`${colName}-name ${colName}-body ${colName}`}
		onMouseEnter={toggleDelBtn}
		onMouseLeave={toggleDelBtn}>
		<NewBox
			tag='btn'
			className={`${name}-name`}
			nameIfPressed={btnPressedName}
			content={bodyContent}
		/>
		{delBtn === true && <NewBox
			tag='btn'
			className={`${name}-del-btn ${btnName}`}
			nameIfPressed={btnPressedName}
			content='[X]'
		/>}
	</div>
})

// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = memo(() => {
	// ----CLASSNAMES------------------------- //
	const name = 'profile-characters'

	// ----RENDER----------------------------- //
	return <main className={`${name} main`}>
		<div className={`${name}-select`}>Character Select</div>
		<div className={`${name}-infos`}>Character Infos</div>
	</main>
})

// --------PROFILE--------------------------------------------------------- //
const Profile: React.FC = memo(() => {
	// ----RENDER----------------------------- //
	return <Routes>
		<Route path='/' element={<Infos />} />
		<Route path='/friends' element={<Friends />} />
		<Route path='/characters' element={<Characters />} />
		<Route path='*' element={<ErrorPage code={404} />} />
	</Routes>
})
export default Profile