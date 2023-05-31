/* -------------------------LIBRARIES IMPORTS------------------------- */

import Phaser from 'phaser'
import { Socket, io } from 'socket.io-client'

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

const loginID: string = "PHASER-HEADLESS-CLIENT"

const config = {
	type: Phaser.HEADLESS,
	width: 800,
	height: 600,
	autoFocus: false,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: { y: 0 }
		}
	},
	scene: {
		preload: preload,
		create: create,
		update: update
	}
};
let game: Phaser.Game
let socket: Socket
let ownId: string

/* -------------------------FUNCTIONS------------------------- */

function startGame(){
	game = new Phaser.Game(config);
}

function startSocket(){
	socket = io('http://localhost:3001')

	socket.on('ownID', (playerId) => {
		ownId = playerId
		console.log("Own id:", ownId)
		socket.emit('identification', loginID)
	})
}

/* -------------------------PHASER FUNCTIONS------------------------- */

function preload() { }
function create() { }
function update() { }

/* -------------------------MAIN CODE------------------------- */

startGame()
startSocket()