/* -------------------------LIBRARIES IMPORTS------------------------- */

import Phaser from 'phaser'
import { parentPort } from 'worker_threads'

/* -------------------------ASSETS IMPORTS------------------------- */

// Images && Spritesheets
import playerIdle__Sheet from './resource/assets/playerSheet.png'
import mageIdle__Sheet from './resource/assets/Mage/Idle.png'
import blank__Sheet from './resource/assets/blank.png'
import black__Sheet from './resource/assets/black.png'

/* -------------------------TYPES------------------------- */

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
	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
	colliders: Phaser.Physics.Arcade.Collider[]	// Player colliders
}

// Game canvas interface
interface canvas {								// Scene canvas settings
	xSize: number								// Canvas heigth
	ySize: number								// Canvas width
	gameSpeed: number							// Game global speed
}

/* -------------------------VARIABLES------------------------- */

// Game variable
let game: Phaser.Game | null = null

// Canvas constants
let canvas: canvas = {
	xSize: 1920,
	ySize: 1080,
	gameSpeed: 1000,
}

// Players list
let players: { [key: string]: player } = {}

// Skins list
let skins: { [key: string]: skin } = {}

// Player event queues
let creationQueue: string[] = []
let moveQueue: string[] = []
let deletionQueue: string[] = []

/* -------------------------SCENE PRELOADING------------------------- */

// Initialise all skins of the scene
function skinsInitialisation(scene: Phaser.Scene) {
	skins['player'] = {
		name: 'player',
		idleSheet: playerIdle__Sheet,
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
	}
}

/* -------------------------SCENE CREATION------------------------- */

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
	player.keyStates.up = false
	player.keyStates.down = false
	player.keyStates.left = false
	player.keyStates.right = false
}

// Check if directional keys are pressed
function allKeysUp(player: player) {
	if (!player.keyStates.up && !player.keyStates.down && !player.keyStates.left && !player.keyStates.right)
		return true
	return false
}

/* -------------------------SCENE UPDATE------------------------- */

// Adapts player moveState and devolity following the pressed keys
function checkKeyInputs() {
	for (let playerId in players) {
		let player = players[playerId]
		let endVelocityX: number = 0
		let endVelocityY: number = 0
		if (player && player.sprite && player.sprite.body) {
			if (allKeysUp(player))
				if (player.move == 'run')
					player.move = 'idle'
				else
					if (player.move == 'idle')
						player.move = 'run'
			if (player.keyStates.left)
				endVelocityX = - canvas.gameSpeed
			if (player.keyStates.right)
				endVelocityX = endVelocityX + canvas.gameSpeed
			if (player.keyStates.up)
				endVelocityY = - canvas.gameSpeed
			if (player.keyStates.down)
				endVelocityY = endVelocityY + canvas.gameSpeed
			if (player.sprite) {
				player.sprite.setVelocity(endVelocityX, endVelocityY)
			}
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

// Set player position following xPos and yPos
function checkMove() {
	for (let queueId of moveQueue) {
		players[queueId].sprite?.setPosition(players[queueId].xPos, players[queueId].yPos)
	}
	moveQueue = []
}

/* -------------------------PHASER FUNCTIONS------------------------- */

// Scene preloading for textures & keys
function preload(this: Phaser.Scene) {
	skinsInitialisation(this)
}

// Scene creation
function create(this: Phaser.Scene) {
}

// Scene update
function update(this: Phaser.Scene) {
	checkNewPlayer(this)
	checkDisconnect()
	checkKeyInputs()
	checkMove()
	//WORK IN PROGRESS HERE
	//checkSendUpdate()
}

/* -------------------------MAIN FUNCTIONS------------------------- */

function createGame() {
	const config: Phaser.Types.Core.GameConfig = {
		type: Phaser.HEADLESS,
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
	game = new Phaser.Game({ ...config })
}

function destroyGame() {
	if (game) {
		for (let playerId in players)
			players[playerId].sprite?.destroy()
		game.destroy(true, false)
		game = null
	}
	if (parentPort)
		parentPort.close
}

function addNewPlayer(player: player) {
	players[player.id] = player
	creationQueue[creationQueue.length] = player.id
	console.log("A new player connected")
}

function disconnectPlayer(playerId: string) {
	deletionQueue[deletionQueue.length] = playerId
	console.log("A player has disconnected")
}

function updatePlayerKeys(playerId: string, keyStates: keyStates) {
	players[playerId].keyStates.up = keyStates.up
	players[playerId].keyStates.down = keyStates.down
	players[playerId].keyStates.left = keyStates.left
	players[playerId].keyStates.right = keyStates.right
	moveQueue[moveQueue.length] = playerId
}

/* -------------------------MAIN FUNCTIONS------------------------- */

if (parentPort) {
	parentPort.on('message', (data) => {
		switch (data.type) {
			case 'destroy':
				destroyGame()
				break
			case 'newPlayer':
				addNewPlayer(data.player)
				break
			case 'playerDisconnected':
				disconnectPlayer(data.playerId)
				break
			case 'playerKeyUpdate':
				updatePlayerKeys(data.playerId, data.keyStates)
			default:
				console.log("Unknown event type", data.type)
		}
	})
}

createGame()