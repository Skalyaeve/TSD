import React, { useLayoutEffect, useRef, useState } from 'react'
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

interface skin {
	name: string								// Skin name
	nbFrames: number							// Skin spritesheet number of frames
	xSize: number								// Idle skin X size
	ySize: number								// Idle skin Y size
	runSheet: string							// Skin run spritesheet
	idleSheet: string							// Skin idle spritesheet
	scaleFactor: number
}

interface player {
	id: string									// Player ID
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	xDir: string								// Player X direction (left/right)
	lastMove: string							// Player last movement state (none/idle/run)
	move: string								// Player actual movement state (idle/run)
	skin: string
	anim: string

	sprite?: Phaser.Physics.Arcade.Sprite 		// Player sprite
	//colliders: Phaser.Physics.Arcade.Collider[]	// Player colliders
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

	let p: { [key: string]: player } = {}

	// Skin list
	let skins: skin[] = []

	let s: { [key: string]: skin } = {}

	// Player self id
	let myId: string

	// Player event queues
	let creationQueue: string[] = []
	let animationQueue: string[] = []
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
		s['player'] = {
			name: 'player',
			nbFrames: 2,
			xSize: 100,
			ySize: 175,
			idleSheet: playerIdle__Sheet,
			runSheet: playerRun__Sheet,
			scaleFactor: 1
		}
		s['mage'] = {
			name: 'mage',
			nbFrames: 8,
			xSize: 250,
			ySize: 250,
			idleSheet: mageIdle__Sheet,
			runSheet: mageRun__Sheet,
			scaleFactor: 2.5
		}
		for (let skinName in s) {
			scene.load.spritesheet(skinName + 'Idle', s[skinName].idleSheet, { frameWidth: s[skinName].xSize, frameHeight: s[skinName].ySize })
			scene.load.spritesheet(skinName + 'Run', s[skinName].runSheet, { frameWidth: s[skinName].xSize, frameHeight: s[skinName].ySize })
		}
	}

	/****** SCENE CREATION ******/

	// Create players for this scene
	function createPlayer(playerId: string, scene: Phaser.Scene) {
		let player: player = p[playerId]
		let skin = s[player.skin]
		let newSprite = scene.physics.add.sprite(player.xPos, player.yPos, player.skin + 'Idle')
		newSprite.setScale(skin.scaleFactor, skin.scaleFactor).refreshBody()
		newSprite.setBounce(1)
		newSprite.setCollideWorldBounds(true)
		newSprite.setImmovable(true)
		if (player.xDir == 'left')
			newSprite.setFlipX(true)
		else if (player.xDir == 'right')
			newSprite.setFlipX(false)
		player.sprite = newSprite
	}

	// Create animation for this scene
	function createAnims(scene: Phaser.Scene) {
		for (let skinName in s) {
			scene.anims.create({
				key: skinName + 'IdleAnim',
				frames: scene.anims.generateFrameNumbers(skinName + 'Idle', { start: 0, end: s[skinName].nbFrames - 1 }),
				frameRate: s[skinName].nbFrames,
				repeat: -1
			})
			scene.anims.create({
				key: skinName + 'RunAnim',
				frames: scene.anims.generateFrameNumbers(skinName + 'Run', { start: 0, end: s[skinName].nbFrames - 1 }),
				frameRate: s[skinName].nbFrames,
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
	const sendPlayerStart = () => {
		let self: player = p[myId]
		self.sprite?.play(self.skin + 'RunAnim')
		socket.emit('playerStart')
	}

	const sendPlayerMovement = (xPos: number, yPos: number) => {
		socket.emit('playerMovement', { xPos, yPos })
	}

	const sendPlayerStop = () => {
		let self: player = p[myId]
		self.sprite?.play(self.skin + 'IdleAnim')
		socket.emit('playerStop')
	}

	/****** SCENE UPDATE ******/

	function checkKeyInputs() {
		let player: player = p[myId]
		let skin: skin = s[player.skin]
		let endVelocityX: number = 0
		let endVelocityY: number = 0
		if (player && player.sprite && player.sprite.body) {
			if (allKeysUp()) {
				if (player.move == 'run') {
					sendPlayerStop()
					sendPlayerMovement(player.sprite.body.x + skin.xSize / 2 * skin.scaleFactor, player.sprite.body.y + skin.ySize / 2 * skin.scaleFactor)
					player.move = 'idle'
				}
			}
			else if (player.move == 'run')
				sendPlayerMovement(player.sprite.body.x + skin.xSize / 2 * skin.scaleFactor, player.sprite.body.y + skin.ySize / 2 * skin.scaleFactor)
			else if (player.move == 'idle') {
				sendPlayerStart()
				sendPlayerMovement(player.sprite.body.x + skin.xSize / 2 * skin.scaleFactor, player.sprite.body.y + skin.ySize / 2 * skin.scaleFactor)
				player.move = 'run'
			}
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
			}
		}
	}

	function checkNewPlayer(scene: Phaser.Scene) {
		if (!creationQueue.length)
			return
		for (let queueId = 0; queueId < creationQueue.length; queueId++) {
			createPlayer(p[creationQueue[queueId]].id, scene)
		}
		//console.log("Creation queue is now empty")
		creationQueue = []
	}

	function checkDisconnect() {
		if (!deletionQueue.length)
			return
		for (let queueId = 0; queueId < deletionQueue.length; queueId++) {
			p[deletionQueue[queueId]].sprite?.destroy()
			delete p[deletionQueue[queueId]]
		}
		//console.log("Deletion queue is now empty")
		deletionQueue = []
	}

	// Set player animations following moveState
	function checkAnims() {
		for (let queueId = 0; queueId < animationQueue.length; queueId++) {
			p[animationQueue[queueId]].sprite?.play(p[animationQueue[queueId]].skin + p[animationQueue[queueId]].anim)
		}
		animationQueue = []
	}

	function checkMove() {
		for (let queueId of moveQueue) {
			p[queueId].sprite?.setPosition(p[queueId].xPos, p[queueId].yPos)
		}
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
		checkMove()
		checkAnims()
		checkDisconnect()
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
			for (let queueId = 0; queueId < playersList.length; queueId++) {
				p[playersList[queueId].id] = playersList[queueId]
				creationQueue[creationQueue.length] = playersList[queueId].id
				animationQueue[animationQueue.length] = playersList[queueId].id
				console.log("Added", playersList[queueId].id, "to animation list")
			}
			console.log("Added ", playersList.length, " players to the creation queue")
		});

		// Get the player's own ID
		socket.on('ownID', (playerId: string) => {
			myId = playerId
			console.log("Player's own id: ", myId)
		})

		// Add a new player to the players list
		socket.on('newPlayer', (player: player) => {
			p[player.id] = player
			creationQueue[creationQueue.length] = player.id
			animationQueue[animationQueue.length] = player.id
			console.log("Added player to creation queue")
		})

		socket.on('playerStarted', (playerId: string) => {
			p[playerId].anim = 'RunAnim'
			animationQueue[animationQueue.length] = playerId
			console.log("A player started:", playerId)
		})

		// Update the moved player's velocity in the players list
		socket.on('playerMoved', (playerId: string, xPos: number, yPos: number) => {
			p[playerId].xPos = xPos
			p[playerId].yPos = yPos
			moveQueue[moveQueue.length] = playerId
			console.log("A player moved:", playerId)
		})

		socket.on('playerStoped', (playerId: string) => {
			p[playerId].anim = 'IdleAnim'
			animationQueue[animationQueue.length] = playerId
			console.log("A player stoped:", playerId)
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
