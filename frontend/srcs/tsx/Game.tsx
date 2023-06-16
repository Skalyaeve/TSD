/* -------------------------LIBRARIES IMPORTS------------------------- */

import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { Socket, io } from 'socket.io-client'

/* -------------------------ASSETS IMPORTS------------------------- */

// Images && Spritesheets
import playerIdle__Sheet from '../resources/assets/game/playerSheet.png'
import playerRun__Sheet from '../resources/assets/game/playerSheet.png'
import mageIdle__Sheet from '../resources/assets/game/Mage/Idle.png'
import mageRun__Sheet from '../resources/assets/game/Mage/Run.png'
import blank__Sheet from '../resources/assets/game/blank.png'
import black__Sheet from '../resources/assets/game/black.png'

/* -------------------------TYPES------------------------- */

// Keys interface
interface keys {								// Keyboard keys
	up: Phaser.Input.Keyboard.Key				// UP key
	down: Phaser.Input.Keyboard.Key				// DOWN key
	left: Phaser.Input.Keyboard.Key				// LEFT key
	right: Phaser.Input.Keyboard.Key			// RIGHT key
}

// Player key states interface
interface keyStates {
	up: boolean									// Player UP key state
	down: boolean								// Player DOWN key state
	left: boolean								// Player LEFT key state
	right: boolean								// Player RIGHT key state
}

// Skins interface
interface skin {
	name: string								// Skin name
	idleSheet: string							// Skin idle spritesheet
	runSheet: string							// Skin run spritesheet
	nbFrames: number							// Skin spritesheet number of frames
	xSize: number								// Skin spritesheet X size
	ySize: number								// Skin spritesheet Y size
	xResize: number								// Skin hitbox X size
	yResize: number								// Skin hitbox Y size
	xOffset: number								// Skin X offset between sprite and hitbox
	yOffset: number								// Skin Y offset between sprite and hitbox
	scaleFactor: number							// Skin sprite scale factor
}

// Players interface
interface player {
	id: string									// Player ID
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	xDir: string								// Player X direction (left/right)
	keyStates: keyStates						// Player key states
	xVel: number								// Player X velocity
	yVel: number								// Player Y velocity
	lastMove: string							// Player last movement state (none/idle/run)
	move: string								// Player actual movement state (idle/run)
	skin: string								// Player skin name
	anim: string								// Player actual animation
	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
}

interface playerConstruct {
	id: string
	side: "left" | "right"
	skin: "player" | "mage" | "blank" | "black"
}

// Game canvas interface
interface canvas {								// Scene canvas settings
	xSize: number								// Canvas heigth
	ySize: number								// Canvas width
	gameSpeed: number							// Game global speed
}

/* -------------------------GAME INITIALISATION------------------------- */

function Party() {

	/****** VARIABLES ******/

	// React variables
	const gameRef = useRef<HTMLDivElement>(null)
	let game: Phaser.Game

	// Client type
	const loginID: string = "PHASER-WEB-CLIENT"

	// Canvas constants
	let canvas: canvas = {
		xSize: 1920,
		ySize: 1080,
		gameSpeed: 1000
	}

	// Player socket
	let comSocket: Socket

	// Keyboard keys
	let keys: keys

	// Players list
	let players: { [key: string]: player } = {}

	// Skins list
	let skins: { [key: string]: skin } = {}

	// Player self id
	let myId: string

	// Player event queues
	let creationQueue: string[] = []
	let moveQueue: string[] = []
	let animationQueue: string[] = []
	let deletionQueue: string[] = []

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
		skins['player'] = {
			name: 'player',
			idleSheet: playerIdle__Sheet,
			runSheet: playerRun__Sheet,
			nbFrames: 2,
			xSize: 100,
			ySize: 175,
			xResize: 100,
			yResize: 175,
			xOffset: 0,
			yOffset: 0,
			scaleFactor: 1
		}
		skins['mage'] = {
			name: 'mage',
			idleSheet: mageIdle__Sheet,
			runSheet: mageRun__Sheet,
			nbFrames: 8,
			xSize: 250,
			ySize: 250,
			xResize: 50,
			yResize: 52,
			xOffset: 100,
			yOffset: 114,
			scaleFactor: 2.5
		}
		skins['black'] = {
			name: 'black',
			idleSheet: black__Sheet,
			runSheet: black__Sheet,
			nbFrames: 2,
			xSize: 125,
			ySize: 250,
			xResize: 125,
			yResize: 250,
			xOffset: 0,
			yOffset: 0,
			scaleFactor: 2.5
		}
		skins['blank'] = {
			name: 'blank',
			idleSheet: blank__Sheet,
			runSheet: blank__Sheet,
			nbFrames: 2,
			xSize: 125,
			ySize: 250,
			xResize: 125,
			yResize: 250,
			xOffset: 0,
			yOffset: 0,
			scaleFactor: 2.5
		}
		for (let skinName in skins) {
			scene.load.spritesheet(skinName + 'Idle', skins[skinName].idleSheet, { frameWidth: skins[skinName].xSize, frameHeight: skins[skinName].ySize })
			scene.load.spritesheet(skinName + 'Run', skins[skinName].runSheet, { frameWidth: skins[skinName].xSize, frameHeight: skins[skinName].ySize })
		}
	}

	/****** SCENE CREATION ******/

	//WORK IN PROGRESS HERE

	// Create players for this scene
	function createPlayer(playerId: string, scene: Phaser.Scene) {
		let player: player = players[playerId]
		let skin = skins[player.skin]
		player.sprite = scene.physics.add.sprite(player.xPos, player.yPos, player.skin + 'Idle')
		if (player.sprite.body) {
			player.sprite.body.setSize(skin.xResize, skin.yResize)
			player.sprite.body.setOffset(skin.xOffset, skin.yOffset)
		}
		player.sprite.setScale(skin.scaleFactor, skin.scaleFactor)
		player.sprite.setBounce(1)
		player.sprite.setCollideWorldBounds(true)
		player.sprite.setImmovable(true)
		if (player.xDir == 'left')
			player.sprite.setFlipX(true)
		else if (player.xDir == 'right')
			player.sprite.setFlipX(false)
	}

	//WORK IN PROGRESS HERE

	// Create animation for this scene
	function createAnims(scene: Phaser.Scene) {
		for (let skinName in skins) {
			scene.anims.create({
				key: skinName + 'IdleAnim',
				frames: scene.anims.generateFrameNumbers(skinName + 'Idle', { start: 0, end: skins[skinName].nbFrames - 1 }),
				frameRate: skins[skinName].nbFrames,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + 'RunAnim',
				frames: scene.anims.generateFrameNumbers(skinName + 'Run', { start: 0, end: skins[skinName].nbFrames - 1 }),
				frameRate: skins[skinName].nbFrames,
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

	//WORK IN PROGRESS HERE

	// Send player movements to the server
	// WORKER <= BACK <= CLIENT
	const sendPlayerMovement = () => {
		comSocket.emit('playerKeyUpdate', { keyStates: players[myId].keyStates })
	}

	// Send player start to the server
	// WORKER x BACK <= CLIENT
	const sendPlayerStart = () => {
		players[myId].sprite?.play(players[myId].skin + 'RunAnim')
		comSocket.emit('playerStart')
	}

	// Send player stop to the server
	// WORKER x BACK <= CLIENT
	const sendPlayerStop = () => {
		players[myId].sprite?.play(players[myId].skin + 'IdleAnim')
		comSocket.emit('playerStop')
	}

	/****** SCENE UPDATE ******/

	// Adapts player moveState and devolity following the pressed keys
	function checkKeyInputs() {
		if (!players.length)
			return
		let player: player = players[myId]
		player.keyStates.up = (keys.up.isDown ? true : false)
		player.keyStates.down = (keys.down.isDown ? true : false)
		player.keyStates.left = (keys.left.isDown ? true : false)
		player.keyStates.right = (keys.right.isDown ? true : false)
		if (allKeysUp()) {
			if (player.move == 'run') {
				sendPlayerStop()
				sendPlayerMovement()
				player.move = 'idle'
			}
		}
		else {
			if (player.move == 'run')
				sendPlayerMovement()
			else {
				sendPlayerStart()
				sendPlayerMovement()
				player.move = 'run'
			}
		}
	}

	// Create new player upon connection
	function checkNewPlayer(scene: Phaser.Scene) {
		if (!creationQueue.length)
			return
		for (let queueId = 0; queueId < creationQueue.length; queueId++) {
			createPlayer(players[creationQueue[queueId]].id, scene)
		}
		creationQueue = []
	}

	// Delete player upon disconnection
	function checkDisconnect() {
		if (!deletionQueue.length)
			return
		for (let queueId = 0; queueId < deletionQueue.length; queueId++) {
			players[deletionQueue[queueId]].sprite?.destroy()
			delete players[deletionQueue[queueId]]
		}
		deletionQueue = []
	}

	// Set player animations following anim state
	function checkAnims() {
		for (let queueId = 0; queueId < animationQueue.length; queueId++) {
			players[animationQueue[queueId]].sprite?.play(players[animationQueue[queueId]].skin + players[animationQueue[queueId]].anim)
		}
		animationQueue = []
	}

	// Set player position following xPos and yPos
	function checkMove() {
		if (!animationQueue.length)
			return
		for (let queueId of moveQueue) {
			players[queueId].sprite?.setPosition(players[queueId].xPos, players[queueId].yPos)
			players[queueId].sprite?.setVelocity(players[queueId].xVel, players[queueId].yVel)
		}
		moveQueue = []
	}

	/****** OVERLOADED PHASER FUNCTIONS ******/

	// Scene preloading for textures & keys
	function preload(this: Phaser.Scene) {
		keysInitialisation(this)
		skinsInitialisation(this)
	}

	// Scene creation
	function create(this: Phaser.Scene) {
		createAnims(this)
	}

	let state = false
	// Scene update
	function update(this: Phaser.Scene) {
		checkNewPlayer(this)
		checkDisconnect()
		checkKeyInputs()
		checkMove()
		checkAnims()
		if (!state && players[myId]) {
			this.add.text(0, 0, "side: " + (players[myId].xDir == 'left' ? 'right' : 'left'), { fontSize: "50px" })
			state = true
		}
	}

	/****** PAGE REACT Élément ******/

	// Create the game
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
			game = new Phaser.Game({ ...config, parent: gameRef.current, })
		}
	}

	// Start socket comunication with game server
	const startSocket = () => {
		// Connect to the backend server
		const socket = io('http://localhost:3000/game')

		// ********** BACK TO CLIENT SPECIFIC EVENTS ********** //
		// WORKER x BACK => CLIENT

		// Update the players list with the received data (when connecting for the first time)
		socket.on('currentPlayers', (playersList: player[]) => {
			for (let queueId = 0; queueId < playersList.length; queueId++) {
				players[playersList[queueId].id] = playersList[queueId]
				creationQueue[creationQueue.length] = playersList[queueId].id
				animationQueue[animationQueue.length] = playersList[queueId].id
			}
			console.log("Added ", playersList.length, " players to the creation queue")
		});

		// Get the player's own ID
		socket.on('ownID', (playerId) => {
			myId = playerId
			console.log("My id:", myId)
			socket.emit('identification', loginID)
		})

		// Changes the player's animation on movement chance
		socket.on('playerStarted', (playerId: string) => {
			players[playerId].anim = 'RunAnim'
			animationQueue[animationQueue.length] = playerId
			console.log("A player started moving:", playerId)
		})

		// Changes the player's animation on movement chance
		socket.on('playerStoped', (playerId: string) => {
			players[playerId].anim = 'IdleAnim'
			animationQueue[animationQueue.length] = playerId
			console.log("A player stoped moving:", playerId)
		})

		// ********** BACK TO ALL EVENTS ********** //
		// WORKER <= BACK => CLIENT

		// Add a new player to the players list
		socket.on('newPlayer', (player: player) => {
			players[player.id] = player
			creationQueue[creationQueue.length] = player.id
			animationQueue[animationQueue.length] = player.id
			console.log("A new player connected")
		})

		// Remove the disconnected player from the players list
		socket.on('playerDisconnected', (playerId: string) => {
			deletionQueue[deletionQueue.length] = playerId
			console.log("A player has disconnected")
		});

		// ********** WORKER TO CLIENT EVENTS ********** //
		// WORKER => BACK => CLIENT

		// Update the moved player's velocity in the players list
		socket.on('playerMoved', (playerList: { [key: string]: player }, playerIds: string[]) => {
			for (let playerId of playerIds) {
				players[playerId].xPos = playerList[playerId].xPos
				players[playerId].yPos = playerList[playerId].yPos
				players[playerId].xVel = playerList[playerId].xVel
				players[playerId].yVel = playerList[playerId].yVel
				moveQueue[moveQueue.length] = playerId
			}
		})

		return socket
	}

	// Construction of the whole page
	useEffect(() => {
		createGame()
		comSocket = startSocket()
		return () => {
			if (game) {
				keys.up.destroy()
				keys.down.destroy()
				keys.left.destroy()
				keys.down.destroy()
				for (let playerId in players)
					players[playerId].sprite?.destroy()
				game.destroy(true, false)
			}
			comSocket.disconnect()
		}
	}, [])

	// React game element
	return (
		<main className="game main" ref={gameRef}>
		</main>
	)
}

export default Party
