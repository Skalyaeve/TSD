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

import Boreas_front_Sheet from '../resources/assets/game/character/Boreas/front.png'
import Boreas_back_Sheet from '../resources/assets/game/character/Boreas/back.png'
import Boreas_left_Sheet from '../resources/assets/game/character/Boreas/left.png'
import Boreas_right_Sheet from '../resources/assets/game/character/Boreas/right.png'
import { Socket } from 'socket.io-client'


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

interface newSkin {
	name: string
	frontSheet: string
	backSheet: string
	leftSheet: string
	rightSheet: string
	xSize: number
	ySize: number
	scaleFactor: number
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

interface playerDirections {
	left: "up" | "down" | "left" | "right" | "none" | undefined
	right: "up" | "down" | "left" | "right" | "none" | undefined
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

interface newDirection {
	left: "up" | "down" | "left" | "right" | "none" | undefined
	right: "up" | "down" | "left" | "right" | "none" | undefined
}

// New properties (sent by the client to the back)
interface newPropsFromClient {
	keys: keyStates,
	dir: "up" | "down" | "left" | "right" | "none" | undefined
}

// New properties (sent by the back to the client)
interface newPropsToClient {
	leftProps: objectProps						// Left player properties
	rightProps: objectProps						// Right player properties
	ballProps: objectProps						// Ball properties
}

// Properties of a game object (sent to the client)
interface objectProps {
	xPos: number
	yPos: number
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
	const skinFrameNumber: number = 3

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
	let skins: { [key: string]: newSkin } = {}

	// Player event queues
	let creationQueue: creationQueue = {
		left: undefined,
		right: undefined
	}
	let moveQueue: newPropsToClient | undefined = undefined

	let animationQueue: playerDirections = {
		left: undefined,
		right: undefined
	}

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
		skins['Boreas'] = {
			name: 'Boreas',
			frontSheet: Boreas_front_Sheet,
			backSheet: Boreas_back_Sheet,
			leftSheet: Boreas_left_Sheet,
			rightSheet: Boreas_right_Sheet,
			xSize: 16,
			ySize: 20,
			scaleFactor: 5
		}
		for (let skinName in skins) {
			scene.load.spritesheet(skinName + '_front', skins[skinName].frontSheet, { frameWidth: skins[skinName].xSize, frameHeight: skins[skinName].ySize })
			scene.load.spritesheet(skinName + '_back', skins[skinName].backSheet, { frameWidth: skins[skinName].xSize, frameHeight: skins[skinName].ySize })
			scene.load.spritesheet(skinName + '_left', skins[skinName].leftSheet, { frameWidth: skins[skinName].xSize, frameHeight: skins[skinName].ySize })
			scene.load.spritesheet(skinName + '_right', skins[skinName].rightSheet, { frameWidth: skins[skinName].xSize, frameHeight: skins[skinName].ySize })
		}
	}

	function ballInitialisation(scene: Phaser.Scene) {
		scene.load.spritesheet('ball', ball__Sheet, { frameWidth: 52, frameHeight: 52 })
	}

	/****** SCENE CREATION ******/

	// Create players for this scene
	function createPlayer(construct: playerConstruct, scene: Phaser.Scene) {
		let newPlayer: player = {
			xDir: (construct.side == 'left' ? 'right' : 'left'),
			lastMove: "none",
			move: "idle",
			skin: construct.skin,
			anim: "IdleAnim"
		}
		let skin = skins[newPlayer.skin]
		let xPos = (construct.side == 'left' ? 250 : 1670)
		let yPos = 540
		newPlayer.sprite = scene.physics.add.sprite(xPos, yPos, newPlayer.skin + '_' + newPlayer.xDir)
		newPlayer.sprite.setScale(skin.scaleFactor, skin.scaleFactor)
		newPlayer.sprite.setBounce(1)
		newPlayer.sprite.setCollideWorldBounds(true)
		newPlayer.sprite.setImmovable(true)
		if (construct.side == 'left')
			leftPlayer = newPlayer
		else
			rightPlayer = newPlayer
	}

	function createBall(scene: Phaser.Scene) {
		ball = {
			sprite: scene.physics.add.sprite(960, 540, 'ball')
		}
		ball.sprite?.body?.setCircle(26)
		ball.sprite?.setBounce(1, 1)
		ball.sprite?.setCollideWorldBounds(true, undefined, undefined, undefined)
	}

	// Create animation for this scene
	function createAnims(scene: Phaser.Scene) {
		for (let skinName in skins) {
			scene.anims.create({
				key: skinName + '_downAnim',
				frames: scene.anims.generateFrameNumbers(skinName + '_front', { start: 0, end: skinFrameNumber - 1 }),
				frameRate: skinFrameNumber * 2,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + '_upAnim',
				frames: scene.anims.generateFrameNumbers(skinName + '_back', { start: 0, end: skinFrameNumber - 1 }),
				frameRate: skinFrameNumber * 2,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + '_leftAnim',
				frames: scene.anims.generateFrameNumbers(skinName + '_left', { start: 0, end: skinFrameNumber - 1 }),
				frameRate: skinFrameNumber * 2,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + '_rightAnim',
				frames: scene.anims.generateFrameNumbers(skinName + '_right', { start: 0, end: skinFrameNumber - 1 }),
				frameRate: skinFrameNumber * 2,
				repeat: -1
			})
		}
	}

	// Check if directional keys are pressed
	function allKeysUp(): boolean {
		return (keys.up.isUp && keys.down.isUp && keys.left.isUp && keys.right.isUp)
	}

	// Send player movements to the server
	function sendPlayerMovement(direction: "up" | "down" | "left" | "right" | "none" | undefined): void {
		let props: newPropsFromClient = {
			keys: actualKeyStates,
			dir: direction
		}
		gameSocket?.emit('playerKeyUpdate', props)
	}

	// Send player stop to the server
	const sendPlayerStop = (): void => {
		gameSocket?.emit('playerStop')
	}

	/****** SCENE UPDATE ******/

	function getDirection(): "up" | "down" | "left" | "right" | "none" | undefined {
		if (allKeysUp())
			return "none"
		else if (!oldKeyStates.left && actualKeyStates.left)
			return "left"
		else if (!oldKeyStates.right && actualKeyStates.right)
			return "right"
		else if (!oldKeyStates.up && actualKeyStates.up)
			return "up"
		else if (!oldKeyStates.down && actualKeyStates.down)
			return "down"
		return undefined
	}

	// Adapts player moveState and devolity following the pressed keys
	function checkKeyInputs(): void {
		if (leftPlayer && rightPlayer) {
			oldKeyStates = Object.assign({}, actualKeyStates)
			actualKeyStates.up = keys.up.isDown
			actualKeyStates.down = keys.down.isDown
			actualKeyStates.left = keys.left.isDown
			actualKeyStates.right = keys.right.isDown
			if (actualKeyStates.up != oldKeyStates.up ||
				actualKeyStates.down != oldKeyStates.down ||
				actualKeyStates.left != oldKeyStates.left ||
				actualKeyStates.right != oldKeyStates.right) {
				sendPlayerMovement(getDirection())
			}
			if (allKeysUp())
				sendPlayerStop()
		}
	}

	// Create new player upon connection
	function checkNewPlayer(scene: Phaser.Scene): void {
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
	function checkAnims() {
		if (leftPlayer && rightPlayer) {
			if (animationQueue.left != undefined) {
				if (animationQueue.left != "none") {
					console.log("new left")
					console.log(leftPlayer.skin + "_" + animationQueue.left + "Anim")
					leftPlayer.sprite?.play(leftPlayer.skin + "_" + animationQueue.left + "Anim")
				}
				else {
					console.log("left stop")
					leftPlayer.sprite?.stop()
				}
				animationQueue.left = undefined
			}
			if (animationQueue.right != undefined) {
				if (animationQueue.right != "none") {
					console.log("new right")
					console.log(rightPlayer.skin + "_" + animationQueue.right + "Anim")
					leftPlayer.sprite?.play(rightPlayer.skin + "_" + animationQueue.right + "Anim")
				}
				else {
					console.log("right stop")
					rightPlayer.sprite?.stop()
				}
				animationQueue.right = undefined
			}
		}
	}

	// Set player position following xPos and yPos
	function checkMove(): void {
		if (moveQueue && leftPlayer && rightPlayer /*&& ball*/) {
			let skin: newSkin = skins[leftPlayer.skin]
			let xOffset: number = skin.xSize / 2 * skin.scaleFactor
			let yOffset: number = skin.xSize / 2 * skin.scaleFactor
			leftPlayer.sprite?.setPosition(moveQueue.leftProps.xPos + xOffset, moveQueue.leftProps.yPos + yOffset)

			skin = skins[rightPlayer.skin]
			xOffset = skin.xSize / 2 * skin.scaleFactor
			yOffset = skin.xSize / 2 * skin.scaleFactor
			rightPlayer.sprite?.setPosition(moveQueue.rightProps.xPos + xOffset, moveQueue.rightProps.yPos + yOffset)

			ball?.sprite?.setPosition(moveQueue.ballProps.xPos, moveQueue.ballProps.yPos)
			moveQueue = undefined
		}
	}

	/****** OVERLOADED PHASER FUNCTIONS ******/

	// Scene preloading for textures & keys
	function preload(this: Phaser.Scene): void {
		keysInitialisation(this)
		skinsInitialisation(this)
		ballInitialisation(this)
	}

	// Scene creation
	function create(this: Phaser.Scene): void {
		createBall(this)
		createAnims(this)
	}

	// Scene update
	function update(this: Phaser.Scene): void {
		checkNewPlayer(this)
		//checkDisconnect()
		checkKeyInputs()
		checkMove()
		checkAnims()
	}

	/****** PAGE REACT Élément ******/

	// Create the game
	function createGame(): void {
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
	function socketListeners(): Socket | undefined {

		// Creates player
		gameSocket?.on('playerConstruct', (construct: playerConstruct) => {
			if (construct.side == 'left')
				creationQueue.left = construct
			else
				creationQueue.right = construct
		})

		// Remove the disconnected player from the players list
		/*socket.on('playerDisconnected', (playerId: string) => {
			deletionQueue[deletionQueue.length] = playerId
			console.log("A player has disconnected")
		});*/

		// Update the moved player's position
		gameSocket?.on('newProps', (properties: newPropsToClient) => {
			moveQueue = properties
		})

		// Adapts directionof the player
		gameSocket?.on('changeDirection', (dir: newDirection) => {
			if (dir.left != undefined)
				animationQueue.left = dir.left
			if (dir.right != undefined)
				animationQueue.right = dir.right
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
