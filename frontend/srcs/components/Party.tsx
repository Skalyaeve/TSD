import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

/* -------------------------ASSETS PRELOADING------------------------- */

import skyImg from '../resources/assets/sky.png';
import mageSheet from '../resources/assets/Mage/Idle.png'
import groundImg from '../resources/assets/platform.png'

/* -------------------------SCENE CREATION------------------------- */

function setBackground(scene: Phaser.Scene, width: number, heigth: number, objectName: string) {
	const background = scene.add.image(width / 2, heigth / 2, objectName);
	const xRatio = width / background.width;
	const yRatio = heigth / background.height;
	background.setScale(xRatio, yRatio);
	return background;
}

function setPlatforms(scene: Phaser.Scene) {
	const platforms = scene.physics.add.staticGroup();
	platforms.create(1920 / 2, 1048, 'ground').setScale(5, 2).refreshBody();
	platforms.create(600, 900, 'ground');
	platforms.create(50, 800, 'ground');
	platforms.create(750, 700, 'ground');
	return platforms;
}

function setPlayer(scene: Phaser.Scene, x: number, y: number, objectName: string) {
	const player = scene.physics.add.sprite(x, y, objectName)
	player.setScale(4, 2).refreshBody();
	player.setBounce(0.2);
	player.setCollideWorldBounds(true);

	scene.anims.create({
		key: 'idle',
		frames: scene.anims.generateFrameNumbers(objectName, { start: 0, end: 7 }),
		frameRate: 8,
		repeat: -1
	});

	return player;
}

class MyScene extends Phaser.Scene {
	private player?: Phaser.Physics.Arcade.Sprite
	private background?: Phaser.GameObjects.Image
	private platforms?: Phaser.Physics.Arcade.StaticGroup
	constructor() {
		super({ key: 'MyScene' });
	}

	preload() {
		this.load.image('sky', skyImg);
		this.load.image('ground', groundImg);
		this.load.spritesheet('mage', mageSheet, { frameWidth: 250, frameHeight: 160 });
	}

	create() {
		const canvasWidth = 1920;
		const canvasHeigth = 1080;
		this.player = setPlayer(this, 100, 450, 'mage');
		this.background = setBackground(this, canvasWidth, canvasHeigth, 'sky');
		this.platforms = setPlatforms(this);
		this.physics.add.collider(this.player, this.platforms);
		this.player.play('idle');
	}
}

/* -------------------------GAME INITIALISATION------------------------- */

function Party() {
	const gameRef = useRef<HTMLDivElement>(null);
	const [game, setGame] = useState<Phaser.Game | null>(null);

	useLayoutEffect(() => {
		const config = {
			type: Phaser.AUTO,
			autoRound: false,
			width: 1920,
			height: 1080,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 2500 },
					debug: false,
				},
			},
			scene: [MyScene],
		};
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

	return <div className="party main__content" ref={gameRef}></div>
}

export default Party;
