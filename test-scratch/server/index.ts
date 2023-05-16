/* -------------------------LIBRARIES IMPORTS------------------------- */

import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Socket, Server } from 'socket.io';
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

interface party {
	id: string
	size: number
	playerIDs: string[]
	hostID: string
}

/* -------------------------VARIABLES------------------------- */

const __filename: string = fileURLToPath(import.meta.url)
const __dirname: string = dirname(__filename)
const port: number = 3001
const clientIDLogin: string = "PHASER-WEB-CLIENT"
const headlessIDLogin: string = "PHASER-HEADLESS-CLIENT"
const controlerIDLogin: string = "CONTROLER"

let io: Server
let state: string = 'up'

let players: { [key: string]: player } = {}
let headless: string[] = []
let connectionTypes: { [key: string]: string } = {}
let matchQueue: string[] = []

let nbRight: number = 0
let nbLeft: number = 0

/* -------------------------FUCNTIONS------------------------- */

function createNewPlayer(): player {
	let newPlayer: player
	let finalSide = (nbRight > nbLeft ? 'left' : 'right')
	if (nbRight > nbLeft)
		nbLeft = nbLeft + 1
	else
		nbRight = nbRight + 1
	console.log(finalSide + " connected", "r:", nbRight, "l:", nbLeft)
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

// Starts a new headless session
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

// Setup for client socket listeners
function setupClientListeners(socket: Socket){
	socket.on('', () => {})
}

// Setup for headless client socket listeners\
function setupHeadlessListeners(socket: Socket){
	socket.on('', () => {})
}

// Setup for controler socket listeners
function setupControlerListeners(socket: Socket){
	socket.on('stop', () => {})
	socket.on('newHeadless', () => {
		console.log("New headless")
		setupAuthoritativePhaser();
	})
	socket.on('deleteHeadless', () => {})
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
	socket.emit('ownID', `${socket.id}`)

	// Identification handler
	socket.on('identification', (socketLoginID: string) => {
		switch (socketLoginID) {
			case clientIDLogin:
				players[socket.id] = createNewPlayer()
				matchQueue[matchQueue.length] = socket.id
				connectionTypes[socket.id] = 'client'
				setupClientListeners(socket)
				console.log("Player logging in:", socket.id)
				break
			case headlessIDLogin:
				headless[headless.length] = socket.id
				connectionTypes[socket.id] = 'headless'
				setupHeadlessListeners(socket)
				console.log("New headless session:", socket.id)
				break
			case controlerIDLogin:
				connectionTypes[socket.id] = 'controler'
				console.log("New controler:", socket.id)
				setupControlerListeners(socket)
				break
			default:
				socket.disconnect()
		}
	})
		
})