import React, { memo, useMemo, useCallback, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { NewBox, Input, toggleOnOver, toggleOnUp } from './utils.tsx'
import ErrorPage from './ErrorPage.tsx'

// --------INFOS----------------------------------------------------------- //
const Infos: React.FC = memo(() => {
	// ----CLASSNAMES------------------------- //
	const name = 'profile'
	const accountInfosName = `${name}-accountInfos`
	const achievementName = `${name}-achievements`
	const statsName = `${name}-stats`
	const historyName = `${name}-history`

	// ----RENDER----------------------------- //
	return <main className={`${name}-infos main`}>
		<div className={accountInfosName}>
			<AccountInfos name={accountInfosName} />
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
	</main>
})
// --------ACCOUNT-INFOS--------------------------------------------------- //
interface AccountInfosProps {
	name: string
}
const AccountInfos: React.FC<AccountInfosProps> = memo(({ name }) => {
	return <>
		<div className={`${name}-pic`}>PP</div>
	</>
})
// --------ACHIEVEMENTS---------------------------------------------------- //
interface AchievementsProps {
	name: string
}
const Achievements: React.FC<AchievementsProps> = memo(({ name }) => {
	// ----STATES----------------------------- //
	const [count, setCount] = useState(18)

	// ----RENDER----------------------------- //
	const render = useMemo(() => Array.from({ length: count }, (_, index) => (
		<Achievement key={index + 1} id={index + 1} name='profile-achievement' />
	)), [count])

	return <>
		<div className={`${name}-count`}>
			Achievements
		</div>
		<div className={`${name}-list`}>
			{render}
		</div>
	</>
})
// --------ACHIEVEMENT----------------------------------------------------- //
interface AchievementProps {
	id: number
	name: string
}
const Achievement: React.FC<AchievementProps> = memo(({ id, name }) => {
	// ----STATES----------------------------- //
	const [tooltip, setTooltip] = useState(false)
	const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 })

	// ----HANDLERS--------------------------- //
	const toggleTooltip = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
		if (event.type === 'mouseenter') {
			const rect = event.currentTarget.getBoundingClientRect();
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
		<NewBox
			tag='div'
			className={name}
			handlers={unitHdl}
			content='UNIT'
		/>
		{tooltip && <div className={`${name}-tooltip`}
			style={{ top: tooltipPos.top, left: tooltipPos.left }}>
			TOOLTIP
		</div>}
	</>
})
// --------HISTORY--------------------------------------------------------- //
interface HistoryProps {
	name: string
}
const History: React.FC<HistoryProps> = memo(({ name }) => {
	// ----STATES----------------------------- //
	const [count, setCount] = useState(20)

	// ----RENDER----------------------------- //
	const render = useMemo(() => Array.from({ length: count }, (_, index) => (
		<Match key={index + 1} id={index + 1} name={name} />
	)), [count])

	return <>{render}</>
})
// --------MATCH----------------------------------------------------------- //
interface MatchProps {
	id: number
	name: string
}
const Match: React.FC<MatchProps> = memo(({ id, name }) => {
	// ----RENDER----------------------------- //
	return <div className={`${name}-match`}>
		Match #{id}
	</div>
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

	const listHeadBox = useMemo(() => (nameExt: string, content: string) => <NewBox
		tag='btn'
		className={`${colName}-${nameExt} ${colName}-head ${colName} ${btnName}`}
		nameIfPressed={btnPressedName}
		content={content}
	/>, [])

	return <main className={`${mainName} main`}>
		<div className={`${mainName}-head`}>
			<NewBox
				tag='btn'
				className={`${inputName}-btn ${btnName}`}
				nameIfPressed={btnPressedName}
				content='[ADD]'
			/>
			<Input name={inputName} />
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
	const [searchBtn, toggleSearchBtn] = toggleOnOver(false)
	const [searchin, toggleSearchin] = toggleOnUp(false)

	// ----CLASSNAMES------------------------- //
	const searchName = `${name}-friend-search`
	const inputName = `${name}-friend-search-input`

	// ----RENDER----------------------------- //
	const childBtnContent = useMemo(() => (!searchin ?
		<NewBox
			tag='div'
			className={searchName}
			nameIfPressed={btnPressedName}
			content='[NAME]'
		/>
		:
		<Input name={inputName} />
	), [searchin])

	const boxContent = useMemo(() => <>
		{childBtnContent}
		{(searchBtn || searchin) && <NewBox
			tag='div'
			className={`${searchName}-btn ${btnName}`}
			nameIfPressed={btnPressedName}
			handlers={toggleSearchin}
			content={searchin ? '[X]' : '[S]'}
		/>}
	</>, [childBtnContent, searchBtn, searchin])

	return <NewBox
		tag='div'
		className={`${colName}-name ${colName}-head ${colName} ${btnName}`}
		handlers={toggleSearchBtn}
		content={boxContent}
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
	const [delBtn, toggleDelBtn] = toggleOnOver(false)

	// ----RENDER----------------------------- //
	const btnContent = useMemo(() => <>
		<div className={`${name}-pic`}>PP</div>
		<div className={`${name}-link`}>[NAME]<br />online</div>
	</>, [])

	const boxContent = useMemo(() => <>
		<NewBox
			tag='btn'
			className={`${name}-name`}
			nameIfPressed={btnPressedName}
			content={btnContent}
		/>
		{delBtn === true && <NewBox
			tag='btn'
			className={`${name}-del-btn ${btnName}`}
			nameIfPressed={btnPressedName}
			content='[X]'
		/>}
	</>, [delBtn])

	return <NewBox
		tag='div'
		className={`${colName}-name ${colName}-body ${colName}`}
		handlers={toggleDelBtn}
		content={boxContent}
	/>
})


// --------CHARACTERS------------------------------------------------------ //
const Characters: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [totalCharacters, setTotalCharacters] = useState(9)

	// ----CLASSNAMES------------------------- //
	const name = 'profile'
	const boxName = `${name}-characters`

	// ----RENDER----------------------------- //
	const renderFriends = useMemo(() => Array.from({ length: totalCharacters }, (_, index) => (
		<CharBox key={index + 1} id={index + 1} name={name} />
	)), [totalCharacters])

	return <main className={`${boxName} main`}>
		<div className={`${boxName}-select`}>
			{renderFriends}
		</div>
		<Character name={name} />
	</main>
})
// --------CHARACTER-BOX--------------------------------------------------- //
interface CharBoxProps {
	id: number
	name: string
}
const CharBox: React.FC<CharBoxProps> = memo(({ id, name }) => {
	// ----RENDER----------------------------- //
	return <NewBox
		tag='btn'
		className={`${name}-characterBox`}
		nameIfPressed={`${name}-btn--pressed`}
		content={`[Character ${id}]`}
	/>
})
// --------CHARACTER------------------------------------------------------- //
interface CharacterProps {
	name: string
}
const Character: React.FC<CharacterProps> = memo(({ name }) => {
	// ----CLASSNAMES------------------------- //
	const boxName = `${name}-character`
	const spellName = `${boxName}-spell`

	// ----RENDER----------------------------- //
	return <div className={boxName}>
		<div className={`${boxName}-skin`}>SKIN</div>
		<div className={`${boxName}-infos`}>
			<div className={`${boxName}-stats`}>STATS</div>
			<div className={`${boxName}-story`}>STORY</div>
			<div className={`${spellName}s`}>
				<Spell spellName={spellName} nameExt='A' content='ACTIVE' />
				<Spell spellName={spellName} nameExt='B' content='PASSIVE' />
			</div>
		</div>
	</div>
})
// --------SPELL----------------------------------------------------------- //
interface SpellProps {
	spellName: string
	nameExt: string
	content: string
}
const Spell: React.FC<SpellProps> = memo(({ spellName, nameExt, content }) => {
	// ----STATES----------------------------- //
	const [tooltip, toggleTooltip] = toggleOnOver(false)

	// ----CLASSNAMES------------------------- //
	const boxName = `${spellName}-box`

	// ----RENDER----------------------------- //
	return <div className={`${boxName}-${nameExt} ${boxName}`}>
		<NewBox
			tag='div'
			className={`${spellName}-${nameExt} ${spellName}`}
			handlers={toggleTooltip}
			content={content}
		/>
		{tooltip && <div className={`${spellName}-tooltip`}>
			TOOLTIP
		</div>}
	</div>
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