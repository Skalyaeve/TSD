/* -------------------------LIBRARIES IMPORTS------------------------- */

import Phaser from 'phaser'
import { parentPort } from 'worker_threads'
import { ArcadePhysics } from 'arcade-physics'
import { Body } from 'arcade-physics/lib/physics/arcade/Body.js'
import { Collider } from 'arcade-physics/lib/physics/arcade/Collider.js'
import * as Characters from './characters.json'

/* -------------------------TYPES------------------------- */

type Size = { width: number, height: number }
type Coordinates = { x: number, y: number }
type Side = 'left' | 'right'
type GameState = 'init' | 'ready' | 'created' | 'started' | 'stopped'
type ParentPortMessage = playerConstruct | playerUpdate | loginData | stateUpdate
type GameEvent = 'goal' | 'blocked' | '3' | '2' | '1' | 'fight' | 'stop'
type Skin = 'Boreas' | 'Helios' | 'Selene' | 'Liliana' | 'Orion' | 'Faeleen' | 'Rylan' | 'Garrick' | 'Thorian' | 'Test'

interface playerStats {
	healthPoints: number
	attackModifier: number
	defenceModifier: number
	speedModifier: number
	critChance: number
	blockChance: number
	lifeSteal: number
}

// Player interface
interface player {
	side: Side									// Player side
	body: Body									// Player body
	skin: Skin									// Player skin name						
	stats: playerStats							// Player actual stats
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
	skin: Skin
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
			const collisionSide = (left ? 'left' : 'right')
			console.log(identifier, collisionSide, "side collision")
			resolveGoal(collisionSide)
			goalTransition()
		}
	})
}



function getBaseStats(skin: Skin): playerStats {
	return {
		healthPoints: Characters[skin].health,
		attackModifier: 0,
		defenceModifier: 0,
		speedModifier: Characters[skin].speed,
		critChance: (skin === 'Faeleen' ? 20 : 0),
		blockChance: (skin === 'Orion' ? 20 : 0),
		lifeSteal: (skin === 'Thorian' ? 30 : 0)
	}
}

// Create a new player
function createPlayer(construct: playerConstruct) {
	let newPlayerStats: playerStats = getBaseStats(construct.skin)
	let newPlayer: player = {
		side: construct.side,
		body: physics.add.body(construct.coords.x, construct.coords.y, construct.size.width, construct.size.height),
		skin: construct.skin,
		stats: newPlayerStats,
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
async function updateState(newStateContainer: stateUpdate) {
	switch (newStateContainer.newState) {
		case ('started'):
			if (tick == 0)
				await playCountdown()
			setGeneralGameState('on')
			break
		case ('stopped'):
			setGeneralGameState('off')
			break
	}
}


function resolveGoal(side: Side) {
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

// Displays a piece of text on the screen
function displayText(event: GameEvent, timeout: number): Promise<void> {
	return new Promise<void>((resolve) => {
		displayAnim(event)
		setTimeout(() => {
			displayAnim('stop')
			setTimeout(() => {
				resolve()
			}, 100)
		}, (timeout > 100 ? timeout - 100 : 100))
	});
}

// Displays the combat countdown on the screen
async function playCountdown() {
	await displayText('3', 1000)
	await displayText('2', 1000)
	await displayText('1', 1000)
	await displayText('fight', 500)
}

// Triggered on goal, starts a new round 
async function goalTransition() {
	setGeneralGameState('off')
	if (Math.floor(Math.random() * 2))
		await displayText('goal', 3000)
	else
		await displayText('blocked', 3000)
	resetEntities()
	await playCountdown()
	setGeneralGameState('on')
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