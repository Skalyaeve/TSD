import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import skyImg from '../resources/assets/sky.png';
import mageSheet from '../resources/assets/Mage/Idle.png'

function Party() {
	const gameRef = useRef<HTMLDivElement>(null);
	const [game, setGame] = useState<Phaser.Game | null>(null);

	useLayoutEffect(() => {
		const config = {
			type: Phaser.AUTO,
			autoRound: false,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 300 },
					debug: false,
				},
			},
			scene: {
				preload: preload,
				create: create,
			},
		};
		function preload(this: Phaser.Scene) {
			this.load.image('sky', skyImg);
			this.load.spritesheet('mage', mageSheet, { frameWidth: 250, frameHeight: 250 });
		}

		function create(this: Phaser.Scene) {
			if (gameRef.current) {
				const gameRect = gameRef.current.getBoundingClientRect();
				const background = this.add.image(600, 400, 'sky');
				console.log("yrect: ", gameRect.height, " xrect: ", gameRect.width);
				console.log("yback: ", background.height, " xback: ", background.width);
				const yRatio = gameRect.height / background.height;
				const xRatio = gameRect.width / background.width;
				console.log("yratio: ", yRatio, " xratio: ", xRatio);
				background.setScale(xRatio, yRatio);
				console.log("y: ", background.displayHeight, " x: ", background.displayWidth);
			}
		}

		if (gameRef.current) {
			const newGame = new Phaser.Game({ ...config, parent: gameRef.current, });
			setGame(newGame);
		}

		return () => {
			if (game) {
				game.destroy(true);
			}
		};
	}, []);

	return (
		<div className="party main__content" ref={gameRef}>
		</div>
	);
}

export default Party;
