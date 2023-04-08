import React, { useState } from 'react'

function Matchmaker() {
	// Variables
	const [matchmakerState, setMatchmakerState] = useState("hidden")

	// Modifieurs
	const switchStat = () => {
		setMatchmakerState(matchmakerState === "searching" ? "hidden" : "searching")
	}

	// Retour
	return (
		<div className="matchmaker">
			{location.pathname !== "/party" &&
				<div className="matchmaker__button" onClick={switchStat}>
					{matchmakerState === "hidden" ? (<>[ PLAY ]</>) : (<>[ STOP ] 00:00</>)}
				</div>
			}
		</div >
	)
}
export default Matchmaker
