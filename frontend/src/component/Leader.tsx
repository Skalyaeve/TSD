import React, { memo, useState, useMemo } from 'react'
import { NewBox } from './utils.tsx'

// --------USER------------------------------------------------------------ //
interface UserStatsProps {
	id: number
}
const UserStats: React.FC<UserStatsProps> = memo(({ id }) => {
	// ----CLASSNAMES------------------------- //
	const name = 'leader-usr'

	// ----RENDER----------------------------- //
	return <div className={name}>
		User #{id}
	</div>
})

// --------BOARD----------------------------------------------------------- //
const Board: React.FC = memo(() => {
	// ----STATES----------------------------- //
	const [userCount, setUserCount] = useState(20)

	// ----CLASSNAMES------------------------- //
	const name = 'leader-body'

	// ----RENDER----------------------------- //
	const renderBoxes = useMemo(() => Array.from({ length: userCount }, (_, index) => (
		<UserStats key={index + 1} id={index + 1} />
	)), [userCount])

	return <div className={name}>
		<div className='leader-boardHead'>
			HEAD
		</div>
		{renderBoxes}
	</div >
})

// --------LEADER---------------------------------------------------------- //
const Leader: React.FC = memo(() => {
	// ----CLASSNAMES------------------------- //
	const name = 'leader'
	const inputName = `${name}-input`
	const inputBtnName = `${inputName}-btn`

	// ----RENDER----------------------------- //
	return <main className={`${name} main`}>
		<div className={`${name}-head`}>
			<input
				className={inputName}
				id={inputName}
				name={inputName}
				placeholder=' ...'
			/>
			<NewBox
				tag='btn'
				className={inputBtnName}
				nameIfPressed={`${name}-btn--pressed`}
				content='[OK]'
			/>
		</div>
		<Board />
	</main >
})
export default Leader