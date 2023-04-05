import React from 'react';
import { useState } from 'react';

const Profile = () => {
	const [activeContent, setActiveContent] = useState("infoContent");
	const displayInfo = () => {
		setActiveContent("infoContent");
	};
	const displayInventory = () => {
		setActiveContent("inventoryContent");
	};
	const displayHistory = () => {
		setActiveContent("historyContent");
	};
	return (
		<div id="profile" name="middle-content">
			<div id="profileContentArea">
				{activeContent === 'infoContent' && (
					<div id="infoContent">Infos</div>
				)}
				{activeContent === 'inventoryContent' && (
					<div id="inventoryContent">Inventory</div>
				)}
				{activeContent === 'historyContent' && (
					<div id="historyContent">History</div>
				)}
			</div>
			<div id="profileNavArea">
				<div id="infoBar" name="profileNavBar" onClick={displayInfo}>[ Infos ]</div>
				<div id="invBar" name="profileNavBar" onClick={displayInventory}>[ Inventory ]</div>
				<div id="histBar" name="profileNavBar" onClick={displayHistory}>[ History ]</div>
			</div>
		</div>
	);
};
export default Profile;