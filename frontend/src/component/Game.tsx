import React, { useLayoutEffect, useRef, useState } from 'react'
import Phaser from 'phaser'
import { Socket, io } from 'socket.io-client'

/* -------------------------ASSETS IMPORT------------------------- */

// Images

// Spritesheets
import playerIdle__Sheet from '../resource/assets/playerSheet.png'
import playerRun__Sheet from '../resource/assets/playerSheet.png'
import mageIdle__Sheet from '../resource/assets/Mage/IdleV3.png'
import mageRun__Sheet from '../resource/assets/Mage/Run.png'

/* -------------------------TYPING------------------------- */

interface player {
	id: string									// Player ID
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	xDir: string								// Player X direction (left/right)
	lastMove: string							// Player last movement state (none/idle/run)
	move: string								// Player actual movement state (idle/run)
	skinId: number								// Player skin id in skins array
	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
	colliders: Phaser.Physics.Arcade.Collider[]	// Player colliders
	scaleFactor: number
}

interface skin {
	name: string								// Skin name
	nbFrames: number							// Skin spritesheet number of frames
	xSizeIdle: number							// Idle skin X size
	ySizeIdle: number							// Idle skin Y size
	xSizeRun: number							// Running skin X size
	ySizeRun: number							// Running skin Y size
	runSheet: string							// Skin run spritesheet
	idleSheet: string							// Skin idle spritesheet
}

interface keys {								// Keyboard keys
	up: Phaser.Input.Keyboard.Key				// UP key
	down: Phaser.Input.Keyboard.Key				// DOWN key
	left: Phaser.Input.Keyboard.Key				// LEFT key
	right: Phaser.Input.Keyboard.Key			// RIGHT key
}

interface canvas {								// Scene canvas settings
	xSize: number								// Canvas heigth
	ySize: number								// Canvas width
	aspectRatio: number							// Canvas aspecct 
	leftOffset: number
	gameSpeed: number
}

/* -------------------------GAME INITIALISATION------------------------- */

function Party() {

	/****** VARIABLES ******/

	// React variables
	const gameRef = useRef<HTMLDivElement>(null)
	const [game, setGame] = useState<Phaser.Game | null>(null)

	// Canvas constants
	let canvas: canvas = {
		xSize: 1920,
		ySize: 1080,
		aspectRatio: 16 / 9,
		leftOffset: 300,
		gameSpeed: 1000,
	}

	// Player socket
	let socket: Socket

	// Keyboard keys
	let keys: keys

	// Player list
	let players: player[] = []

	// Skin list
	let skins: skin[] = []

	// Player self id
	let myId: string

	// Player event queues
	let creationQueue: player[] = []
	let deletionQueue: string[] = []
	let moveQueue: string[] = []
	
	// Score
	let scoreText: Phaser.GameObjects.Text
	let score: number[] = [0, 0]
	
	/****** SCENE PRELOADING ******/
	
	// Initialise all keyboards keys
	function keysInitialisation(scene: Phaser.Scene) {
		if (scene.input.keyboard) {
			keys = {
				up: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W),
				down: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S),
				left: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A),
				right: scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D)
			}
		}
	}

	// Initialise all skins of the scene
	function skinsInitialisation(scene: Phaser.Scene) {
		skins[0] = {
			name: 'player',
			nbFrames: 2,
			xSizeIdle: 100,
			ySizeIdle: 175,
			xSizeRun: 100,
			ySizeRun: 175,
			idleSheet: playerIdle__Sheet,
			runSheet: playerRun__Sheet
		}
		skins[1] = {
			name: 'mage',
			nbFrames: 8,
			xSizeIdle: 57,
			ySizeIdle: 104,
			xSizeRun: 250,
			ySizeRun: 250,
			idleSheet: mageIdle__Sheet,
			runSheet: mageRun__Sheet
		}
		for (let skinId = 0; skinId < skins.length; skinId++) {
			scene.load.spritesheet(skins[skinId].name + 'Idle', skins[skinId].idleSheet, { frameWidth: skins[skinId].xSizeIdle, frameHeight: skins[skinId].ySizeIdle })
			scene.load.spritesheet(skins[skinId].name + 'Run', skins[skinId].runSheet, { frameWidth: skins[skinId].xSizeRun, frameHeight: skins[skinId].ySizeRun })
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
			console.log("creating player: ", player.xPos, player.yPos)
			let newSprite = scene.physics.add.sprite(player.xPos, player.yPos, skins[player.skinId].name + 'Idle')
			if (newSprite && newSprite.body)
				console.log("created player: ", newSprite.body.x, newSprite.body.y)
			let spriteOffsetX: number = newSprite.body.x - player.xPos
			let spriteOffsetY: number = newSprite.body.y - player.yPos
			console.log("Offset x:", spriteOffsetX, "y:", spriteOffsetY)
			newSprite.setScale(player.scaleFactor, player.scaleFactor).refreshBody()
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
	const sendPlayerMovement = (xPos: number, yPos: number) => {
		socket.emit('playerMovement', { xPos, yPos })
	}

	const sendPlayerStop = (xPos: number, yPos: number) => {
		socket.emit('playerStop', { xPos, yPos })
	}

	/****** SCENE UPDATE ******/

	function checkKeyInputs() {
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
				endVelocityX += -canvas.gameSpeed
			if (keys.right.isDown)
				endVelocityX += canvas.gameSpeed
			if (keys.up.isDown)
				endVelocityY += -canvas.gameSpeed
			if (keys.down.isDown)
				endVelocityY += canvas.gameSpeed
			if (player.sprite) {
				
				player.sprite.setVelocityX(endVelocityX)
				player.sprite.setVelocityY(endVelocityY)
				if (player.move == 'run' && player.sprite.body)
					sendPlayerMovement(player.sprite.body.x + 28.5 * player.scaleFactor, player.sprite.body.y + 52 * player.scaleFactor)
				if (player.move == 'idle' && player.lastMove == 'run' && player.sprite.body)
					sendPlayerStop(player.sprite.body.x + 28.5 * 2.5, player.sprite.body.y + 52 * 2.5)
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
		//console.log("Creation queue is now empty")
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
		//console.log("Deletion queue is now empty")
		deletionQueue = []
	}

	// Set player animations following moveState
	function setAnims() {
		for (let playerId = 0; playerId < players.length; playerId++) {
			if (players[playerId].move != players[playerId].lastMove) {
				if (players[playerId].move == 'run')
					players[playerId].sprite?.play(skins[players[playerId].skinId].name + 'IdleAnim')
				else if (players[playerId].move == 'idle' && players[playerId].lastMove == 'run')
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
				let player = players[playerId]
				if (player.id == moveQueue[queueId] && player.id != myId) {
					player.sprite?.setPosition(player.xPos, player.yPos)
					if (player.move == 'run' && player.lastMove == 'idle')
						player.sprite?.play(skins[player.skinId].name + 'IdleAnim')
					else if (player.move == 'idle' && player.lastMove == 'run')
						player.sprite?.play(skins[player.skinId].name + 'IdleAnim')
					//console.log("Moved player ", player.id, " xv: ", player.xPos, " yv: ", player.yPos)
				}
			}
		}
		//console.log("Move queue is now empty")
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
		checkKeyInputs()
		checkNewPlayer(this)
		checkDisconnect()
		checkMove()
		setAnims()
	}

	// Create the game(addedUsers ? 10 : 7)
	const createGame = () => {
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: canvas.xSize,
			height: canvas.ySize,
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

	// Resize game div on page resize
	const resizeGameDiv = () => {
		const gameDiv = gameRef.current
		if (gameDiv) {
			const innerWidth: number = window.innerWidth - canvas.leftOffset
			const innerHeigth: number = window.innerHeight
			const windowAspectRatio: number = innerWidth / innerHeigth

			if (windowAspectRatio > canvas.aspectRatio) {
				gameDiv.style.width = `${innerHeigth * canvas.aspectRatio}px`
				gameDiv.style.height = `${innerHeigth}px`
			} else {
				gameDiv.style.width = `${innerWidth}px`
				gameDiv.style.height = `${innerWidth / canvas.aspectRatio}px`
			}
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
		})

		// Update the moved player's velocity in the players list
		socket.on('playerMoved', (player: player) => {
			for (let playerId = 0; playerId < players.length; playerId++) {
				if (players[playerId].id == player.id) {
					players[playerId].xPos = player.xPos
					players[playerId].yPos = player.yPos
					players[playerId].lastMove = players[playerId].move
					players[playerId].move = player.move
					moveQueue[moveQueue.length] = players[playerId].id
					break
				}
			}
			console.log("A player moved:")
		})

		socket.on('playerStoped', (player: player) => {
			for (let playerId = 0; playerId < players.length; playerId++) {
				if (players[playerId].id == player.id) {
					players[playerId].xPos = player.xPos
					players[playerId].yPos = player.yPos
					players[playerId].lastMove = players[playerId].move
					players[playerId].move = player.move
					moveQueue[moveQueue.length] = players[playerId].id
					break
				}
			}
			console.log("A player stoped:")
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
	)
}

export default Party
