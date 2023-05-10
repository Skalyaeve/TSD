import React, { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { AnimatePresence, motion } from 'framer-motion'
import { NewBox } from "../utils.tsx"
import { bouncyComeFromCol } from "../framerMotionAnime.tsx"
import { useLocation, useNavigate } from "react-router-dom"

const ChatLink: React.FC = memo(() => {
    const navigate = useNavigate();
    const location = useLocation();

    const isInChat = useMemo(() => location.pathname.indexOf('/chat') === 0,[location])
 
	const toggleChatContent = useCallback(() => {
        navigate('/chat')
	}, [navigate])

	const mainBtnHdl = useMemo(() => ({
		onClick: toggleChatContent
	}), [toggleChatContent])

	// ----CLASSNAMES------------------------- //
	const name = 'chat'
	const bodyName = `${name}-body`
	const mainName = `${name}-main`
	const btnName = `${name}-btn`

	// ----RENDER----------------------------- //
	const bouncyComeFromColRender = useMemo(() => (
		bouncyComeFromCol(185, 20, 0.75, 1.1, 1.3)
	), [])


	return <motion.div
		key={`${name}-motion`}
		className={`${name}-motionsssss`}
		{...bouncyComeFromColRender}>
			<div>
				{isInChat && (
				<p>This is additional content that will only be displayed on the chat route.</p>
				)}
			</div>
		<div className={name}>
			<div className={`${bodyName} ${bodyName}--noResize`} >
				<AnimatePresence>
					<motion.div
						key={`${mainName}-btn-motion`}
						className={`${mainName}-btn-motion`}
						whileHover={{
							y: [0, -10, 0],
							transition: { ease: 'easeInOut', times: [0, 0.6, 1] }
						}}>
						{!isInChat && <NewBox
							tag='btn'
							className={`${mainName}-btn`}
							handlers={mainBtnHdl}
							nameIfPressed={`${btnName}--pressed`}
							content='[CHAT]'
						/>}
					</motion.div>
				</AnimatePresence>
			</div>
		</div >

	</motion.div >
})
export default ChatLink