/* -------------------------LIBRARIES IMPORTS------------------------- */

import Phaser from 'phaser'
import { parentPort } from 'worker_threads'
import { ArcadePhysics } from 'arcade-physics'
import { Body } from 'arcade-physics/lib/physics/arcade/Body.js'

/* -------------------------TYPES------------------------- */

// Player interface
interface player {
	side: 'left' | 'right'						// Player side
	body: Body									// Player body
}

// Ball interface
interface ball {
	body: Body									// Ball body
}

// Player key states interface
interface keyStates {
	up: boolean									// Player UP key state
	down: boolean								// Player DOWN key state
	left: boolean								// Player LEFT key state
	right: boolean								// Player RIGHT key state
}

interface loginData {
	sessionId: string
}

// Players construction interface (sent by the main process)
interface playerConstruct {
	side: 'left' | 'right'						// Player side
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	width: number								// Player width
	height: number								// Player height
}

// Player update event interface (sent by the main process)
interface playerUpdate {
	side: 'left' | 'right'						// Player side
	keyStates: keyStates						// Player key statessessionId
}

// Properties of a game object (sent to the main process)
interface objectProps {
	xPos: number
	yPos: number
	xVel: number
	yVel: number
}

// Properties of all updated game objects
interface newProps {
	sessionId: string
	leftProps: objectProps
	rightProps: objectProps
	ballProps: objectProps
}

interface sharedPlayer {

}

/* -------------------------VARIABLES------------------------- */

// Game constants
const screenWidth: number = 1920
const screenHeight: number = 1080
const targetFPS: number = 60
const playerSpeed: number = 1000

// Game variables
let sessionId: string | undefined = undefined
let leftPlayer: player | undefined = undefined
let rightPlayer: player | undefined = undefined
let ball: ball | undefined = undefined
let tick: number = 0
let gameState: "on" | "off" = "off"
let oldProps: newProps | undefined = undefined
let newProps: newProps | undefined = undefined

// Physics initialisation
const physics: ArcadePhysics = new ArcadePhysics({
	width: screenWidth,
	height: screenHeight,
	gravity: {
		x: 0,
		y: 0
	}
})

/* -------------------------CREATION FUNCTIONS------------------------- */

// Create the ball
function createBall() {
	ball = { body: physics.add.body(screenHeight / 2, screenWidth / 2) }
	ball.body.setCircle(25)
	ball.body.setBounce(1, 1)
	ball.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	console.log("[", sessionId?.slice(0,4),"] Added ball")
}

// Create a new player
function createPlayer(construct: playerConstruct) {
	let newPlayer: player = {
		side: construct.side,
		body: physics.add.body(construct.xPos, construct.yPos, construct.width, construct.height)
	}
	newPlayer.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	if (ball) physics.add.collider(ball.body, newPlayer.body)
	if (leftPlayer) {
		rightPlayer = newPlayer
		console.log("[", sessionId?.slice(0,4),"] Added right player")
	}
	else {
		leftPlayer = newPlayer
		console.log("[", sessionId?.slice(0,4),"] Added left player")
	}
	if (leftPlayer && rightPlayer && ball)
		gameState = "on"
	else
		gameState = "off"
}

/* -------------------------UPDATE FUNCTIONS------------------------- */

// Update players local speed usinf keyStates recieved from main process
function updatePlayer(updatedPlayer: playerUpdate) {
	let xVel: number = 0
	let yVel: number = 0
	if (updatedPlayer.keyStates.up) yVel = yVel - playerSpeed
	if (updatedPlayer.keyStates.down) yVel = yVel + playerSpeed
	if (updatedPlayer.keyStates.left) xVel = xVel - playerSpeed
	if (updatedPlayer.keyStates.right) xVel = xVel + playerSpeed
	if (leftPlayer && rightPlayer) {
		console.log("[", sessionId?.slice(0,4),"] Updating player vel")
		if (updatedPlayer.side == leftPlayer.side) leftPlayer.body.setVelocity(xVel, yVel)
		else rightPlayer.body.setVelocity(xVel, yVel)
	}
}

/* -------------------------PORT INPUT------------------------- */

function isLogin(incomingData: playerConstruct | playerUpdate | loginData ): incomingData is loginData {
	return (<loginData>incomingData).sessionId !== undefined
}

function isConstruct(incomingData: playerConstruct | playerUpdate): incomingData is playerConstruct {
	return (<playerConstruct>incomingData).xPos !== undefined
}

function portListener() {
	parentPort?.on("message", (incomingData: playerConstruct | playerUpdate | loginData ) => {
		if (isLogin(incomingData)) sessionId = incomingData.sessionId
		else if (isConstruct(incomingData)) createPlayer(incomingData)
		else updatePlayer(incomingData)
	})
}

/* -------------------------PORT OUTPUT------------------------- */

function getProperties(body: Body): objectProps {
	return {
		xPos: body.x,
		yPos: body.y,
		xVel: body.velocity.x,
		yVel: body.velocity.y
	}
}

// Send objects properties to
function sendProperties() {
	if (sessionId && leftPlayer && ball && rightPlayer && parentPort) {
		if (newProps)
			oldProps = Object.assign({}, newProps)
		newProps = {
			sessionId: sessionId,
			leftProps: getProperties(leftPlayer.body),
			rightProps: getProperties(rightPlayer.body),
			ballProps: getProperties(ball.body)
		}
		if (oldProps){
			parentPort.postMessage(newProps)
		}
	}
}

/* -------------------------MAIN FUNCTIONS------------------------- */

// Update the game to the next tick
function update() {
	physics.world.update(tick * 1000, 1000 / targetFPS)
	physics.world.postUpdate()
	tick++
	sendProperties()
}

/* -------------------------MAIN CODE------------------------- */

function main() {
	createBall()
	setTimeout(() => {
		portListener()
		setInterval(() => {
			if (gameState == "on")
				update()
		}, 1000 / targetFPS)
	}, 100)
}

main()