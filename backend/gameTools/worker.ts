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
	workerId: string
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
	keyStates: keyStates						// Player key states
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
	workerId: string
	leftProps: objectProps
	rightProps: objectProps
	ballProps: objectProps
}

interface gameState {
	actualState: string
}

interface stateUpdate {
	newState: string
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
let workerId: string | undefined = undefined
let identifier: string | undefined = undefined
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
	ball = { body: physics.add.body(screenWidth / 2, screenHeight / 2) }
	ball.body.setCircle(26)
	ball.body.setBounce(1, 1)
	ball.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	console.log(identifier, "Added ball")
}

// Create a new player
function createPlayer(construct: playerConstruct) {
	let newPlayer: player = {
		side: construct.side,
		body: physics.add.body(construct.xPos, construct.yPos, construct.width * 5, construct.height * 5)
	}
	newPlayer.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	newPlayer.body.setImmovable(true)
	if (ball) physics.add.collider(ball.body, newPlayer.body)
	if (leftPlayer) {
		rightPlayer = newPlayer
		console.log(identifier, "Added right player")
	}
	else {
		leftPlayer = newPlayer
		console.log(identifier, "Added left player")
	}
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
	if (xVel && yVel) {
		xVel = (playerSpeed / 2) * Math.SQRT2 * (xVel / playerSpeed)
		yVel = (playerSpeed / 2) * Math.SQRT2 * (yVel / playerSpeed)
	}
	if (leftPlayer && rightPlayer) {
		if (updatedPlayer.side == leftPlayer.side) leftPlayer.body.setVelocity(xVel, yVel)
		else rightPlayer.body.setVelocity(xVel, yVel)
	}
}

function updateState(newStateContainer: stateUpdate) {
	switch (newStateContainer.newState){
		case ("start"):
			gameState = 'on'
			console.log(identifier, "Starting game")
			break
		case ("stop"):
			gameState = 'off'
			console.log(identifier, "Stoping game")
			break
	}
}

/* -------------------------PORT INPUT------------------------- */

function isLogin(incomingData: playerConstruct | playerUpdate | loginData | stateUpdate): incomingData is loginData {
	return (<loginData>incomingData).workerId !== undefined
}

function isConstruct(incomingData: playerConstruct | playerUpdate | loginData | stateUpdate): incomingData is playerConstruct {
	return (<playerConstruct>incomingData).xPos !== undefined
}

function isPlayerUpdate(incomingData: playerConstruct | playerUpdate | loginData | stateUpdate): incomingData is playerUpdate {
	return (<playerUpdate>incomingData).keyStates !== undefined
}

function isStateUpdate(incomingData: playerConstruct | playerUpdate | loginData | stateUpdate): incomingData is stateUpdate {
	return (<stateUpdate>incomingData).newState !== undefined
}

function portListener() {
	parentPort?.on("message", (incomingData: playerConstruct | playerUpdate | loginData | stateUpdate) => {
		if (isLogin(incomingData)) {
			workerId = incomingData.workerId
			identifier = "[" + workerId.slice(0, 4) + "] "
			console.log(identifier, "Worker id recieved")
		}
		else if (isConstruct(incomingData)) {
			console.log(identifier, "Player recieved")
			createPlayer(incomingData)
		}
		else if (isPlayerUpdate(incomingData)) {
			updatePlayer(incomingData)
		}
		else if (isStateUpdate(incomingData)) {
			console.log(identifier, "State update recieved")
			updateState(incomingData)
		}
		else {
			console.log(identifier, "ERROR: Wrong message type")
		}
	})
}

/*if (leftPlayer && rightPlayer && ball) {
	gameState = "on"
	console.log("[S] Game is now running")
}
else {
	gameState = "off"
	console.log("[S] Game is now stopped")
}*/

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
	if (workerId && leftPlayer && ball && rightPlayer && parentPort) {
		if (newProps)
			oldProps = Object.assign({}, newProps)
		newProps = {
			workerId: workerId,
			leftProps: getProperties(leftPlayer.body),
			rightProps: getProperties(rightPlayer.body),
			ballProps: getProperties(ball.body)
		}
		if (oldProps) {
			parentPort?.postMessage(newProps)
		}
	}
}

function sendReady() {
	let gameState: gameState = {
		actualState: "ready"
	}
	parentPort?.postMessage(gameState)
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
	setTimeout(() => {
		portListener()
		createBall()
		sendReady()
		setInterval(() => {
			if (gameState == "on")
				update()
		}, 1000 / targetFPS)
	}, 100)
}

main()