/* -------------------------LIBRARIES IMPORTS------------------------- */

import { Worker } from 'worker_threads'
import { Socket, Server } from 'socket.io';
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

// Socket and socket type for server
interface socketInfo {
	socket: Socket
	type: string
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

interface simulation {
	hostId: string
	playerId1: string
	playerId2: string
}

/* -------------------------VARIABLES------------------------- */

const port: number = 3001
const clientIDLogin: string = "PHASER-WEB-CLIENT"
const controlerIDLogin: string = "CONTROLER"

let io: Server
let sockets: { [id: string]: socketInfo } = {}

let players: { [id: string]: player } = {}
let workers: Worker[] = []
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
function newSimulation() {
	let newWorker = new Worker('./dist/phaser.js')
	
}

// Setup for client socket listeners
function setupClientListeners(socket: Socket) {
	socket.on('', () => { })
}

// Setup for controler socket listeners
function setupControlerListeners(socket: Socket) {
	socket.on('newHeadless', () => {
		console.log("New headless")
		newSimulation();
	})
	socket.on('displaySocket', (socketId: string) => {
		if (sockets[socketId])
			socket.emit('displayLine', "Socket: " + socketId + " type: " + sockets[socketId].type)
		else
			socket.emit('displayLine', "Unknown socket " + socketId)
		socket.emit('endOfDisplay', {})
	})
	socket.on('displayAllSockets', () => {
		for (let socketId in sockets) {
			socket.emit('displayLine', "Socket: " + socketId + " type: " + sockets[socketId].type)
		}
		socket.emit('endOfDisplay', {})
	})
	socket.on('closeParty', (socketId: string) => {
		if (sockets[socketId] && sockets[socketId].type == 'headless') {
			sockets[socketId].socket.disconnect()
			delete sockets[socketId]
			console.log("Socket destroyed by server:", socketId)
		}
		else
			console.log("Can't destroy unknown socket:", socketId)
	})
	socket.on('closeAllParties', () => {
		for (let socketId in sockets) {
			if (sockets[socketId].type == 'headless'){
				sockets[socketId].socket.disconnect()
				delete sockets[socketId]
				console.log("Socket destroyed by server:", socketId)
			}
		}
	})
}

/* -------------------------MAIN CODE------------------------- */

// Setting up socket.IO server
io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(port, {
		cors: {
			origin: '*', // Allow any origin, you can change this to specific domains
			methods: ['GET', 'POST'],
		},
	});
console.log("listening on port:", port)

// Connection handler
io.on('connection', (socket) => {
	sockets[socket.id] = {
		socket: socket,
		type: 'unknown'
	}
	// Identification handler
	socket.on('identification', (socketLoginID: string) => {
		switch (socketLoginID) {
			case clientIDLogin:
				players[socket.id] = createNewPlayer()
				matchQueue[matchQueue.length] = socket.id
				sockets[socket.id].type = 'client'
				setupClientListeners(socket)
				console.log("Player logging in:", socket.id)
				break
			case controlerIDLogin:
				sockets[socket.id].type = 'controler'
				setupControlerListeners(socket)
				console.log("New controler:", socket.id)
				break
			default:
				socket.disconnect()
		}
	})
})