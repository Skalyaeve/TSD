import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Phaser from 'phaser'

/* -------------------------ASSETS IMPORT------------------------- */

// Images
import sky__Img from '../resource/assets/sky.png'
import ground__Img from '../resource/assets/platform.png'
import basicBall__Img from '../resource/assets/basicBall.png'
import energyBall__Img from '../resource/assets/energyBall.png'

// Spritesheets
import playerIdle__Sheet from '../resource/assets/playerSheet.png'
import playerRun__Sheet from '../resource/assets/playerSheet.png'
import mageIdle__Sheet from '../resource/assets/Mage/Idle.png'
import mageRun__Sheet from '../resource/assets/Mage/Run.png'

/* -------------------------SCENE CLASS------------------------- */

interface player {
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	yDir: string								// Player actual X direction (left/right)
	xDir: string								// Player actual Y direction (none/up/down)
	lastMove: string							// Player last movement state (none/idle/run)
	move: string								// Player actual movement state (idle/run)
	skinId: number								// Player skin id in skins array
	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
	keyCodes: {									// Player key codes
		up: number,								// Player UP key code
		down: number,							// Player DOWN key code
		left: number,							// Player LEFT key code
		right: number							// Player RIGHT key code
	}
	keys?: {									// Player Phaser keys
		up: Phaser.Input.Keyboard.Key,			// Player UP Phaser key
		down: Phaser.Input.Keyboard.Key,		// Player DOWN Phaser key
		left: Phaser.Input.Keyboard.Key,		// Player LEFT Phaser key
		right: Phaser.Input.Keyboard.Key		// Player RIGHT Phaser key53019
	}
	colliders: Phaser.Physics.Arcade.Collider[]	// Player colliders
	shape?: Phaser.Geom.Ellipse
}

interface ball {
	xPos: number								// Ball start X position on scene creation
	yPos: number								// Ball start Y position on scene creation
	size: number								// Ball size
	bounce: number								// Ball bounce ratio
	impacts: number								// Ball actual number of impacts since creation
	maxImpacts: number							// Ball max number of impact before max speed
	sprite?: Phaser.Physics.Arcade.Sprite		// Ball sprite
	spriteName: string							// Ball sprite name
	image: string								// Ball image
	shape?: Phaser.Geom.Circle
}

interface skin {
	name: string								// Skin name
	nbFrames: number							// Skin spritesheet number of frames
	xSize: number								// Skin X size
	ySize: number								// Skin Y size
	runSheet: string							// Skin run spritesheet
	idleSheet: string							// Skin idle spritesheet
}

class MyScene extends Phaser.Scene {

	/****** VARIABLES & CONSTRUCTION ******/

	// Deprecated - May return
	private platforms?: Phaser.Physics.Arcade.StaticGroup
	private background?: Phaser.GameObjects.Image

	// Scene elements
	private canvasSize: number[] = [1920, 1080]
	private score: number[] = [0, 0]
	private scoreText?: Phaser.GameObjects.Text
	private globalSpeed: number = 1000

	// Players
	private players: player[] = []

	// Ball
	private balls: ball[] = []

	// Skins
	private skins: skin[] = []

	// Constructor - Initialisation
	constructor() {
		super({ key: 'MyScene' })
		this.skinsInitialisation()
		this.playersInitialisation()
		this.ballInitialisation()
	}

	// Initialise all skins of the scene
	skinsInitialisation() {
		let skins: skin[] = this.skins
		skins[0] = {
			name: 'player',
			nbFrames: 2,
			xSize: 100,
			ySize: 175,
			idleSheet: playerIdle__Sheet,
			runSheet: playerRun__Sheet
		}
		skins[1] = {
			name: 'mage',
			nbFrames: 8,
			xSize: 250,
			ySize: 250,
			idleSheet: mageIdle__Sheet,
			runSheet: mageRun__Sheet
		}
	}

	// Initialise all players of the scene
	playersInitialisation() {
		let players: player[] = this.players
		players[0] = {
			xPos: 100,
			yPos: 540,
			xDir: 'right',
			yDir: 'none',
			lastMove: 'none',
			move: 'idle',
			skinId: 0,
			keyCodes: {
				up: Phaser.Input.Keyboard.KeyCodes.W,
				down: Phaser.Input.Keyboard.KeyCodes.S,
				left: Phaser.Input.Keyboard.KeyCodes.A,
				right: Phaser.Input.Keyboard.KeyCodes.D
			},
			colliders: []
		}
		players[1] = {
			xPos: 1820,
			yPos: 540,
			xDir: 'left',
			yDir: 'none',
			lastMove: 'none',
			move: 'idle',
			skinId: 0,
			keyCodes: {
				up: Phaser.Input.Keyboard.KeyCodes.UP,
				down: Phaser.Input.Keyboard.KeyCodes.DOWN,
				left: Phaser.Input.Keyboard.KeyCodes.LEFT,
				right: Phaser.Input.Keyboard.KeyCodes.RIGHT
			},
			colliders: []
		}
	}

	// Initialise all balls of the scene
	ballInitialisation() {
		let balls: ball[] = this.balls
		balls[0] = {
			xPos: 960,
			yPos: 540,
			size: 26,
			bounce: 50,
			impacts: 0,
			maxImpacts: 15,
			spriteName: 'ball',
			image: basicBall__Img
		}
	}

	/****** DEPRECATED - MAY RETURN ******/

	// Set background for this scene 
	setBackground(this: MyScene, objectName: string) {
		this.background = this.add.image(this.canvasSize[0] / 2, this.canvasSize[1] / 2, objectName)
		const xRatio: number = this.canvasSize[0] / this.background.width
		const yRatio: number = this.canvasSize[1] / this.background.height
		this.background.setScale(xRatio, yRatio)
	}

	// Set plaforms for this scene
	setPlatforms(this: MyScene) {
		this.platforms = this.physics.add.staticGroup()
		//this.platforms.create(this.canvasSize[0] / 2, 1048, 'ground').setScale(5, 2).refreshBody()
	}

	/****** EVENT LISTENERS ******/

	// Event listener for the ball touching left and right walls
	onWorldCollision(this: MyScene, body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean, left: boolean, right: boolean) {
		if (up || down)
			return
		for (let ballId = 0; ballId < this.balls.length; ballId++)
			this.balls[ballId].sprite?.destroy()
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			for (let colliderId = 0; colliderId < this.players[playerId].colliders.length; colliderId++)
				this.players[playerId].colliders[colliderId].destroy()
			this.players[playerId].sprite?.destroy()
		}
		this.physics.world.removeAllListeners()
		this.score[right ? 0 : 1] += 1
		this.scoreText?.destroy()
		this.playersInitialisation()
		this.ballInitialisation()
		this.create()
	}

	/****** SCENE CONSTRUCTION ******/

	// Create players for this scene
	createPlayers(this: MyScene) {
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			let player = this.players[playerId]
			let newSprite = this.physics.add.sprite(player.xPos, player.yPos, this.skins[player.skinId].name + 'Idle')
			if (this.skins[player.skinId].name == 'mage') {
				newSprite.body.setSize(50, 52)
				newSprite.body.setOffset(100, 114)
				newSprite.setScale(2.5, 2.5).refreshBody()
			}
			newSprite.setBounce(1)
			newSprite.setCollideWorldBounds(true)
			newSprite.setImmovable(true)
			if (player.xDir == 'left')
				newSprite.setFlipX(true)
			else if (player.xDir == 'right')
				newSprite.setFlipX(false)
			player.sprite = newSprite
		}
	}

	// Create balls for this scene
	createBalls(this: MyScene) {
		for (let ballId = 0; ballId < this.balls.length; ballId++) {
			let ball = this.balls[ballId]
			ball.sprite = this.physics.add.sprite(ball.xPos, ball.yPos, ball.spriteName)
			ball.sprite.setBounce(1)
			ball.sprite.setCircle(ball.size)
			ball.sprite.setCollideWorldBounds(true)
			if (ball.sprite)
				if (ball.sprite.body instanceof Phaser.Physics.Arcade.Body)
					ball.sprite.body.onWorldBounds = true
		}
	}

	// Create colliders for this scene
	createColliders(this: MyScene) {
		this.physics.world.on('worldbounds', this.onWorldCollision, this)
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			let playerSprite = this.players[playerId].sprite
			for (let ballId = 0; ballId < this.balls.length; ballId++) {
				let ball = this.balls[ballId]
				if (playerSprite && ball.sprite) {
					let sprite = ball.sprite
					this.players[playerId].colliders[ballId] = this.physics.add.collider(playerSprite, ball.sprite,
						() => {
							if (sprite.body) {
								let velocity: number = Math.sqrt(sprite.body.velocity.x * sprite.body.velocity.x + sprite.body.velocity.y * sprite.body.velocity.y)
								if (!velocity)
									return
								let directionX: number = sprite.body.velocity.x / velocity
								let directionY: number = sprite.body.velocity.y / velocity
								velocity = this.globalSpeed + 1 + ball.bounce * ball.impacts
								sprite.setVelocity(velocity * directionX, velocity * directionY)
								ball.impacts += 1;
								if (ball.impacts > ball.maxImpacts)
									ball.impacts = ball.maxImpacts
							}
						},
						undefined, this)
				}
			}
		}
	}

	// Create animation for this scene
	createAnims(this: MyScene) {
		let skins: skin[] = this.skins
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			let skinId: number = this.players[playerId].skinId
			this.anims.create({
				key: skins[skinId].name + 'IdleAnim',
				frames: this.anims.generateFrameNumbers(skins[skinId].name + 'Idle', { start: 0, end: skins[skinId].nbFrames - 1 }),
				frameRate: this.skins[skinId].nbFrames,
				repeat: -1
			})
			this.anims.create({
				key: skins[skinId].name + 'RunAnim',
				frames: this.anims.generateFrameNumbers(skins[skinId].name + 'Run', { start: 0, end: skins[skinId].nbFrames - 1 }),
				frameRate: skins[skinId].nbFrames,
				repeat: -1
			})
		}
		this.scoreText = this.add.text(890, 0, this.score[0] + ' - ' + this.score[1], { fontSize: '50px' })
	}

	// Load the keys used by players to move
	loadKeyCodes(this: MyScene) {
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			if (this.input.keyboard) {
				this.players[playerId].keys = {
					up: this.input.keyboard.addKey(this.players[playerId].keyCodes.up),
					down: this.input.keyboard.addKey(this.players[playerId].keyCodes.down),
					left: this.input.keyboard.addKey(this.players[playerId].keyCodes.left),
					right: this.input.keyboard.addKey(this.players[playerId].keyCodes.right)
				}
			}
		}
	}

	/****** SCENE UPDATE ******/

	// Check if all keyboards keys are released
	allKeysUp(this: MyScene, playerId: number) {
		let keys = this.players[playerId].keys
		if (keys?.up.isUp && keys?.down.isUp && keys?.left.isUp && keys?.right.isUp)
			return true
		return false
	}

	// Check for keyboard inputs
	checkKeyInputs(this: MyScene) {
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			let player = this.players[playerId]
			if (this.allKeysUp(playerId)) {
				player.move = 'idle'
				player.yDir = 'none'
				continue
			}
			else
				player.move = 'run'
			if (player.keys?.left.isDown)
				player.xDir = 'left'
			else if (player.keys?.right.isDown)
				player.xDir = 'right'
			else
				player.xDir = 'none'
			if (player.keys?.up.isDown)
				player.yDir = 'up'
			else if (player.keys?.down.isDown)
				player.yDir = 'down'
			else
				player.yDir = 'none'
		}
	}

	// Move player following moveState, xDirection and yDirection
	movePlayers() {
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			let player = this.players[playerId]
			if (player.move == 'run') {
				if (player.yDir == 'up')
					player.sprite?.setVelocityY(-this.globalSpeed)
				else if (player.yDir == 'down')
					player.sprite?.setVelocityY(this.globalSpeed)
				else
					player.sprite?.setVelocityY(0)
				if (player.xDir == 'left')
					player.sprite?.setVelocityX(-this.globalSpeed)
				else if (player.xDir == 'right')
					player.sprite?.setVelocityX(this.globalSpeed)
				else
					player.sprite?.setVelocityX(0)
			}
			else {
				player.sprite?.setVelocityX(0)
				player.sprite?.setVelocityY(0)
			}
		}
	}

	// Set player animations following moveState, xDirection and yDirection
	setAnims() {
		for (let playerId = 0; playerId < this.players.length; playerId++) {
			let player = this.players[playerId]
			if (player.move != player.lastMove) {
				if (player.move == 'run')
					player.sprite?.play(this.skins[player.skinId].name + 'RunAnim')
				else
					player.sprite?.play(this.skins[player.skinId].name + 'IdleAnim')
			}
			player.lastMove = player.move
		}
	}

	/****** OVERLOADED PHASER FUNCTIONS ******/

	preload(this: MyScene) {
		this.load.image('sky', sky__Img)
		this.load.image('ground', ground__Img)
		for (let ballId = 0; ballId < this.balls.length; ballId++)
			this.load.image(this.balls[ballId].spriteName, this.balls[ballId].image)
		for (let skinId = 0; skinId < this.skins.length; skinId++) {
			let skin = this.skins[skinId]
			this.load.spritesheet(skin.name + 'Idle', skin.idleSheet, { frameWidth: skin.xSize, frameHeight: skin.ySize })
			this.load.spritesheet(skin.name + 'Run', skin.runSheet, { frameWidth: skin.xSize, frameHeight: skin.ySize })
		}
	}

	create(this: MyScene) {
		//this.setBackground('sky')
		//this.setPlatforms()
		this.createBalls()
		this.createPlayers()
		this.createColliders()
		this.createAnims()
		this.loadKeyCodes()
	}

	update(this: MyScene) {
		this.checkKeyInputs()
		this.movePlayers()
		this.setAnims()
	}
}

/* -------------------------GAME INITIALISATION------------------------- */

function Party() {
	const gameRef = useRef<HTMLDivElement>(null)
	const [game, setGame] = useState<Phaser.Game | null>(null)
	const headerPxSize: number = 275
	const gameAspectRatio: number = 16 / 9

	const resizeGameDiv = () => {
		const gameDiv = gameRef.current
		if (gameDiv) {
			const innerWidth: number = window.innerWidth - headerPxSize
			const innerHeigth: number = window.innerHeight
			const windowAspectRatio: number = innerWidth / innerHeigth

			if (windowAspectRatio > gameAspectRatio) {
				gameDiv.style.width = `${innerHeigth * gameAspectRatio}px`
				gameDiv.style.height = `${innerHeigth}px`
			} else {
				gameDiv.style.width = `${innerWidth}px`
				gameDiv.style.height = `${innerWidth / gameAspectRatio}px`
			}
		}
	}

	useLayoutEffect(() => {
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: 1920,
			height: 1080,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0 },
					debug: false,
				},
			},
			scene: [MyScene],
		}
		if (gameRef.current) {
			const newGame: Phaser.Game = new Phaser.Game({ ...config, parent: gameRef.current, })
			setGame(newGame)
		}
		window.addEventListener('resize', resizeGameDiv)
		resizeGameDiv()
		return () => {
			if (game) {
				game.destroy(true)
			}
			window.removeEventListener('resize', resizeGameDiv)
		}
	}, [])

	return <main className="game main">
		<div className='game-canvas' ref={gameRef}></div>
	</main>
}

export default Party
