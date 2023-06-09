/* -------------------------LIBRARIES IMPORTS------------------------- */

import React, { useEffect, useRef } from 'react'
import Phaser, { Game } from 'phaser'
import { setGameSocket, gameSocket } from './Matchmaker.tsx'
import { setInGame } from './Root.tsx'

/* -------------------------ASSETS IMPORTS------------------------- */

// Text sheets
import goal_text_Sheet from '../resources/assets/game/Goal.png'
import blocked_text_Sheet from '../resources/assets/ui/text/blocked.png'
import one_text_Sheet from '../resources/assets/ui/text/1.png'
import two_text_Sheet from '../resources/assets/ui/text/2.png'
import three_text_Sheet from '../resources/assets/ui/text/3.png'
import fight_text_Sheet from '../resources/assets/ui/text/fight.png'
import victory_text_Sheet from '../resources/assets/game/victory.png'
import defeat_text_Sheet from '../resources/assets/game/defeat.png'

// Debug sheet
import player_debug_Sheet from '../resources/assets/game/blank.png'

// Spritesheets
import ball__Sheet from '../resources/assets/game/basicBall.png'

// ----- Boreas
import Boreas_front_Sheet from '../resources/assets/game/character/Boreas/front.png'
import Boreas_back_Sheet from '../resources/assets/game/character/Boreas/back.png'
import Boreas_left_Sheet from '../resources/assets/game/character/Boreas/left.png'
import Boreas_right_Sheet from '../resources/assets/game/character/Boreas/right.png'

// ----- Faeleen
import Faeleen_front_Sheet from '../resources/assets/game/character/Faeleen/front.png'
import Faeleen_back_Sheet from '../resources/assets/game/character/Faeleen/back.png'
import Faeleen_left_Sheet from '../resources/assets/game/character/Faeleen/left.png'
import Faeleen_right_Sheet from '../resources/assets/game/character/Faeleen/right.png'

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
import { useNavigate } from 'react-router-dom'


/* -------------------------TYPES------------------------- */

type Size = { width: number, height: number }
type Coordinates = { x: number, y: number }
type Side = 'left' | 'right'
type Direction = 'up' | 'down' | 'left' | 'right' | 'none'
type GameState = 'init' | 'ready' | 'created' | 'started' | 'stopped'
type GameEvent = 'goal' | 'blocked' | '3' | '2' | '1' | 'fight' | 'stop' | 'victory' | 'defeat'

// Keys
interface keys {													// Keyboard keys
	up: Phaser.Input.Keyboard.Key									// UP key
	down: Phaser.Input.Keyboard.Key									// DOWN key
	left: Phaser.Input.Keyboard.Key									// LEFT key
	right: Phaser.Input.Keyboard.Key								// RIGHT key
}

// Characters
interface character {
	name: string													// Character name
	frontSheet: string												// Character front sheet
	frontSize: Size
	backSheet: string												// Character back sheet
	backSize: Size
	leftSheet: string												// Character left sheet
	leftSize: Size
	rightSheet: string												// Character right sheet
	rightSize: Size
	scaleFactor: number												// Character sheet scale factor
}

// Players
interface player {
	direction: Direction											// Player direction
	character: string													// Player character name
	sprite?: Phaser.Physics.Arcade.Sprite 							// Player sprite
}

// Direction of a player
interface playerDirections {
	left: Direction | undefined										// Left player direction
	right: Direction | undefined									// Right player direction
}

// Simple interface for a game object
interface simpleGameObject {
	sprite?: Phaser.Physics.Arcade.Sprite							// Game object sprite
}

// Player key states
interface keyStates {
	up: boolean														// Player UP key state
	down: boolean													// Player DOWN key state
	left: boolean													// Player LEFT key state
	right: boolean													// Player RIGHT key state
}

// Characters creation queue
interface creationQueue {
	left: playerConstruct | undefined								// Left player construct
	right: playerConstruct | undefined								// Right player construct
}

// New properties (sent to the back)
interface newPropsFromClient {
	keys: keyStates,												// New key states to send
	dir: Direction | undefined										// New direction to send
}

// Player constructor (sent by the back)
interface playerConstruct {
	id: string														// Player ID
	side: Side														// Player side
	character: string													// Character name
}

// New properties (sent by the back)
interface newPropsToClient {
	leftProps: Coordinates											// Left player properties
	rightProps: Coordinates											// Right player properties
	ballProps: Coordinates											// Ball properties
}

/* -------------------------GAME INITIALISATION------------------------- */
type lifeType = number | 'init'
interface playerLife {
	left: lifeType
	right: lifeType
}
interface PartyProps {
	setPlayerLife: React.Dispatch<React.SetStateAction<playerLife>>
}
const Party: React.FC<PartyProps> = ({
	setPlayerLife
}) => {

	/****** VARIABLES ******/

	// React variables
	const gameRef = useRef<HTMLDivElement>(null)
	const navigate = useNavigate()
	let game: Phaser.Game

	// Canvas constants
	const screenWidth: number = 1920
	const screenHeight: number = 1080
	const characterFrameNumber: number = 3
	const animFramRate: number = 4
	const playerScaleFactor: number = 7
	const ballRay: number = 26

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

	// Ball
	let ball: simpleGameObject | undefined = undefined

	// Text
	let text: simpleGameObject | undefined = undefined
	let textAction: 'display' | 'remove' | undefined = undefined
	let textEvent: GameEvent | undefined = undefined

	// Characters
	let characters: { [key: string]: character } = {}

	// Player event queues
	let moveQueue: newPropsToClient | undefined = undefined
	let creationQueue: creationQueue = {
		left: undefined,
		right: undefined
	}
	let animationQueue: playerDirections = {
		left: undefined,
		right: undefined
	}

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

	// Initialise all characters of the scene
	function charactersInitialisation(scene: Phaser.Scene) {
		characters['Test'] = {
			name: 'Test',
			frontSheet: player_debug_Sheet,
			frontSize: {
				width: 25,
				height: 25
			},
			backSheet: player_debug_Sheet,
			backSize: {
				width: 25,
				height: 25
			},
			leftSheet: player_debug_Sheet,
			leftSize: {
				width: 25,
				height: 25
			},
			rightSheet: player_debug_Sheet,
			rightSize: {
				width: 25,
				height: 25
			},
			scaleFactor: 5
		}
		characters['Boreas'] = {
			name: 'Boreas',
			frontSheet: Boreas_front_Sheet,
			frontSize: {
				width: 16,
				height: 20
			},
			backSheet: Boreas_back_Sheet,
			backSize: {
				width: 16,
				height: 19
			},
			leftSheet: Boreas_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				height: 19
			},
			rightSheet: Boreas_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				height: 19
			},
			scaleFactor: playerScaleFactor
		}
		characters['Faeleen'] = {
			name: 'Faeleen',
			frontSheet: Faeleen_front_Sheet,
			frontSize: {
				width: 16,
				height: 18
			},
			backSheet: Faeleen_back_Sheet,
			backSize: {
				width: 16,
				height: 18
			},
			leftSheet: Faeleen_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			rightSheet: Faeleen_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			scaleFactor: playerScaleFactor
		}
		characters['Garrick'] = {
			name: 'Garrick',
			frontSheet: Garrick_front_Sheet,
			frontSize: {
				width: 16,
				height: 19
			},
			backSheet: Garrick_back_Sheet,
			backSize: {
				width: 16,
				height: 19
			},
			leftSheet: Garrick_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				height: 19
			},
			rightSheet: Garrick_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				height: 19
			},
			scaleFactor: playerScaleFactor
		}
		characters['Helios'] = {
			name: 'Helios',
			frontSheet: Helios_front_Sheet,
			frontSize: {
				width: 16,
				height: 20
			},
			backSheet: Helios_back_Sheet,
			backSize: {
				width: 16,
				height: 19
			},
			leftSheet: Helios_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				height: 19
			},
			rightSheet: Helios_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				height: 19
			},
			scaleFactor: playerScaleFactor
		}
		characters['Liliana'] = {
			name: 'Liliana',
			frontSheet: Liliana_front_Sheet,
			frontSize: {
				width: 16,
				height: 18
			},
			backSheet: Liliana_back_Sheet,
			backSize: {
				width: 16,
				height: 18
			},
			leftSheet: Liliana_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			rightSheet: Liliana_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			scaleFactor: playerScaleFactor
		}
		characters['Orion'] = {
			name: 'Orion',
			frontSheet: Orion_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			backSheet: Orion_back_Sheet,
			backSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			leftSheet: Orion_left_Sheet,
			leftSize: {
				width: 15,
				height: 18
			},
			rightSheet: Orion_right_Sheet,
			rightSize: {
				width: 15,
				height: 18
			},
			scaleFactor: playerScaleFactor
		}
		characters['Rylan'] = {
			name: 'Rylan',
			frontSheet: Rylan_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			backSheet: Rylan_back_Sheet,
			backSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			leftSheet: Rylan_left_Sheet,
			leftSize: {
				width: 15,
				height: 18
			},
			rightSheet: Rylan_right_Sheet,
			rightSize: {
				width: 15,
				height: 18
			},
			scaleFactor: playerScaleFactor
		}
		characters['Selene'] = {
			name: 'Selene',
			frontSheet: Selene_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			backSheet: Selene_back_Sheet,
			backSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			leftSheet: Selene_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			rightSheet: Selene_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			scaleFactor: playerScaleFactor
		}
		characters['Thorian'] = {
			name: 'Thorian',
			frontSheet: Thorian_front_Sheet,
			frontSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			backSheet: Thorian_back_Sheet,
			backSize: {
				width: 16,
				height: 18
			},
			leftSheet: Thorian_left_Sheet,
			leftSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			rightSheet: Thorian_right_Sheet,
			rightSize: {
				width: 15, // A CORRIGER
				height: 18
			},
			scaleFactor: playerScaleFactor
		}
		for (let characterName in characters) {
			let character = characters[characterName]
			scene.load.spritesheet(characterName + '_front', character.frontSheet, { frameWidth: character.frontSize.width, frameHeight: character.frontSize.height })
			scene.load.spritesheet(characterName + '_back', character.backSheet, { frameWidth: character.backSize.width, frameHeight: character.backSize.height })
			scene.load.spritesheet(characterName + '_left', character.leftSheet, { frameWidth: character.leftSize.width, frameHeight: character.leftSize.height })
			scene.load.spritesheet(characterName + '_right', character.rightSheet, { frameWidth: character.rightSize.width, frameHeight: character.rightSize.height })
		}
	}

	// Load the ball spritesheet
	function ballInitialisation(scene: Phaser.Scene) {
		scene.load.spritesheet('ball', ball__Sheet, { frameWidth: 52, frameHeight: 52 })
	}

	function textInitialisation(scene: Phaser.Scene) {
		scene.load.spritesheet('goal', goal_text_Sheet, { frameWidth: 153, frameHeight: 54 })
		scene.load.spritesheet('blocked', blocked_text_Sheet, { frameWidth: 345, frameHeight: 69 })
		scene.load.spritesheet('1', one_text_Sheet, { frameWidth: 30, frameHeight: 76 })
		scene.load.spritesheet('2', two_text_Sheet, { frameWidth: 50, frameHeight: 76 })
		scene.load.spritesheet('3', three_text_Sheet, { frameWidth: 50, frameHeight: 76 })
		scene.load.spritesheet('fight', fight_text_Sheet, { frameWidth: 222, frameHeight: 69 })
		scene.load.spritesheet('victory', victory_text_Sheet, { frameWidth: 182, frameHeight: 55 })
		scene.load.spritesheet('defeat', defeat_text_Sheet, { frameWidth: 164, frameHeight: 46 })
	}

	/****** SCENE CREATION ******/

	// Create a player in the scene from a player construct
	function createPlayer(construct: playerConstruct, scene: Phaser.Scene) {
		let newPlayer: player = {
			direction: (construct.side == 'left' ? 'right' : 'left'),
			character: construct.character,
		}
		let character = characters[newPlayer.character]
		let xPos = (construct.side == 'left' ? 250 : 1670)
		let yPos = 540
		newPlayer.sprite = scene.physics.add.sprite(xPos, yPos, newPlayer.character + '_' + (construct.side == 'left' ? 'right' : 'left'))
		newPlayer.sprite.setScale(character.scaleFactor, character.scaleFactor)
		newPlayer.sprite.setBounce(1)
		newPlayer.sprite.setCollideWorldBounds(true)
		newPlayer.sprite.setImmovable(true)
		if (construct.side == 'left')
			leftPlayer = newPlayer
		else
			rightPlayer = newPlayer
		if (leftPlayer && rightPlayer)
			sendState('created')
	}

	// Create the ball in the scene
	function createBall(scene: Phaser.Scene) {
		ball = { sprite: scene.physics.add.sprite(screenWidth / 2, screenHeight / 2, 'ball') }
		ball.sprite?.body?.setCircle(ballRay)
		ball.sprite?.setBounce(1, 1)
		ball.sprite?.setCollideWorldBounds(true, undefined, undefined, undefined)
	}

	// Create the ball in the scene
	function createText(scene: Phaser.Scene, event: GameEvent) {
		if (text != undefined)
			destroyText()
		text = { sprite: scene.physics.add.sprite(screenWidth / 2, screenHeight / 2, event) }
		text.sprite?.setScale(2, 2)
	}

	function destroyText() {
		text?.sprite?.destroy()
		text = undefined
	}

	// Create animations in the scene
	function createAnims(scene: Phaser.Scene) {
		for (let characterName in characters) {
			scene.anims.create({
				key: characterName + '_downAnim',
				frames: scene.anims.generateFrameNumbers(characterName + '_front', { start: 0, end: characterFrameNumber - 1 }),
				frameRate: characterFrameNumber * animFramRate,
				repeat: -1
			})
			scene.anims.create({
				key: characterName + '_upAnim',
				frames: scene.anims.generateFrameNumbers(characterName + '_back', { start: 0, end: characterFrameNumber - 1 }),
				frameRate: characterFrameNumber * animFramRate,
				repeat: -1
			})
			scene.anims.create({
				key: characterName + '_leftAnim',
				frames: scene.anims.generateFrameNumbers(characterName + '_left', { start: 0, end: characterFrameNumber - 1 }),
				frameRate: characterFrameNumber * animFramRate,
				repeat: -1
			})
			scene.anims.create({
				key: characterName + '_rightAnim',
				frames: scene.anims.generateFrameNumbers(characterName + '_right', { start: 0, end: characterFrameNumber - 1 }),
				frameRate: characterFrameNumber * animFramRate,
				repeat: -1
			})
		}
	}

	// Check if directional keys are pressed
	function allKeysUp(): boolean {
		return (keys.up.isUp && keys.down.isUp && keys.left.isUp && keys.right.isUp)
	}

	// Send player movements to the back
	function sendPlayerMovement(direction: Direction | undefined) {
		let props: newPropsFromClient = {
			keys: actualKeyStates,
			dir: direction
		}
		gameSocket?.emit('playerKeyUpdate', props)
	}

	// Send player stop to the back
	const sendPlayerStop = () => {
		gameSocket?.emit('playerStop')
	}

	// Send game state to the back
	const sendState = (state: GameState) => {
		gameSocket?.emit('playerStateUpdate', state)
	}

	/****** SCENE UPDATE ******/

	// Get direction of the player from actual and old key states
	function getDirection(): Direction | undefined {
		if (allKeysUp())
			return 'none'
		else if (!oldKeyStates.left && actualKeyStates.left)
			return 'left'
		else if (!oldKeyStates.right && actualKeyStates.right)
			return 'right'
		else if (!oldKeyStates.up && actualKeyStates.up)
			return 'up'
		else if (!oldKeyStates.down && actualKeyStates.down)
			return 'down'
		return undefined
	}

	// Adapts player moveState and devolity following the pressed keys
	function checkKeyInputs() {
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

	// Set player animations following anim state
	function checkAnims() {
		if (leftPlayer && rightPlayer) {
			if (animationQueue.left != undefined) {
				if (animationQueue.left != 'none') {
					leftPlayer.direction = animationQueue.left
					leftPlayer.sprite?.play(leftPlayer.character + '_' + animationQueue.left + 'Anim')
				}
				else leftPlayer.sprite?.stop()
				animationQueue.left = undefined
			}
			if (animationQueue.right != undefined) {
				if (animationQueue.right != 'none') {
					rightPlayer.direction = animationQueue.right
					rightPlayer.sprite?.play(rightPlayer.character + '_' + animationQueue.right + 'Anim')
				}
				else rightPlayer.sprite?.stop()
				animationQueue.right = undefined
			}
		}
	}

	function checkText(scene: Phaser.Scene) {
		if (textAction && textEvent) {
			switch (textAction) {
				case ('display'):
					createText(scene, textEvent)
					textAction = undefined
					textEvent = undefined
					break
				case ('remove'):
					destroyText()
					textAction = undefined
					textEvent = undefined
					break
			}
		}
	}

	// Get sheet size for each character (WILL BE DELETED)
	function getSheetSize(player: player): Size {
		let character: character = characters[player.character]
		let sheetSize: Size
		switch (player.direction) {
			case 'up':
				sheetSize = character.backSize
				break
			case 'down':
				sheetSize = character.frontSize
				break
			case 'left':
				sheetSize = character.leftSize
				break
			case 'right':
				sheetSize = character.rightSize
				break
			default:
				sheetSize = character.frontSize
		}
		return sheetSize
	}

	function setPlayerPosition(player: player, coords: Coordinates) {
		let sheetSize: Size = getSheetSize(player)
		let xOffset: number = sheetSize.width * characters[player.character].scaleFactor / 2
		let yOffset: number = sheetSize.height * characters[player.character].scaleFactor / 2
		player.sprite?.setPosition(coords.x + xOffset, coords.y + yOffset)
	}

	// Set player position following xPos and yPos
	function checkMove() {
		if (moveQueue && leftPlayer && rightPlayer && ball) {
			setPlayerPosition(leftPlayer, moveQueue.leftProps)
			setPlayerPosition(rightPlayer, moveQueue.rightProps)
			ball.sprite?.setPosition(moveQueue.ballProps.x + ballRay, moveQueue.ballProps.y + ballRay)
			moveQueue = undefined
		}
	}

	/****** OVERLOADED PHASER FUNCTIONS ******/

	// Scene preloading for textures, keys & ball
	function preload(this: Phaser.Scene) {
		keysInitialisation(this)
		charactersInitialisation(this)
		ballInitialisation(this)
		textInitialisation(this)
	}

	// Scene creation
	function create(this: Phaser.Scene) {
		createBall(this)
		createAnims(this)
		sendState('ready')
	}

	// Scene update
	function update(this: Phaser.Scene) {
		if (!leftPlayer || !rightPlayer)
			checkNewPlayer(this)
		checkKeyInputs()
		checkMove()
		checkAnims()
		checkText(this)
	}

	/****** PAGE REACT Élément ******/

	// Create the game
	function createGame() {
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
	function socketListeners() {
		// Creates player
		gameSocket?.on('playerConstruct', (construct: playerConstruct) => {
			if (construct.side == 'left')
				creationQueue.left = construct
			else
				creationQueue.right = construct
		})
		// Update the moved player's position
		gameSocket?.on('newProps', (properties: newPropsToClient) => {
			moveQueue = properties
		})
		// Adapts direction of the player
		gameSocket?.on('changeDirection', (dir: playerDirections) => {
			if (dir.left != undefined)
				animationQueue.left = dir.left
			else
				animationQueue.left = undefined
			if (dir.right != undefined)
				animationQueue.right = dir.right
			else
				animationQueue.right = undefined
		})
		// Displays a game event on the scene
		gameSocket?.on('eventOn', (payload: GameEvent) => {
			textEvent = payload
			textAction = 'display'
		})
		// Removes a game event on the scene
		gameSocket?.on('eventOff', () => {
			textEvent = 'stop'
			textAction = 'remove'
		})
		// Get the user back on the main page after end of a game
		gameSocket?.on('gameStopped', () => {
			gameSocket?.disconnect()
			setGameSocket(undefined)
			setInGame(false)
			navigate('/')
		})
		gameSocket?.on('lifeUpdate', (update: playerLife) => {
			setPlayerLife(update)
		})
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
				ball?.sprite?.destroy()
				leftPlayer?.sprite?.destroy()
				rightPlayer?.sprite?.destroy()
				game.destroy(true, false)
			}
		}
	}, [])

	// React game element
	return (
		<main className='game main' ref={gameRef} />
	)
}

export default Party
