import React, { useState } from "react";

// Types
type ContentType = "infos" | "inventory" | "history";

function Profile() {
	// Variables
	const [activeContent, setActiveContent] = useState<ContentType>("infos");

	const contentMap: Record<ContentType, JSX.Element> = {
		infos: <div className="profile__content__infos">

			Infos

		</div>,

		inventory: <div className="profile__content__inv">

			Inventory

		</div>,

		history: <div className="profile__content__hist">

			History

		</div>
	};

	// Modifieurs
	const changeDisplay = (content: ContentType) => {
		setActiveContent(content);
	};

	// Retour
	return (
		<main className="profile main__content">

			<div className="profile__content">
				{contentMap[activeContent]}
			</div>

			<nav className="profile__navBar">
				<div className="profile__navBar__infos" onClick={() => changeDisplay("infos")}>
					[ infos ]
				</div>
				<div className="profile__navBar__inv" onClick={() => changeDisplay("inventory")}>
					[ inventory ]
				</div>
				<div className="profile__navBar__hist" onClick={() => changeDisplay("history")}>
					[ history ]
				</div>
			</nav>

		</main>
	);
}
export default Profile;