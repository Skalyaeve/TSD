import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

function Header() {
	// Variables
	const location = useLocation();
	const [matchMakerState, setmatchMakerState] = useState("hidden");

	// Modifieurs
	const switchStat = () => {
		setmatchMakerState(matchMakerState === "searching" ? "hidden" : "searching");
	}

	const renderHomeLinks = () => (
		<>
			<a className="header__first" href="/profile">[ PROFIL ]</a>
			<a href="/leaderboard">[ LEADERBOARD ]</a>
		</>
	);
	const renderProfileLinks = () => (
		<>
			<a className="header__first header__backLink" href="/">[ BACK ]</a>
			<a href="/">[ STATS ]</a>
			<a href="/">[ CHARACTERS ]</a>
			<a href="/">[ FRIENDS ]</a>
		</>
	);
	const renderLeaderboardLinks = () => (
		<>
			<a className="header__first header__backLink" href="/">[ BACK ]</a>
		</>
	);
	const render404 = () => (
		<>
			<a className="header__first" href="/">[ HOME ]</a>
			<a href="/profile">[ PROFIL ]</a>
			<a href="/leaderboard">[ LEADERBOARD ]</a>
		</>
	);
	const renderPartyLinks = () => <></>;

	const getRenderLinks = (path: string) => {
		const renderLinksMap: { [key: string]: () => JSX.Element; } = {
			'/': renderHomeLinks,
			'/profile': renderProfileLinks,
			'/leaderboard': renderLeaderboardLinks,
			'/party': renderPartyLinks,
			'404': render404,
		};
		return renderLinksMap[path] ? renderLinksMap[path]() : renderLinksMap['404']();
	};


	const renderMatchMakerButton = () => (
		<div
			className={`matchMaker__button`}
			onClick={switchStat}
		>
			{matchMakerState === "hidden" ? (
				<div className={"matchMaker__button--off"}>[ PLAY ]</div>
			) : (
				<div className={"matchMaker__button--on"}>[ STOP ]</div>
			)}
		</div>
	);

	// Retour
	return (
		<div className="header--longer">
			<header className="header">
				{getRenderLinks(location.pathname)}
				{location.pathname !== "/party" && renderMatchMakerButton()}
			</header>

			<div className="matchMaker">
				<div className={`matchMaker__launcher ${matchMakerState === "hidden" ? "matchMaker__launcher--hidden" : ""}`}>
					00:00
				</div>
			</div>
		</div>
	);
};
export default Header;