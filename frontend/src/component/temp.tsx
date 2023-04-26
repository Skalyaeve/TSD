import React, { useLayoutEffect, useRef, useState, Dispatch, SetStateAction, createContext, useContext } from 'react'
import Phaser from 'phaser'
import { Socket, io } from 'socket.io-client'

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

/* -------------------------TYPING------------------------- */

interface player {
	id: string									// Player ID
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	xDir: string								// Player actual X direction (left/right)
	yDir: string								// Player actual Y direction (none/up/down)
	xVel: number								// Player actual X velocity
	yVel: number								// Player actual Y velocity
	lastMove: string							// Player last movement state (none/idle/run)
	move: string								// Player actual movement state (idle/run)
	skinId: number								// Player skin id in skins array
	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
	colliders: Phaser.Physics.Arcade.Collider[]	// Player colliders
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

/* -------------------------GAME INITIALISATION------------------------- */

function Party() {
	const gameRef = useRef<HTMLDivElement>(null)
	const [game, setGame] = useState<Phaser.Game | null>(null)
	const headerPxSize: number = 275
	const gameAspectRatio: number = 16 / 9

	let players: player[] = [];

	/****** VARIABLES & CONSTRUCTION ******/

	// Deprecated - May return
	let platforms: Phaser.Physics.Arcade.StaticGroup
	let background: Phaser.GameObjects.Image

	// Scene elements
	let canvasSize: number[] = [1920, 1080]
	let score: number[] = [0, 0]
	let scoreText: Phaser.GameObjects.Text
	let globalSpeed: number = 1000

	// Player creation queue
	let playerQueue: player[] = []

	// Ball
	let balls: ball[] = []

	// Skins
	let skins: skin[] = []

	// Initialise all skins of the scene
	/*function skinsInitialisation() {
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
	}*/

	// Initialise all balls of the scene
	function ballInitialisation() {
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
	/*function setBackground(scene: Phaser.Scene, objectName: string) {
		background = scene.add.image(canvasSize[0] / 2, canvasSize[1] / 2, objectName)
		const xRatio: number = canvasSize[0] / background.width
		const yRatio: number = canvasSize[1] / background.height
		background.setScale(xRatio, yRatio)
	}*/
	/*
		// Set plaforms for this scene
		setPlatforms() {
			platforms = physics.add.staticGroup()
			//platforms.create(canvasSize[0] / 2, 1048, 'ground').setScale(5, 2).refreshBody()
		}
	*/
	/****** EVENT LISTENERS ******/
	
		// Event listener for the ball touching left and right walls
		onWorldCollision(, body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean, left: boolean, right: boolean) {
			if (up || down)
				return
			for (let ballId = 0; ballId < balls.length; ballId++)
				balls[ballId].sprite?.destroy()
			for (let playerId = 0; playerId < players.length; playerId++) {
				for (let colliderId = 0; colliderId < players[playerId].colliders.length; colliderId++)
					players[playerId].colliders[colliderId].destroy()
				players[playerId].sprite?.destroy()
			}
			physics.world.removeAllListeners()
			score[right ? 0 : 1] += 1
			scoreText?.destroy()
			playersInitialisation()
			ballInitialisation()
			create()
		}
	
	/****** SCENE CONSTRUCTION ******/

	// Create players for this scene
	/*function createPlayer(scene: Phaser.Scene, player: player) {
		let newSprite = scene.physics.add.sprite(player.xPos, player.yPos, skins[player.skinId].name + 'Idle')
		if (skins[player.skinId].name == 'mage') {
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
	}*/

	/*function checkNewPlayer(scene: Phaser.Scene) {
		if (playerQueue.length == 0)
			return
		for (let queueId = 0; queueId < playerQueue.length; queueId++) {
			createPlayer(scene, playerQueue[queueId])
			createAnims(playerQueue[queueId], scene)
		}
	}*/

	// Create balls for this scene
	function createBalls(scene: Phaser.Scene) {
		for (let ballId = 0; ballId < balls.length; ballId++) {
			let ball = balls[ballId]
			ball.sprite = scene.physics.add.sprite(ball.xPos, ball.yPos, ball.spriteName)
			ball.sprite.setBounce(1)
			ball.sprite.setCircle(ball.size)
			ball.sprite.setCollideWorldBounds(true)
			if (ball.sprite)
				if (ball.sprite.body instanceof Phaser.Physics.Arcade.Body)
					ball.sprite.body.onWorldBounds = true
		}
	}
	
		// Create colliders for this scene
		createColliders() {
			physics.world.on('worldbounds', onWorldCollision, this)
			for (let playerId = 0; playerId < players.length; playerId++) {
				let playerSprite = players[playerId].sprite
				for (let ballId = 0; ballId < balls.length; ballId++) {
					let ball = balls[ballId]
					if (playerSprite && ball.sprite) {
						let sprite = ball.sprite
						players[playerId].colliders[ballId] = physics.add.collider(playerSprite, ball.sprite,
							() => {
								if (sprite.body) {
									let velocity: number = Math.sqrt(sprite.body.velocity.x * sprite.body.velocity.x + sprite.body.velocity.y * sprite.body.velocity.y)
									if (!velocity)
										return
									let directionX: number = sprite.body.velocity.x / velocity
									let directionY: number = sprite.body.velocity.y / velocity
									velocity = globalSpeed + 1 + ball.bounce * ball.impacts
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
	/*function createAnims(player: player, scene: Phaser.Scene) {
		let skinId: number = player.skinId
		scene.anims.create({
			key: skins[skinId].name + 'IdleAnim',
			frames: scene.anims.generateFrameNumbers(skins[skinId].name + 'Idle', { start: 0, end: skins[skinId].nbFrames - 1 }),
			frameRate: skins[skinId].nbFrames,
			repeat: -1
		})
		scene.anims.create({
			key: skins[skinId].name + 'RunAnim',
			frames: scene.anims.generateFrameNumbers(skins[skinId].name + 'Run', { start: 0, end: skins[skinId].nbFrames - 1 }),
			frameRate: skins[skinId].nbFrames,
			repeat: -1
		})
	}*/

	// Load the keys used by players to move
	/*function loadKeyCodes(scene: Phaser.Scene) {
		for (let playerId = 0; playerId < players.length; playerId++) {
			if (scene.input.keyboard) {
				players[playerId].keys = {
					up: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
					down: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
					left: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
					right: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
				}
			}
		}
	}*/

	/****** SCENE UPDATE ******/

	// Check if all keyboards keys are released
	/*function allKeysUp(playerId: number) {
		let keys = players[playerId].keys
		if (keys?.up.isUp && keys?.down.isUp && keys?.left.isUp && keys?.right.isUp)
			return true
		return false
	}*/

	// Check for keyboard inputs
	/*function checkKeyInputs() {
		for (let playerId = 0; playerId < players.length; playerId++) {
			let player = players[playerId]
			if (allKeysUp(playerId)) {
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
	}*/

	// Move player following moveState, xDirection and yDirection
	/*function movePlayers() {
		for (let playerId = 0; playerId < players.length; playerId++) {
			let player = players[playerId]
			if (player.move == 'run') {
				if (player.yDir == 'up')
					player.sprite?.setVelocityY(-globalSpeed)
				else if (player.yDir == 'down')
					player.sprite?.setVelocityY(globalSpeed)
				else
					player.sprite?.setVelocityY(0)
				if (player.xDir == 'left')
					player.sprite?.setVelocityX(-globalSpeed)
				else if (player.xDir == 'right')
					player.sprite?.setVelocityX(globalSpeed)
				else
					player.sprite?.setVelocityX(0)
			}
			else {
				player.sprite?.setVelocityX(0)
				player.sprite?.setVelocityY(0)
			}
		}
	}*/

	// Set player animations following moveState, xDirection and yDirection
	/*function setAnims() {
		for (let playerId = 0; playerId < players.length; playerId++) {
			if (players[playerId].move != players[playerId].lastMove) {
				if (players[playerId].move == 'run')
					players[playerId].sprite?.play(skins[players[playerId].skinId].name + 'RunAnim')
				else
					players[playerId].sprite?.play(skins[players[playerId].skinId].name + 'IdleAnim')
			}
			players[playerId].lastMove = players[playerId].move
		}
	}*/

	/****** OVERLOADED PHASER FUNCTIONS ******/

	function preload(this: Phaser.Scene) {
		this.load.image('sky', sky__Img)
		load.image('ground', ground__Img)
		for (let ballId = 0; ballId < balls.length; ballId++)
			this.load.image(balls[ballId].spriteName, balls[ballId].image)
		for (let skinId = 0; skinId < skins.length; skinId++) {
			let skin = skins[skinId]
			this.load.spritesheet(skin.name + 'Idle', skin.idleSheet, { frameWidth: skin.xSize, frameHeight: skin.ySize })
			this.load.spritesheet(skin.name + 'Run', skin.runSheet, { frameWidth: skin.xSize, frameHeight: skin.ySize })
		}
	}

	function create(this: Phaser.Scene) {
		setBackground(this, 'sky')
		setPlatforms()
		createBalls()
		createPlayers()
		createColliders()
		createAnims()
		loadKeyCodes()
		skinsInitialisation()
	}

	function update(this: Phaser.Scene) {
		checkNewPlayer(this)
		checkKeyInputs()
		movePlayers()
		setAnims()
	}

	// Create the game
	/*const createGame = () => {
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
			scene: {
				preload: preload,
				create: create,
				update: update,
			},
		}
		if (gameRef.current) {
			const newGame: Phaser.Game = new Phaser.Game({ ...config, parent: gameRef.current, })
			setGame(newGame)
		}
	}*/

	// Resize game div on page resize
	/*const resizeGameDiv = () => {
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
	}*/

	// Start socket comunication
	/*const startSocket = () => {
		const socket: Socket = io('http://localhost:3001')
		// Update the players list with the received data (when connecting for the first time)
		socket.on('currentPlayers', (playersList: player[]) => {
			console.log("Welcome to the game")
			players = playersList
			console.log("You have recieved the player list")
			for (let queueId = 0; queueId < players.length; queueId++) {
				playerQueue[playerQueue.length] = players[queueId]
			}
			console.log("Added ", players.length, " players to the creation queue")
		});
		// Add the new player (external) to the players list
		socket.on('newPlayer', (player: player) => {
			console.log("A new player has arrived")
			playerQueue[playerQueue.length] = player
			console.log("Added player to creation queue")
			players[players.length] = player
		});
		// Update the moved player's velocity in the players list
		socket.on('playerMoved', (player: player) => {
			for (let playerId = 0; playerId < players.length; playerId++) {
				if (players[playerId].id == player.id) {
					players[playerId].xVel = player.xVel
					players[playerId].yVel = player.yVel
					break;
				}
			}
			console.log("A player moved")
		});
		// Remove the disconnected player from the players list
		socket.on('playerDisconnected', (playerId: string) => {
			setPlayers((prevPlayers) => prevPlayers.filter((p) => p.id !== playerId));
			console.log("A player has disconnected")
		});
		// Send player movements to the server
		const sendPlayerMovement = (xVelocity: number, yVelocity: number) => {
			socket.emit('playerMovement', { xVelocity, yVelocity });
		};
		return socket
	}*/

	/*useLayoutEffect(() => {

		createGame()

		window.addEventListener('resize', resizeGameDiv)
		resizeGameDiv()

		const socket = startSocket()

		// Destruction
		return () => {
			if (game) {
				game.destroy(true, false)
				setGame(null)
			}
			window.removeEventListener('resize', resizeGameDiv)
			socket.disconnect()
		}
	}, [])

	return (
		<main className="game main">
			<div className='game-canvas' ref={gameRef}></div>
		</main>
	)*/
}

export default Party
