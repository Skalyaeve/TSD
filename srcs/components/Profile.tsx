import React, { useMemo } from 'react';
import { useState } from 'react';

// declare type ContentType = 'infoContent' | 'inventoryContent' | 'historyContent';

const Profile = () => {
	const [activeContent, setActiveContent] = useState("infoContent");

	const changeDisplay = useMemo(() => (content) => () => {
		setActiveContent(content);
	}, []);

	const SubComponent = useMemo(() => {
		if (activeContent === 'infoContent') return <div id="infoContent">Infos</div>
		else if (activeContent === 'inventoryContent') return <div id="inventoryContent">Inventory</div>
		else return <div id="historyContent">History</div>
	}, [activeContent]);

	return (
		<div id="profile" data-data-name="middle-content">
			<div id="profileContentArea">
				{SubComponent}
			</div>
			<div id="profileNavArea">
				<div id="infoBar" data-data-name="profileNavBar" onClick={changeDisplay('infoContent')}>[ Infos ]</div>
				<div id="invBar" data-data-name="profileNavBar" onClick={changeDisplay('inventoryContent')}>[ Inventory ]</div>
				<div id="histBar" data-data-name="profileNavBar" onClick={changeDisplay('historyContent')}>[ History ]</div>
			</div>
		</div>
	);
};
export default Profile;