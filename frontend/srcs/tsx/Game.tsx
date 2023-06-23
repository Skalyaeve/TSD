/* -------------------------LIBRARIES IMPORTS------------------------- */

import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'
import { gameSocket } from './Matchmaker.tsx'
import { Socket } from 'socket.io-client'

/* -------------------------ASSETS IMPORTS------------------------- */

// Spritesheets
import ball__Sheet from '../resources/assets/game/basicBall.png'

// ----- Boreas
import Boreas_front_Sheet from '../resources/assets/game/character/Boreas/front.png'
import Boreas_back_Sheet from '../resources/assets/game/character/Boreas/back.png'
import Boreas_left_Sheet from '../resources/assets/game/character/Boreas/left.png'
import Boreas_right_Sheet from '../resources/assets/game/character/Boreas/right.png'

// ----- Fealeen
import Fealeen_front_Sheet from '../resources/assets/game/character/Fealeen/front.png'
import Fealeen_back_Sheet from '../resources/assets/game/character/Fealeen/back.png'
import Fealeen_left_Sheet from '../resources/assets/game/character/Fealeen/left.png'
import Fealeen_right_Sheet from '../resources/assets/game/character/Fealeen/right.png'

// ----- Garrick
import Garrick_front_Sheet from '../resources/assets/game/character/Garrick/front.png'
import Garrick_back_Sheet from '../resources/assets/game/character/Garrick/back.png'
import Garrick_left_Sheet from '../resources/assets/game/character/Garrick/left.png'
import Garrick_right_Sheet from '../resources/assets/game/character/Garrick/right.png'

// ----- Helios
import Helios_front_Sheet from '../resources/assets/game/character/Helios/front.png'
import Helios_back_Sheet from '../resources/assets/game/character/Helios/back.png'
import Helios_left_Sheet from '../resources/assets/game/character/Helios/left.png'
import Helios_right_Sheet from '../resources/assets/game/character/Helios/right.png'

// ----- Liliana
import Liliana_front_Sheet from '../resources/assets/game/character/Liliana/front.png'
import Liliana_back_Sheet from '../resources/assets/game/character/Liliana/back.png'
import Liliana_left_Sheet from '../resources/assets/game/character/Liliana/left.png'
import Liliana_right_Sheet from '../resources/assets/game/character/Liliana/right.png'

// ----- Orion
import Orion_front_Sheet from '../resources/assets/game/character/Orion/front.png'
import Orion_back_Sheet from '../resources/assets/game/character/Orion/back.png'
import Orion_left_Sheet from '../resources/assets/game/character/Orion/left.png'
import Orion_right_Sheet from '../resources/assets/game/character/Orion/right.png'

// ----- Rylan
import Rylan_front_Sheet from '../resources/assets/game/character/Rylan/front.png'
import Rylan_back_Sheet from '../resources/assets/game/character/Rylan/back.png'
import Rylan_left_Sheet from '../resources/assets/game/character/Rylan/left.png'
import Rylan_right_Sheet from '../resources/assets/game/character/Rylan/right.png'

// ----- Selene
import Selene_front_Sheet from '../resources/assets/game/character/Selene/front.png'
import Selene_back_Sheet from '../resources/assets/game/character/Selene/back.png'
import Selene_left_Sheet from '../resources/assets/game/character/Selene/left.png'
import Selene_right_Sheet from '../resources/assets/game/character/Selene/right.png'

// ----- Thorian
import Thorian_front_Sheet from '../resources/assets/game/character/Thorian/front.png'
import Thorian_back_Sheet from '../resources/assets/game/character/Thorian/back.png'
import Thorian_left_Sheet from '../resources/assets/game/character/Thorian/left.png'
import Thorian_right_Sheet from '../resources/assets/game/character/Thorian/right.png'


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
	name: string
	frontSheet: string
	frontSize: {
		width: number
		heigth: number
	}
	backSheet: string
	backSize: {
		width: number
		heigth: number
	}
	leftSheet: string
	leftSize: {
		width: number
		heigth: number
	}
	rightSheet: string
	rightSize: {
		width: number
		heigth: number
	}
	scaleFactor: number
}

// Players
interface player {
	direction: "up" | "down" | "left" | "right"
	skin: string								// Player skin name
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

interface gameState {
	actualState: string
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

	// Canvas constants
	const screenWidth: number = 1920
	const screenHeight: number = 1080
	const skinFrameNumber: number = 3
	const animFramRate: number = 4

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
			frontSize: {
				width: 16,
				heigth: 20
			},
			backSheet: Boreas_back_Sheet,
			backSize: {
				width: 16,
				heigth: 19
			},
			leftSheet: Boreas_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			rightSheet: Boreas_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			scaleFactor: 7
		}
		skins['Fealeen'] = {
			name: 'Fealeen',
			frontSheet: Fealeen_front_Sheet,
			frontSize: {
				width: 16,
				heigth: 18
			},
			backSheet: Fealeen_back_Sheet,
			backSize: {
				width: 16,
				heigth: 18
			},
			leftSheet: Fealeen_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSheet: Fealeen_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			scaleFactor: 7
		}
		skins['Garrick'] = {
			name: 'Garrick',
			frontSheet: Garrick_front_Sheet,
			frontSize: {
				width: 16,
				heigth: 19
			},
			backSheet: Garrick_back_Sheet,
			backSize: {
				width: 16,
				heigth: 19
			},
			leftSheet: Garrick_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			rightSheet: Garrick_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			scaleFactor: 7
		}
		skins['Helios'] = {
			name: 'Helios',
			frontSheet: Helios_front_Sheet,
			frontSize: {
				width: 16,
				heigth: 20
			},
			backSheet: Helios_back_Sheet,
			backSize: {
				width: 16,
				heigth: 19
			},
			leftSheet: Helios_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			rightSheet: Helios_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			scaleFactor: 7
		}
		skins['Liliana'] = {
			name: 'Liliana',
			frontSheet: Liliana_front_Sheet,
			frontSize: {
				width: 16,
				heigth: 18
			},
			backSheet: Liliana_back_Sheet,
			backSize: {
				width: 16,
				heigth: 18
			},
			leftSheet: Liliana_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSheet: Liliana_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			scaleFactor: 7
		}
		skins['Orion'] = {
			name: 'Orion',
			frontSheet: Orion_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			backSheet: Orion_back_Sheet,
			backSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			leftSheet: Orion_left_Sheet,
			leftSize: {
				width: 15,
				heigth: 18
			},
			rightSheet: Orion_right_Sheet,
			rightSize: {
				width: 15,
				heigth: 18
			},
			scaleFactor: 7
		}
		skins['Rylan'] = {
			name: 'Rylan',
			frontSheet: Rylan_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			backSheet: Rylan_back_Sheet,
			backSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			leftSheet: Rylan_left_Sheet,
			leftSize: {
				width: 15,
				heigth: 18
			},
			rightSheet: Rylan_right_Sheet,
			rightSize: {
				width: 15,
				heigth: 18
			},
			scaleFactor: 7
		}
		skins['Selene'] = {
			name: 'Selene',
			frontSheet: Selene_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			backSheet: Selene_back_Sheet,
			backSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			leftSheet: Selene_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSheet: Selene_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			scaleFactor: 7
		}
		skins['Thorian'] = {
			name: 'Thorian',
			frontSheet: Thorian_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			backSheet: Thorian_back_Sheet,
			backSize: {
				width: 16,
				heigth: 18
			},
			leftSheet: Thorian_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSheet: Thorian_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			scaleFactor: 7
		}
		for (let skinName in skins) {
			let skin = skins[skinName]
			scene.load.spritesheet(skinName + '_front', skin.frontSheet, { frameWidth: skin.frontSize.width, frameHeight: skin.frontSize.heigth })
			scene.load.spritesheet(skinName + '_back', skin.backSheet, { frameWidth: skin.backSize.width, frameHeight: skin.backSize.heigth })
			scene.load.spritesheet(skinName + '_left', skin.leftSheet, { frameWidth: skin.leftSize.width, frameHeight: skin.leftSize.heigth })
			scene.load.spritesheet(skinName + '_right', skin.rightSheet, { frameWidth: skin.rightSize.width, frameHeight: skin.rightSize.heigth })
		}
	}

	function ballInitialisation(scene: Phaser.Scene) {
		scene.load.spritesheet('ball', ball__Sheet, { frameWidth: 52, frameHeight: 52 })
	}

	/****** SCENE CREATION ******/

	// Create players for this scene
	function createPlayer(construct: playerConstruct, scene: Phaser.Scene) {
		let newPlayer: player = {
			direction: (construct.side == 'left' ? 'right' : 'left'),
			skin: construct.skin,
		}
		let skin = skins[newPlayer.skin]
		let xPos = (construct.side == 'left' ? 250 : 1670)
		let yPos = 540
		newPlayer.sprite = scene.physics.add.sprite(xPos, yPos, newPlayer.skin + '_' + (construct.side == 'left' ? 'right' : 'left'))
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
		ball = { sprite: scene.physics.add.sprite(960, 540, 'ball') }
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
				frameRate: skinFrameNumber * animFramRate,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + '_upAnim',
				frames: scene.anims.generateFrameNumbers(skinName + '_back', { start: 0, end: skinFrameNumber - 1 }),
				frameRate: skinFrameNumber * animFramRate,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + '_leftAnim',
				frames: scene.anims.generateFrameNumbers(skinName + '_left', { start: 0, end: skinFrameNumber - 1 }),
				frameRate: skinFrameNumber * animFramRate,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + '_rightAnim',
				frames: scene.anims.generateFrameNumbers(skinName + '_right', { start: 0, end: skinFrameNumber - 1 }),
				frameRate: skinFrameNumber * animFramRate,
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

	const sendReady = (): void => {
		let stateUpdate: gameState = {
			actualState: "ready"
		}
		gameSocket?.emit('playerStateUpdate', stateUpdate)
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
					leftPlayer.direction = animationQueue.left
					leftPlayer.sprite?.play(leftPlayer.skin + "_" + animationQueue.left + "Anim")
				}
				else leftPlayer.sprite?.stop()
				animationQueue.left = undefined
			}
			if (animationQueue.right != undefined) {
				if (animationQueue.right != "none") {
					rightPlayer.direction = animationQueue.right
					rightPlayer.sprite?.play(rightPlayer.skin + "_" + animationQueue.right + "Anim")
				}
				else rightPlayer.sprite?.stop()
				animationQueue.right = undefined
			}
		}
	}

	function getSheetSize(player: player): { width: number, heigth: number } {
		let skin: skin = skins[player.skin]
		let sheetSize: { width: number, heigth: number }
		switch (player.direction) {
			case "up":
				sheetSize = skin.backSize
				break
			case "down":
				sheetSize = skin.frontSize
				break
			case "left":
				sheetSize = skin.leftSize
				break
			case "right":
				sheetSize = skin.rightSize
				break
		}
		return sheetSize
	}

	// Set player position following xPos and yPos
	function checkMove(): void {
		if (moveQueue && leftPlayer && rightPlayer /*&& ball*/) {
			let sheetSize: { width: number, heigth: number } = getSheetSize(leftPlayer)
			let xOffset: number = sheetSize.width / 2 * skins[leftPlayer.skin].scaleFactor
			let yOffset: number = sheetSize.heigth / 2 * skins[leftPlayer.skin].scaleFactor
			leftPlayer.sprite?.setPosition(moveQueue.leftProps.xPos + xOffset, moveQueue.leftProps.yPos + yOffset)

			sheetSize = getSheetSize(rightPlayer)
			xOffset = sheetSize.width / 2 * skins[leftPlayer.skin].scaleFactor
			yOffset = sheetSize.heigth / 2 * skins[leftPlayer.skin].scaleFactor
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
		sendReady()
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
			console.log("new construct:", construct.side)
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
			else
				animationQueue.left = undefined
			if (dir.right != undefined)
				animationQueue.right = dir.right
			else
				animationQueue.right = undefined
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
