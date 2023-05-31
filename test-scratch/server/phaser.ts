/* -------------------------LIBRARIES IMPORTS------------------------- */

import Phaser from 'phaser'
import { parentPort } from 'worker_threads'
import { ArcadePhysics } from 'arcade-physics'
import { Body } from 'arcade-physics/lib/physics/arcade/Body.js'
import { ArcadeWorldConfig } from 'arcade-physics/lib/physics/arcade/ArcadePhysics.js'

/* -------------------------TYPES------------------------- */

// Player key states interface
interface keyStates {
	up: boolean									// Player UP key state
	down: boolean								// Player DOWN key state
	left: boolean								// Player LEFT key state
	right: boolean								// Player RIGHT key state
}

// Players construction interface (sent by the main process)
interface playerConstruct {
	type: string								// Event type
	id: string									// Player ID
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	width: number								// Player width
	height: number								// Player height
}

// Player update event interface (sent by the main process)
interface playerUpdate {
	type: string								// Event type
	id: string									// Player ID
	keyStates: keyStates						// Player key states
}

// Properties of a game object (sent to the main process)
interface objectProperties {
	target: string
	xPos: number
	yPos: number
	xVel: number
	yVel: number
}

// Player interface
interface player {
	id: string
	body: Body
}

// Ball interface
interface ball {
	body: Body
}

/* -------------------------VARIABLES------------------------- */

// Game constants
const screenWidth: number = 1920
const screenHeight: number = 1080
const targetFPS: number = 60
const playerSpeed: number = 150

// Physics initialisation
const config: ArcadeWorldConfig = {
	width: screenWidth,
	height: screenHeight,
	gravity: {
		x: 0,
		y: 0
	}
}
const physics: ArcadePhysics = new ArcadePhysics(config)

// Game variables
let tick: number = 0
let players: player[] = []
let ball: ball

/* -------------------------CREATION FUNCTIONS------------------------- */

// Create the ball
function createBall() {
	ball = {
		body: physics.add.body(screenHeight / 2, screenWidth / 2)
	}
	ball.body.setCircle(25)
	ball.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	console.log("Added ball")
}

// Create a new player
function createPlayer(construct: playerConstruct) {
	let newPlayer: player = {
		id: construct.id,
		body: physics.add.body(construct.xPos, construct.yPos, construct.width, construct.height)
	}
	newPlayer.body.setBounce(1, 1)
	newPlayer.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	physics.add.collider(ball.body, newPlayer.body)
	players[players.length] = newPlayer
	console.log("Added player")
}

/* -------------------------UPDATE FUNCTIONS------------------------- */

// Update players local speed usinf keyStates recieved from main process
function updatePlayer(update: playerUpdate) {
	let xVel: number = 0
	let yVel: number = 0
	if (update.keyStates.up)
		yVel = yVel - playerSpeed
	if (update.keyStates.down)
		yVel = yVel + playerSpeed
	if (update.keyStates.left)
		xVel = xVel - playerSpeed
	if (update.keyStates.right)
		xVel = xVel + playerSpeed
	players[update.id].body.setVelocity(xVel, yVel)
}

/* -------------------------PORT EVENTS------------------------- */

function portListener() {
	parentPort?.on("message", (incomingData: playerConstruct | playerUpdate) => {
		switch (incomingData.type) {
			case 'construct':
				createPlayer((incomingData as playerConstruct))
				break
			case 'update':
				updatePlayer((incomingData as playerUpdate))
				break
			default:
		}
	})
}

/* -------------------------MAIN FUNCTIONS------------------------- */

function update() {
	let properties: objectProperties[] = []
	physics.world.update(tick * 1000, 1000 / targetFPS)
	physics.world.postUpdate()
	tick++
	if (tick % 2){
		for (let player of players){
			properties[properties.length] = {
				target: player.id,
				xPos: player.body.x,
				yPos: player.body.x,
				xVel: player.body.velocity.x,
				yVel: player.body.velocity.y
			}
		}
		properties[properties.length] = {
			target: "ball",
			xPos: ball.body.x,
			yPos: ball.body.x,
			xVel: ball.body.velocity.x,
			yVel: ball.body.velocity.y
		}
		parentPort?.postMessage(properties)
	}
}

/* -------------------------MAIN CODE------------------------- */

function main() {
	portListener()
	setTimeout(() => {
		createBall()
		setInterval(() => {
			update()
		}, 1000 / targetFPS)
	}, 100)
}

main()