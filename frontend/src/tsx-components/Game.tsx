import React, { useLayoutEffect, useRef, useState, Dispatch, SetStateAction, createContext, useContext } from 'react'
import Phaser from 'phaser'
import { Socket, io } from 'socket.io-client'

/* -------------------------ASSETS IMPORT------------------------- */

// Images

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
	xMov: number								// Player last X movement
	yMov: number								// Player last Y movement
	lastMove: string							// Player last movement state (none/idle/run)
	move: string								// Player actual movement state (idle/run)
	skinId: number								// Player skin id in skins array
	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
	colliders: Phaser.Physics.Arcade.Collider[]	// Player colliders
}

interface skin {
	name: string								// Skin name
	nbFrames: number							// Skin spritesheet number of frames
	xSize: number								// Skin X size
	ySize: number								// Skin Y size
	runSheet: string							// Skin run spritesheet
	idleSheet: string							// Skin idle spritesheet
}

interface keys {								// Keyboard keys
	up: Phaser.Input.Keyboard.Key				// UP key
	down: Phaser.Input.Keyboard.Key				// DOWN key
	left: Phaser.Input.Keyboard.Key				// LEFT key
	right: Phaser.Input.Keyboard.Key			// RIGHT key
}

/* -------------------------GAME INITIALISATION------------------------- */

function Party() {

	/****** VARIABLES ******/

	// React variables
	const gameRef = useRef<HTMLDivElement>(null)
	const [game, setGame] = useState<Phaser.Game | null>(null)

	// Constants
	const headerPxSize: number = 275
	const gameAspectRatio: number = 16 / 9
	const canvasSize: number[] = [1920, 1080]
	const globalSpeed: number = 1000

	// Skin list
	let skins: skin[] = []

	// Score
	let scoreText: Phaser.GameObjects.Text
	let score: number[] = [0, 0]

	// Player list
	let players: player[] = []

	// Player own id
	let myId: string

	// Player socket
	let socket: Socket

	// Player event queues
	let creationQueue: player[] = []
	let deletionQueue: string[] = []
	let moveQueue: string[] = []

	// Keyboard keys
	let keys: keys

	/****** SCENE PRELOADING ******/

	// Initialise all keyboards keys
	function keysInitialisation(scene: Phaser.Scene) {
		if (scene.input.keyboard) {
			keys = {
				up: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.Z),
				down: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S),
				left: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.Q),
				right: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)
			}
		}
	}

	// Initialise all skins of the scene
	function skinsInitialisation(scene: Phaser.Scene) {
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
		for (let skinId = 0; skinId < skins.length; skinId++) {
			scene.load.spritesheet(skins[skinId].name + 'Idle', skins[skinId].idleSheet, { frameWidth: skins[skinId].xSize, frameHeight: skins[skinId].ySize })
			scene.load.spritesheet(skins[skinId].name + 'Run', skins[skinId].runSheet, { frameWidth: skins[skinId].xSize, frameHeight: skins[skinId].ySize })
		}
	}

	/****** SCENE CREATION ******/

	// Create players for this scene
	function createPlayer(playerId: string, scene: Phaser.Scene) {
		let player: player | null = null
		for (let playerI = 0; playerI < players.length; playerI++) {
			if (players[playerI].id == playerId)
				player = players[playerI]
		}
		if (player) {
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
		}
	}

	// Create animation for this scene
	function createAnims(scene: Phaser.Scene) {
		for (let skinId = 0; skinId < skins.length; skinId++) {
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
		}
	}

	// Check if directional keys are pressed
	function allKeysUp() {
		if (keys.up.isUp && keys.down.isUp && keys.left.isUp && keys.right.isUp)
			return true
		return false
	}

	// Send player movements to the server
	const sendPlayerMovement = (xMov: number, yMov: number) => {
		socket.emit('playerMovement', { xMov, yMov })
	}

	const sendPlayerStop = (xMov: number, yMov: number) => {
		socket.emit('playerStop', { xMov, yMov })
	}

	/****** SCENE UPDATE ******/

	function checkKeyInputs(scene: Phaser.Scene) {
		let player: player | null = null
		let endVelocityX: number = 0
		let endVelocityY: number = 0
		for (let playerI = 0; playerI < players.length; playerI++) {
			if (players[playerI].id == myId) {
				player = players[playerI]
				break
			}
		}
		if (player) {
			if (allKeysUp())
				player.move = 'idle'
			else
				player.move = 'run'
			if (keys.left.isDown)
				endVelocityX += -globalSpeed
			if (keys.right.isDown)
				endVelocityX += globalSpeed
			if (keys.up.isDown)
				endVelocityY += -globalSpeed
			if (keys.down.isDown)
				endVelocityY += globalSpeed
			if (player.sprite) {
				player.sprite.setVelocityX(endVelocityX)
				player.sprite.setVelocityY(endVelocityY)
				if (player.move == 'run' && player.sprite.body)
					sendPlayerMovement(player.sprite.body.x, player.sprite.body.y)
				if (player.move == 'idle' && player.lastMove == 'run' && player.sprite.body)
					sendPlayerMovement(player.sprite.body.x, player.sprite.body.y)
			}
		}
	}

	function checkNewPlayer(scene: Phaser.Scene) {
		if (!creationQueue.length)
			return
		for (let queueId = 0; queueId < creationQueue.length; queueId++) {
			players[players.length] = creationQueue[queueId]
			createPlayer(players[players.length - 1].id, scene)
		}
		console.log("Creation queue is now empty")
		creationQueue = []
	}

	function checkDisconnect() {
		if (!deletionQueue.length)
			return
		for (let queueId = 0; queueId < deletionQueue.length; queueId++) {
			for (let playerId = 0; playerId < players.length; playerId++) {
				if (players[playerId].id == deletionQueue[queueId]) {
					players[playerId].sprite?.destroy()
					break
				}
			}
		}
		console.log("Deletion queue is now empty")
		deletionQueue = []
	}

	// Set player animations following moveState, xDirection and yDirection
	function setAnims() {
		for (let playerId = 0; playerId < players.length; playerId++) {
			if (players[playerId].move != players[playerId].lastMove) {
				if (players[playerId].move == 'run')
					players[playerId].sprite?.play(skins[players[playerId].skinId].name + 'RunAnim')
				else
					players[playerId].sprite?.play(skins[players[playerId].skinId].name + 'IdleAnim')
			}
			players[playerId].lastMove = players[playerId].move
		}
	}

	function checkMove() {
		if (!moveQueue.length)
			return
		for (let queueId = 0; queueId < moveQueue.length; queueId++) {
			for (let playerId = 0; playerId < players.length; playerId++) {
				if (players[playerId].id == moveQueue[queueId] && players[playerId].id != myId) {
					players[playerId].sprite?.setPosition(players[playerId].xMov, players[playerId].yMov)
					if (players[playerId].move == 'run' && players[playerId].lastMove == 'idle')
						players[playerId].sprite?.play(skins[players[playerId].skinId].name + 'RunAnim')
					else if (players[playerId].move == 'idle' && players[playerId].lastMove == 'run')
						players[playerId].sprite?.play(skins[players[playerId].skinId].name + 'IdleAnim')
					console.log("Moved player ", players[playerId].id, " xv: ", players[playerId].xMov, " yv: ", players[playerId].yMov)
				}
			}
		}
		console.log("Move queue is now empty")
		moveQueue = []
	}

	/****** OVERLOADED PHASER FUNCTIONS ******/

	function preload(this: Phaser.Scene) {
		keysInitialisation(this)
		skinsInitialisation(this)
	}

	function create(this: Phaser.Scene) {
		createAnims(this)
	}

	function update(this: Phaser.Scene) {
		checkKeyInputs(this)
		checkNewPlayer(this)
		checkDisconnect()
		checkMove()
		setAnims()
	}

	// Create the game
	const createGame = () => {
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
	}

	// Start socket comunication
	const startSocket = () => {
		socket = io('http://localhost:3001')

		// Update the players list with the received data (when connecting for the first time)
		socket.on('currentPlayers', (playersList: player[]) => {
			for (let queueId = 0; queueId < playersList.length; queueId++)
				creationQueue[creationQueue.length] = playersList[queueId]
			console.log("Added ", playersList.length, " players to the creation queue")
		});

		// Get the player's own ID
		socket.on('ownID', (playerId: string) => {
			myId = playerId
			console.log("Player's own id: ", myId)
		})

		// Add a new player to the players list
		socket.on('newPlayer', (player: player) => {
			creationQueue[creationQueue.length] = player
			console.log("Added player to creation queue")
		});

		// Update the moved player's velocity in the players list
		socket.on('playerMoved', (player: player) => {
			for (let playerId = 0; playerId < players.length; playerId++) {
				if (players[playerId].id == player.id) {
					players[playerId].xMov = player.xMov
					players[playerId].yMov = player.yMov
					players[playerId].lastMove = players[playerId].move
					players[playerId].move = player.move
					moveQueue[moveQueue.length] = players[playerId].id
					break
				}
			}
			console.log("A player moved")
		});

		socket.on('playerStoped', (player: player) => {
			for (let playerId = 0; playerId < players.length; playerId++) {
				if (players[playerId].id == player.id) {
					players[playerId].xMov = player.xMov
					players[playerId].yMov = player.yMov
					players[playerId].lastMove = players[playerId].move
					players[playerId].move = player.move
					moveQueue[moveQueue.length] = players[playerId].id
					break
				}
			}
		})

		// Remove the disconnected player from the players list
		socket.on('playerDisconnected', (playerId: string) => {
			console.log("A player has disconnected")
			deletionQueue[deletionQueue.length] = playerId
			console.log("Player has been added to deletion queue")
		});
		return socket
	}

	useLayoutEffect(() => {

		createGame()
		const socket = startSocket()

		// Destruction
		return () => {
			if (game) {
				game.destroy(true, false)
				setGame(null)
			}
			socket.disconnect()
		}
	}, [])

	return <main className="game main" ref={gameRef}>
	</main>
}
export default Party