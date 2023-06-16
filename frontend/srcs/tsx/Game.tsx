/* -------------------------LIBRARIES IMPORTS------------------------- */

import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameSocket } from './Matchmaker.tsx'

/* -------------------------ASSETS IMPORTS------------------------- */

// Images && Spritesheets
import playerIdle__Sheet from '../resources/assets/game/playerSheet.png'
import playerRun__Sheet from '../resources/assets/game/playerSheet.png'
import mageIdle__Sheet from '../resources/assets/game/Mage/Idle.png'
import mageRun__Sheet from '../resources/assets/game/Mage/Run.png'
import blank__Sheet from '../resources/assets/game/blank.png'
import black__Sheet from '../resources/assets/game/black.png'
import ball__Sheet from '../resources/assets/game/basicBall.png'


/* -------------------------TYPES------------------------- */

// Keys
interface keys {								// Keyboard keys
	up: Phaser.Input.Keyboard.Key				// UP key
	down: Phaser.Input.Keyboard.Key				// DOWN key
	left: Phaser.Input.Keyboard.Key				// LEFT key
	right: Phaser.Input.Keyboard.Key			// RIGHT key
}

// Skins
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

// Players
interface player {
	xDir: "left" | "right"						// Player X direction (left/right)
	lastMove: "none" | "idle" | "run"			// Player last movement state (none/idle/run)
	move: "idle" | "run"						// Player actual movement state (idle/run)
	skin: string								// Player skin name
	anim: "RunAnim" | "IdleAnim"				// Player actual animation
	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
}

// Player constructor
interface playerConstruct {
	id: string									// Player ID
	side: "left" | "right"						// Player side
	skin: "player" | "mage" | "blank" | "black"	// Skin name
}

// Ball
interface ball {
	sprite?: Phaser.Physics.Arcade.Sprite		// Ball sprite
}

// Player key states
interface keyStates {
	up: boolean									// Player UP key state
	down: boolean								// Player DOWN key state
	left: boolean								// Player LEFT key state
	right: boolean								// Player RIGHT key state
}

// New properties (sent by the back to the client)
interface newPropsToClient {
	leftProps: objectProps						// Left player properties
	rightProps: objectProps						// Right player properties
	ballProps: objectProps						// Ball properties
}

// Player update (sent by the client to the back)
interface playerUpdateFromClient {
	keyStates: keyStates						// Player key states
}

// Properties of a game object (sent to the client)
interface objectProps {
	xPos: number
	yPos: number
	xVel: number
	yVel: number
}

interface creationQueue {
	left: playerConstruct | undefined
	right: playerConstruct | undefined
}

/* -------------------------GAME INITIALISATION------------------------- */

function Party() {

	/****** VARIABLES ******/

	// React variables
	const gameRef = useRef<HTMLDivElement>(null)
	let game: Phaser.Game

	// Client type
	const mySkin: string = "mage"
	let mySide: "left" | "right" | undefined = undefined

	// Canvas constants
	const screenWidth: number = 1920
	const screenHeight: number = 1080
	const gameSpeed: number = 1000

	// Keyboard keys
	let keys: keys
	let actualKeyStates: keyStates = {
		up: false,
		down: false,
		left: false,
		right: false
	}
	let oldKeyStates: keyStates = {
		up: false,
		down: false,
		left: false,
		right: false
	}

	// Players
	let leftPlayer: player | undefined = undefined
	let rightPlayer: player | undefined = undefined

	//ball
	let ball: ball | undefined = undefined

	// Skins list
	let skins: { [key: string]: skin } = {}

	// Player event queues
	let creationQueue: creationQueue = {
		left: undefined,
		right: undefined
	}
	let moveQueue: newPropsToClient | undefined = undefined

	let animationQueue: string[] = []
	let deletionQueue: string[] = []

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

	function ballInitialisation(scene: Phaser.Scene){
		scene.load.spritesheet('ball', ball__Sheet, { frameWidth: 52, frameHeight: 52 })
	}

	/****** SCENE CREATION ******/

	// Create players for this scene
	function createPlayer(construct: playerConstruct, scene: Phaser.Scene) {
		let newPlayer: player = {
			xDir: (construct.side == 'left' ? 'right' : 'left'),
			lastMove: "none",
			move: "idle",
			skin: "mage",
			anim: "IdleAnim"
		}
		let skin = skins[newPlayer.skin]
		let xPos = (construct.side == 'left' ? 250 : 1670)
		let yPos = 540
		newPlayer.sprite = scene.physics.add.sprite(xPos, yPos, newPlayer.skin + 'Idle')
		if (newPlayer.sprite.body) {
			newPlayer.sprite.body.setSize(skin.xResize, skin.yResize)
			newPlayer.sprite.body.setOffset(skin.xOffset, skin.yOffset)
		}
		newPlayer.sprite.setScale(skin.scaleFactor, skin.scaleFactor)
		newPlayer.sprite.setBounce(1)
		newPlayer.sprite.setCollideWorldBounds(true)
		newPlayer.sprite.setImmovable(true)
		if (newPlayer.xDir == 'left')
			newPlayer.sprite.setFlipX(true)
		else
			newPlayer.sprite.setFlipX(false)
		if (construct.side == 'left')
			leftPlayer = newPlayer
		else
			rightPlayer = newPlayer
	}

	function createBall(scene: Phaser.Scene){
		ball = {
			sprite: scene.physics.add.sprite(960, 540, 'ball')
		}
		ball.sprite?.body?.setCircle(25)
		ball.sprite?.setBounce(1, 1)
		ball.sprite?.setCollideWorldBounds(true, undefined, undefined, undefined)
	}

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
		gameSocket?.emit('playerKeyUpdate', actualKeyStates)
	}

	// Send player start to the server
	// WORKER x BACK <= CLIENT
	/*const sendPlayerStart = () => {
		players[myId].sprite?.play(players[myId].skin + 'RunAnim')
		gameSocket.emit('playerStart')
	}player.move

	// Send player stop to the server
	// WORKER x BACK <= CLIENT
	const sendPlayerStop = () => {
		players[myId].sprite?.play(players[myId].skin + 'IdleAnim')
		gameSocket.emit('playerStop')
	}*/

	/****** SCENE UPDATE ******/

	// Adapts player moveState and devolity following the pressed keys
	function checkKeyInputs() {
		let player: player
		
		if (leftPlayer && rightPlayer) {
			if (mySide && mySide == 'left')
				player = leftPlayer
			else
				player = rightPlayer

			oldKeyStates = Object.assign({}, actualKeyStates)
			actualKeyStates.up = (keys.up.isDown ? true : false)
			actualKeyStates.down = (keys.down.isDown ? true : false)
			actualKeyStates.left = (keys.left.isDown ? true : false)
			actualKeyStates.right = (keys.right.isDown ? true : false)

			if (actualKeyStates.up != oldKeyStates.up ||
				actualKeyStates.down != oldKeyStates.down ||
				actualKeyStates.left != oldKeyStates.left ||
				actualKeyStates.right != oldKeyStates.right){
					sendPlayerMovement()
				}

			if (allKeysUp()) {
				if (player.move == 'run') {
					//sendPlayerStop()
					player.move = 'idle'
				}
			}
			else {
				if (player.move == 'idle') {
					//sendPlayerStart()
					player.move = 'run'
				}
			}
		}
	}

	// Create new player upon connection
	function checkNewPlayer(scene: Phaser.Scene) {
		if (creationQueue.left) {
			createPlayer(creationQueue.left, scene)
			creationQueue.left = undefined
		}
		if (creationQueue.right) {
			createPlayer(creationQueue.right, scene)
			creationQueue.right = undefined
		}
	}

	// Delete player upon disconnection
	/*function checkDisconnect() {
		if (!deletionQueue.length)
			return
		for (let queueId = 0; queueId < deletionQueue.length; queueId++) {
			players[deletionQueue[queueId]].sprite?.destroy()
			delete players[deletionQueue[queueId]]
		}
		deletionQueue = []
	}*/

	// Set player animations following anim state
	/*function checkAnims() {
		for (let queueId = 0; queueId < animationQueue.length; queueId++) {
			players[animationQueue[queueId]].sprite?.play(players[animationQueue[queueId]].skin + players[animationQueue[queueId]].anim)
		}
		animationQueue = []
	}*/

	// Set player position following xPos and yPos
	function checkMove() {
		if (moveQueue && leftPlayer && rightPlayer /*&& ball*/) {
			console.log('players to move')
			leftPlayer.sprite?.setPosition(moveQueue.leftProps.xPos, moveQueue.leftProps.yPos)
			rightPlayer.sprite?.setPosition(moveQueue.rightProps.xPos, moveQueue.rightProps.yPos)
			ball?.sprite?.setPosition(moveQueue.ballProps.xPos, moveQueue.ballProps.yPos)

			/*leftPlayer.sprite?.setVelocity(moveQueue.leftProps.xVel, moveQueue.leftProps.yVel)
			rightPlayer.sprite?.setVelocity(moveQueue.rightProps.xVel, moveQueue.rightProps.yVel)
			ball?.sprite?.setVelocity(moveQueue.ballProps.xVel, moveQueue.ballProps.yVel)*/
			moveQueue = undefined
		}
	}

	/****** OVERLOADED PHASER FUNCTIONS ******/

	// Scene preloading for textures & keys
	function preload(this: Phaser.Scene) {
		keysInitialisation(this)
		skinsInitialisation(this)
		ballInitialisation(this)
	}

	// Scene creation
	function create(this: Phaser.Scene) {
		createBall(this)
		createAnims(this)
	}

	// Scene update
	function update(this: Phaser.Scene) {
		checkNewPlayer(this)
		//checkDisconnect()
		checkKeyInputs()
		checkMove()
		//checkAnims()
	}

	/****** PAGE REACT Élément ******/

	// Create the game
	const createGame = () => {
		const config: Phaser.Types.Core.GameConfig = {
			type: Phaser.AUTO,
			width: screenWidth,
			height: screenHeight,
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
			audio: {
				noAudio: true
			}
		}
		if (gameRef.current) {
			game = new Phaser.Game({ ...config, parent: gameRef.current, })
		}
	}

	// Start socket comunication with game server
	const socketListeners = () => {
		// ********** BACK TO CLIENT SPECIFIC EVENTS ********** //
		// WORKER <x= BACK ==> CLIENT

		// Changes the player's animation on movement chance
		/*socket.on('playerStarted', (playerId: string) => {
			players[playerId].anim = 'RunAnim'
			animationQueue[animationQueue.length] = playerId
			console.log("A player started moving:", playerId)
		})

		// Changes the player's animation on movement chance
		socket.on('playerStoped', (playerId: string) => {
			players[playerId].anim = 'IdleAnim'
			animationQueue[animationQueue.length] = playerId
			cnsole.log("A player stoped moving:", playerId)
		})*/

		// ********** BACK TO ALL EVENTS ********** //
		// WORKER <== BACK ==> CLIENT

		gameSocket?.on('clientSide', (side: "left" | "right") => {
			mySide = side
		})

		gameSocket?.on('playerConstruct', (construct: playerConstruct) => {
			if (construct.side == 'left')
				creationQueue.left = construct
			else
				creationQueue.right = construct
			console.log("A new player connected to the session")
		})

		// Remove the disconnected player from the players list
		/*socket.on('playerDisconnected', (playerId: string) => {
			deletionQueue[deletionQueue.length] = playerId
			console.log("A player has disconnected")
		});*/

		// ********** WORKER TO CLIENT EVENTS ********** //
		// WORKER ==> BACK ==> CLIENT

		// Update the moved player's velocity in the players list
		gameSocket?.on('newProps', (properties: newPropsToClient) => {
			moveQueue = properties
		})

		return gameSocket
	}

	// Construction of the whole page
	useEffect(() => {
		socketListeners()
		createGame()
		return () => {
			if (game) {
				keys.up.destroy()
				keys.down.destroy()
				keys.left.destroy()
				keys.down.destroy()
				leftPlayer?.sprite?.destroy()
				rightPlayer?.sprite?.destroy()
				game.destroy(true, false)
			}
		}
	}, [])

	// React game element
	return (
		<main className="game main" ref={gameRef} />
	)
}

export default Party
