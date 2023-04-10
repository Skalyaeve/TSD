import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';

function Party() {
	// Variables
	const config = {
		type: Phaser.AUTO,
		width: 800,
		height: 600,
		scene: {
			preload: preload,
			create: create,
		},
	};
	const gameRef = useRef(null);
	let game: Phaser.Game | null = null;

	// Modifieurs
	function preload(this: Phaser.Scene) {
	}
	function create(this: Phaser.Scene) {
	}

	useEffect(() => {
		if (gameRef.current) {
			game = new Phaser.Game({ ...config, parent: gameRef.current });
		}
		return () => {
			if (game) {
				game.destroy(true);
			}
		};
	}, []);

	// Retour
	return (
		<main className="party main__content">
			<div ref={gameRef}></div>
		</main>
	);
}
export default Party;