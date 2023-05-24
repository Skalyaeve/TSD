/* -------------------------LIBRARIES IMPORTS------------------------- */

import Phaser from 'phaser'
import { Socket, io } from 'socket.io-client'
import { ArcadePhysics } from 'arcade-physics'
import { ArcadeWorldConfig } from 'arcade-physics/lib/physics/arcade/ArcadePhysics'

/* -------------------------TYPES------------------------- */

// Player key states interface
interface keyStates {
	up: boolean									// Player UP key state
	down: boolean								// Player DOWN key state
	left: boolean								// Player LEFT key state
	right: boolean								// Player RIGHT key state
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
	anim: string								// Player current animation
}

/* -------------------------VARIABLES------------------------- */

// Configuration
const config: ArcadeWorldConfig = {
	width: 800,
	height: 450,
	gravity: {
		x: 0,
		y: 300
	}
}

// Physic object
let physics: ArcadePhysics

// Websocket
let socket: Socket

// Client type
const ClientType: string = "PHASER-HEADLESS-CLIENT"

// Session Id
let selfId: string

// Game ticks
let tick: number = 0

// Game objects
let box: any
let ball: any
let platform: any

/* -------------------------CREATION FUNCTIONS------------------------- */

function startPhysics(){
	physics = new ArcadePhysics(config)
}

function createGameObjects(){
	// box
	box = physics.add.body(20, 20, 64, 64)
	box.setVelocityX(20)
	box.setBounce(0.6, 0.6)
	box.setCollideWorldBounds(true, undefined, undefined, undefined)

	// ball
	ball = physics.add.body(206, 20)
	ball.setCircle(32)
	ball.setBounce(0.8, 0.8)
	ball.setCollideWorldBounds(true, undefined, undefined, undefined)

	// platform
	platform = physics.add.staticBody(60, 350, 160, 32)
}

/* -------------------------UPDATE FUNCTIONS------------------------- */


function createColliders(){
	// colliders
	physics.add.collider(box, ball)
	physics.add.collider(box, platform)
	physics.add.collider(ball, platform)
}

function preUpdateDebug(){
	console.log("box x:", box.x, "y:", box.y, "time:", tick)
	console.log("ball x:", ball.x, "y:", ball.y, "time:", tick)
}

function updatePhysics(){
	physics.world.update(tick * 1000, 1000 / 60)
	physics.world.postUpdate()
	tick++
}

function postUpdateDebug(){

}

/* -------------------------SOCKET EVENTS------------------------- */

function startSockets(){
	socket = io('http://localhost:3000')

	socket.on('ownID', (playerId) => {
		selfId = playerId
		console.log("Own id:", selfId)
		socket.emit('identification', selfId)
	})
}

/* -------------------------MAIN FUNCTIONS------------------------- */

function create() {
	startPhysics()
	createGameObjects()
	createColliders()
}

function update() {
	preUpdateDebug()
	updatePhysics()
	postUpdateDebug()
}

function loop(){
	setInterval(() => {
		update()
	}, 1000 / 60);
}

/* -------------------------MAIN CODE------------------------- */

function main() {
	create()
	setTimeout(() => {
		startSockets()
	}, 100)
	setTimeout(() => {
		loop()
	}, 100)
}

main()