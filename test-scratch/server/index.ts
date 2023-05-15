/* -------------------------LIBRARIES IMPORTS------------------------- */

import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { JSDOM } from 'jsdom';
import { v4 as uuidv4 } from 'uuid';

/* -------------------------TYPES------------------------- */

// Socket.IO server to client interface
interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

// Socket.IO client to server interface
interface ClientToServerEvents {
	hello: () => void;
}

// Socket.IO server to server interface
interface InterServerEvents {
	ping: () => void;
}

// Socket.IO socket data interface
interface SocketData {
	name: string;
	age: number;
}

// Backend server login informations
interface socketLogin {
	socketLoginID: string
	playerId: string
}

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

const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = dirname(__filename)
const port: number = 3001
const clientIDLogin: string = "a52b4f5d-f4e8-40bd-8d49-fda62e74d859"
const headlessIDLogin: string = "b300c0f7-f8e4-4604-a514-cdf28b1d21ba"

let io: Server

let players: { [key: string]: player } = {}
let headless: { [key: string]: player } = {}

let nbRight: number = 0
let nbLeft: number = 0

/* -------------------------FUCNTIONS------------------------- */

function createNewPlayer(): player {
	let newPlayer: player
	let finalSide = (nbRight > nbLeft ? 'left' : 'right')
	console.log(finalSide + " connected")
	if (nbRight > nbLeft)
		nbLeft = nbLeft + 1
	else
		nbRight = nbRight + 1
	console.log("r:", nbRight, "l:", nbLeft)
	newPlayer = {
		id: uuidv4(), 
		xPos: (finalSide == 'left' ? 250 : 1670),
		yPos: 250 + Math.random() * 580,
		xDir: (finalSide == 'left' ? 'right' : 'left'),
		keyStates: {
			up: false,
			down: false,
			left: false,
			right: false,
		},
		xVel: 0,
		yVel: 0,
		lastMove: 'none',
		move: 'idle',
		skin: 'mage',
		anim: 'IdleAnim'
	}

	return newPlayer
}

function setupAuthoritativePhaser() {
	JSDOM.fromFile(path.join(__dirname, '../authoritative_server/dist/index.html'), {
		// To run the scripts in the html file
		runScripts: "dangerously",
		// Also load supported external resources
		resources: "usable",
		// So requestAnimatinFrame events fire
		pretendToBeVisual: true
	})
}

/* -------------------------MAIN CODE------------------------- */

// Setting up socket.IO server
io = new Server<ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData>(port, {
		cors: {
			origin: '*', // Allow any origin, you can change this to specific domains
			methods: ['GET', 'POST'],
		},
	});
console.log("listening on port:", port)

// Connection handler
io.on('connection', (socket) => {
	console.log(`Player connected: ${socket.id}`)
	socket.emit('ownID', `${socket.id}`)
	socket.emit('currentPlayers', Object.values(players))
})

// Identification handler
io.on('identification', (loginInfo: socketLogin) => {
	console.log("Player logging in:", loginInfo.playerId)
	if (loginInfo.socketLoginID == "PHASER-WEB-CLIENT") {
		players[loginInfo.playerId] = createNewPlayer()
		console.log("A new player has connected")
	}
	else if (loginInfo.socketLoginID == "PHASER-HEADLESS-CLIENT") {
		headless[loginInfo.playerId] = createNewPlayer()
		console.log("A new headless client has connected")
	}
})

// Start a new headless client
setupAuthoritativePhaser();
