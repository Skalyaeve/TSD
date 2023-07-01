/* -------------------------LIBRARIES IMPORTS------------------------- */

import Phaser from 'phaser'
import { parentPort } from 'worker_threads'
import { ArcadePhysics } from 'arcade-physics'
import { Body } from 'arcade-physics/lib/physics/arcade/Body.js'
import { Collider } from 'arcade-physics/lib/physics/arcade/Collider.js'

/* -------------------------TYPES------------------------- */

type Size = { width: number, height: number }
type Coordinates = { x: number, y: number }
type Side = 'left' | 'right'
type GameState = 'init' | 'ready' | 'created' | 'started' | 'stopped'
type ParentPortMessage = playerConstruct | playerUpdate | loginData | stateUpdate
type GameEvent = 'goal' | 'blocked' | '3' | '2' | '1' | 'fight' | 'stop'

// Player interface
interface player {
	side: Side									// Player side
	body: Body									// Player body
	construct: playerConstruct					// Player construct
	ballCollider: Collider | undefined			// Player and ball collider
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

// Worker identification data
interface loginData {
	workerId: string							// workerId
}

// Players construction interface (sent by the main process)
interface playerConstruct {
	side: Side									// Player side
	coords: Coordinates							// Player coordinates
	size: Size									// Player size
}

// Player update event interface (sent by the main process)
interface playerUpdate {
	side: Side									// Player side
	keyStates: keyStates						// Player key states
}

// Properties of all updated game objects
interface newProps {
	workerId: string
	leftProps: Coordinates
	rightProps: Coordinates
	ballProps: Coordinates
}

// Game state of a worker
interface gameState {
	actualState: string
}

// Update to the gamestate of a worker
interface stateUpdate {
	newState: GameState
}

/* -------------------------VARIABLES------------------------- */

// Game constants
const screenWidth: number = 1920
const screenHeight: number = 1080
const targetFPS: number = 60
const playerSpeed: number = 1000
const ballRay: number = 26

// Game variables
let workerId: string | undefined = undefined
let identifier: string | undefined = undefined
let leftPlayer: player | undefined = undefined
let rightPlayer: player | undefined = undefined
let ball: ball | undefined = undefined
let tick: number = 0
let generalGameState: 'on' | 'off' = 'off'

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
	ball = { body: physics.add.body(screenWidth / 2 - ballRay, screenHeight / 2 - ballRay) }
	ball.body.setCircle(ballRay)
	ball.body.setBounce(1, 1)
	ball.body.setCollideWorldBounds(true, undefined, undefined, true)
	physics.world.on('worldbounds', (body: Body, up: boolean, down: boolean, left: boolean, right: boolean) => {
		if (body.isCircle && (left || right)) {
			console.log(identifier, 'Collition on side:', (left ? 'left' : 'right'))
			goalTransition()
		}
	})
}

// Create a new player
function createPlayer(construct: playerConstruct) {
	let newPlayer: player = {
		side: construct.side,
		body: physics.add.body(construct.coords.x, construct.coords.y, construct.size.width, construct.size.height),
		construct: construct,
		ballCollider: undefined
	}
	newPlayer.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	newPlayer.body.setImmovable(true)
	if (ball)
		newPlayer.ballCollider = physics.add.collider(ball.body, newPlayer.body)
	if (leftPlayer)
		rightPlayer = newPlayer
	else
		leftPlayer = newPlayer
}

// Resets a player to it's starting position
function resetPlayer(player: player) {
	player.ballCollider?.destroy()
	player.ballCollider = undefined
	player.body.destroy()
	player.body = physics.add.body(player.construct.coords.x, player.construct.coords.y, player.construct.size.width, player.construct.size.height)
	player.body.setCollideWorldBounds(true, undefined, undefined, undefined)
	player.body.setImmovable(true)
	if (ball)
		player.ballCollider = physics.add.collider(ball.body, player.body)
}

// Resets the ball to it's starting position
function resetBall() {
	if (ball) {
		physics.world.removeAllListeners()
		ball?.body.destroy()
		createBall()
	}
}

/* -------------------------UPDATE FUNCTIONS------------------------- */

// Update players local speed usinf keyStates recieved from main process
function updatePlayer(updatedPlayer: playerUpdate) {
	let xVel: number = 0
	let yVel: number = 0
	// Calculation of individual x y velocity
	if (updatedPlayer.keyStates.up) yVel = yVel - playerSpeed
	if (updatedPlayer.keyStates.down) yVel = yVel + playerSpeed
	if (updatedPlayer.keyStates.left) xVel = xVel - playerSpeed
	if (updatedPlayer.keyStates.right) xVel = xVel + playerSpeed
	// Limitation of diagonal speed
	if (xVel && yVel) {
		xVel = (playerSpeed / 2) * Math.SQRT2 * (xVel / playerSpeed)
		yVel = (playerSpeed / 2) * Math.SQRT2 * (yVel / playerSpeed)
	}
	if (leftPlayer && rightPlayer) {
		if (updatedPlayer.side == leftPlayer.side) leftPlayer.body.setVelocity(xVel, yVel)
		else rightPlayer.body.setVelocity(xVel, yVel)
	}
}

// Setter for the general state of the game
function setGeneralGameState(value: 'on' | 'off') {
	console.log(identifier, "Game state is now:", value)
	generalGameState = value
}

// Update the game state following the state update
function updateState(newStateContainer: stateUpdate) {
	switch (newStateContainer.newState) {
		case ('started'):
			if (tick == 0)
				playCountdown()
			setGeneralGameState('on')
			break
		case ('stopped'):
			setGeneralGameState('off')
			break
	}
}

// Displays goal animation
function displayAnim(anim: GameEvent) {
	parentPort?.postMessage(anim)
}

// Reset all entities to their respective start position
function resetEntities() {
	if (leftPlayer && rightPlayer) {
		resetBall()
		resetPlayer(leftPlayer)
		resetPlayer(rightPlayer)
		update()
	}
}

function animate(event: GameEvent, timeout: number): Promise<void> {
	return new Promise<void>((resolve) => {
		displayAnim(event)
		setTimeout(() => {
			displayAnim('stop')
			setTimeout(() => {
				resolve()
			}, 10)
		}, timeout)
	});
}


// Triggered on goal, starts a new round 
async function goalTransition() {
	setGeneralGameState('off')
	if (Math.floor(Math.random() * 2))
		await animate('goal', 3000)
	else
		await animate('blocked', 3000)
	resetEntities()
	await playCountdown()
	setGeneralGameState('on')
}

async function playCountdown() {
	await animate('3', 800)
	await animate('2', 800)
	await animate('1', 800)
	await animate('fight', 300)
}

/* -------------------------PORT INPUT------------------------- */

// Check if incomming data type loginData
function isLogin(incomingData: ParentPortMessage): incomingData is loginData {
	return (<loginData>incomingData).workerId !== undefined
}

// Check if incomming data type is playerConstruct
function isConstruct(incomingData: ParentPortMessage): incomingData is playerConstruct {
	return (<playerConstruct>incomingData).coords !== undefined
}

// Check if incomming data type is playerUpdate
function isPlayerUpdate(incomingData: ParentPortMessage): incomingData is playerUpdate {
	return (<playerUpdate>incomingData).keyStates !== undefined
}

// Check if incomming data type is stateUpdate
function isStateUpdate(incomingData: ParentPortMessage): incomingData is stateUpdate {
	return (<stateUpdate>incomingData).newState !== undefined
}

// Backend messages listeners
function portListener() {
	parentPort?.on('message', (incomingData: ParentPortMessage) => {
		if (isLogin(incomingData)) {
			workerId = incomingData.workerId
			identifier = '[' + workerId.slice(0, 4) + '] '
			sendState('ready')
		}
		else if (isConstruct(incomingData)) {
			createPlayer(incomingData)
			if (leftPlayer && rightPlayer)
				sendState('created')
		}
		else if (isPlayerUpdate(incomingData)) {
			updatePlayer(incomingData)
		}
		else if (isStateUpdate(incomingData)) {
			updateState(incomingData)
			sendState(incomingData.newState)
		}
		else {
			console.log(identifier, 'ERROR: Wrong message type')
		}
	})
}

/* -------------------------PORT OUTPUT------------------------- */

// Returns coordinates of a body
function getProperties(body: Body): Coordinates {
	return {
		x: body.x,
		y: body.y
	}
}

// Send objects properties to backend
function sendProperties() {
	if (workerId && leftPlayer && ball && rightPlayer && parentPort) {
		let newProps: newProps = {
			workerId: workerId,
			leftProps: getProperties(leftPlayer.body),
			rightProps: getProperties(rightPlayer.body),
			ballProps: getProperties(ball.body)
		}
		parentPort.postMessage(newProps)
	}
}

// Send the state to the backend
function sendState(state: GameState) {
	parentPort?.postMessage(state)
}

/* -------------------------MAIN FUNCTIONS------------------------- */

// Update the game to the next tick
function update() {
	physics.world.update(tick * 1000, 1000 / targetFPS)
	physics.world.postUpdate()
	tick++
	sendProperties()
}

function main() {
	portListener()
	createBall()
	sendState('init')
	setInterval(() => {
		if (generalGameState === 'on') {
			update()
		}
	}, 1000 / targetFPS)
}

main()