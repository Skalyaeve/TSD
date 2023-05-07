/* -------------------------LIBRARIES IMPORTS------------------------- */

import { Server } from 'socket.io'
import { Worker } from 'worker_threads'

/* -------------------------VARIABLES------------------------- */

let port					// Listening port for socket.io
let io						// Socket.io server
let clientWorker 			// Headless client worker thread
let players = {}			// Player list
let nbLeft = 0				// Number of players in the right side
let nbRight = 0				// Number of player in the left side

/* -------------------------FUNCTIONS------------------------- */

// Creates a new player and returns it to the server
function createNewPlayer(idStr) {
	let finalSide = (nbRight > nbLeft ? 'left' : 'right')
	console.log(finalSide + " connected")
	if (nbRight > nbLeft)
		nbLeft = nbLeft + 1
	else
		nbRight = nbRight + 1
	console.log("r:", nbRight, "l:", nbLeft)
	return {
		id: idStr,
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
}

function updateBackEndPlayerList(playerList, moved){
	for (let playerId of moved){
		players[playerId] = playerList[playerId]
	}
}

/* -------------------------SERVER CODE------------------------- */

// Configure listening port and socket.io server
port = process.env.PORT || 3001
io = new Server(port, {
	cors: {
		origin: '*', // Allow any origin, you can change this to specific domains
		methods: ['GET', 'POST'],
	},
})
console.log(`Server listening on port ${port}`)

// Starting headless client worker
clientWorker = new Worker('./backDist/headlessClient.js')

// Client worker listener
clientWorker.on('message', (data) => {
	switch (data.type) {
		case 'playerUpdate':
			updateBackEndPlayerList(data.players, data.moved)
			io.emit('playerMoved', players, moved)
			break
		default:
	}
})

// Socket.io on connection
io.on('connection', (socket) => {
	console.log(`Player connected: ${socket.id}`)

	// Send the player his own ID
	// WORKER x BACK => CLIENT
	socket.emit('ownID', `${socket.id}`)

	// Create a new player with a unique ID
	const newPlayer = createNewPlayer(`${socket.id}`)

	// Add the new player to the player list
	players[socket.id] = newPlayer
	
	// Send the current players list to the newly connected player
	// WORKER x BACK => CLIENT
	socket.emit('currentPlayers', Object.values(players))
	
	// Notify all clients and the headless client about the new player
	clientWorker.postMessage({ type: 'newPlayer', player: newPlayer})
	// WORKER x BACK => CLIENT
	socket.broadcast.emit('newPlayer', newPlayer)

	// When the player starts moving, notify other clients
	socket.on('playerStart', () => {
		// WORKER x BACK => CLIENT
		socket.broadcast.emit('playerStarted', players[socket.id].id)
	})

	// When the player is moving, update its velocity and notify other clients
	socket.on('playerMovement', (movementData) => {
		players[socket.id].xPos = movementData.xPos
		players[socket.id].yPos = movementData.yPos
		
	})

	// When the player stop moving, notify other clients
	socket.on('playerStop', () => {
		// WORKER x BACK => CLIENT
		socket.broadcast.emit('playerStoped', players[socket.id].id)
	})


	// When the player disconnects, remove them from the players object and notify other clients
	socket.on('disconnect', () => {
		console.log(`Player disconnected: ${socket.id}`)
		if (players[socket.id].xDir == 'left') {
			nbRight = nbRight - 1
			console.log("right disconnected, right:", nbRight, "left:", nbLeft)
		}
		else {
			nbLeft = nbLeft - 1
			console.log("left disconnected, right:", nbRight, "left:", nbLeft)
		}
		delete players[socket.id]
		io.emit('playerDisconnected', socket.id)
	})
})

