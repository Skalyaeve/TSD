import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Phaser from 'phaser';

/* -------------------------ASSETS IMPORT------------------------- */

import sky__Img from '../resources/assets/sky.png';
import ground__Img from '../resources/assets/platform.png'
import mageIdle__Sheet from '../resources/assets/Mage/Idle.png'
import mageRun__Sheet from '../resources/assets/Mage/Run.png'

/* -------------------------SCENE CLASS------------------------- */

class MyScene extends Phaser.Scene {

	/****** VARIABLES & CONSTRUCTION ******/

	private background?: Phaser.GameObjects.Image
	private platforms?: Phaser.Physics.Arcade.StaticGroup
	private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
	private players: Phaser.Physics.Arcade.Sprite[] = []
	private moveStates: string[] = ['', '']
	private directions: string[] = ['right', 'left']
	private keyCodesP1: Phaser.Input.Keyboard.Key[] = []
	private keyCodesP2: Phaser.Input.Keyboard.Key[] = []

	constructor() {
		super({ key: 'MyScene' });
	}

	/****** CUSTOM MEMBER FUNCTIONS ******/

	// Set background for this scene
	setBackground(this: MyScene, objectName: string) {
		const background = this.add.image(1920 / 2, 1080 / 2, objectName);
		const xRatio = 1920 / background.width;
		const yRatio = 1080 / background.height;
		background.setScale(xRatio, yRatio);
		return background;
	}

	// Set plaforms for this scene
	setPlatforms(this: MyScene) {
		this.platforms = this.physics.add.staticGroup();
		this.platforms.create(1920 / 2, 1048, 'ground').setScale(5, 2).refreshBody();
	}

	// Create animation for this scene
	createAnims(this: MyScene) {
		this.anims.create({
			key: 'mageIdleAnim',
			frames: this.anims.generateFrameNumbers('mageIdle', { start: 0, end: 7 }),
			frameRate: 8,
			repeat: -1
		});

		this.anims.create({
			key: 'mageRunAnim',
			frames: this.anims.generateFrameNumbers('mageRun', { start: 0, end: 7 }),
			frameRate: 10,
			repeat: -1
		});
	}

	// Create player(s) for this scene
	setPlayers(this: MyScene, characterP1: string, characterP2: string) {
		this.players = [
			this.physics.add.sprite(100, 450, characterP1),
			this.physics.add.sprite(500, 450, characterP2)
		];
		this.players[0].setScale(4, 2).refreshBody();
		this.players[1].setScale(4, 2).refreshBody();
		this.players[0].setBounce(0.2);
		this.players[1].setBounce(0.2);
		this.players[0].setCollideWorldBounds(true);
		this.players[1].setCollideWorldBounds(true);
		if (this.platforms) {
			this.physics.add.collider(this.players[0], this.platforms);
			this.physics.add.collider(this.players[1], this.platforms);
		}
	}

	loadKeyCodes(this: MyScene) {
		this.keyCodesP1 = [
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
		];
		this.keyCodesP2 = [
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
			this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
		];
	}

	checkKeyInputs(this: MyScene) {
		if (this.keyCodesP1[1].isDown) {
			this.players[0].setVelocityX(-1600);
			if (this.directions[0] != 'left') {
				this.directions[0] = 'left'
				this.players[0].setFlipX(true);
			}
			if (this.moveStates[0] != 'run') {
				this.moveStates[0] = 'run'
				this.players[0].play('mageRunAnim');
			}
		}
		else if (this.keyCodesP1[2].isDown) {
			this.players[0].setVelocityX(1600);
			if (this.directions[0] != 'right') {
				this.directions[0] = 'right'
				this.players[0].setFlipX(false);
			}
			if (this.moveStates[0] != 'run') {
				this.moveStates[0] = 'run'
				this.players[0].play('mageRunAnim');
			}
		}
		else {
			this.players[0].setVelocityX(0);
			if (this.moveStates[0] != 'idle') {
				this.moveStates[0] = 'idle'
				this.players[0].play('mageIdleAnim');
			}
		}

		if (this.keyCodesP2[1].isDown) {
			this.players[1].setVelocityX(-1600);
			if (this.directions[1] != 'left') {
				this.directions[1] = 'left'
				this.players[1].setFlipX(true);
			}
			if (this.moveStates[1] != 'run') {
				this.moveStates[1] = 'run'
				this.players[1].play('mageRunAnim');
			}
		}
		else if (this.keyCodesP2[2].isDown) {
			this.players[1].setVelocityX(1600);
			if (this.directions[1] != 'right') {
				this.directions[1] = 'right'
				this.players[1].setFlipX(false);
			}
			if (this.moveStates[1] != 'run') {
				this.moveStates[1] = 'run'
				this.players[1].play('mageRunAnim');
			}
		}
		else {
			this.players[1].setVelocityX(0);
			if (this.moveStates[1] != 'idle') {
				this.moveStates[1] = 'idle'
				this.players[1].play('mageIdleAnim');
			}
		}

		if (this.keyCodesP1[0].isDown && this.players[0].body.touching.down)
			this.players[0].setVelocityY(-750);
		if (this.keyCodesP2[0].isDown && this.players[1].body.touching.down)
			this.players[1].setVelocityY(-750);
	}

	/****** OVERLOADED MEMBER FUNCTIONS ******/

	preload(this: MyScene) {
		this.load.image('sky', sky__Img);
		this.load.image('ground', ground__Img);
		this.load.spritesheet('mageIdle', mageIdle__Sheet, { frameWidth: 250, frameHeight: 166 });
		this.load.spritesheet('mageRun', mageRun__Sheet, { frameWidth: 250, frameHeight: 166 });
	}

	create(this: MyScene) {
		//this.setBackground('sky');
		this.setPlatforms();
		this.setPlayers('mageIdle', 'mageIdle');
		this.createAnims();
		this.cursors = this.input.keyboard.createCursorKeys();
		this.loadKeyCodes();
	}

	update(this: MyScene) {
		this.checkKeyInputs();
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
					gravity: { y: 1500 },
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
