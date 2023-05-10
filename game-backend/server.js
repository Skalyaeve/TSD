/* -------------------------LIBRARIES IMPORTS------------------------- */

if (cluster.isWorker) {
	const file = process.env.file
	(await import(file)).default()
}

import cluster from 'cluster'
import path from 'path'
import { Server } from 'socket.io'
import { JSDOM } from 'jsdom'

/* -------------------------CHILD CODE REDIRECION------------------------- */



/* -------------------------VARIABLES------------------------- */

const port = process.env.PORT || 3001

let io
let workerId = -1 			// Headless client worker thread
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

function updateBackEndPlayerList(playerList, moved) {
	for (let playerId of moved) {
		players[playerId] = playerList[playerId]
	}
}

function setupAuthoritativePhaser() {
	JSDOM.fromFile(path.join(process.cwd(), 'src/index.html'), {
		// To run the scripts in the html file
		runScripts: "dangerously",
		// Also load supported external resources
		resources: "usable",
		// So requestAnimatinFrame events fire
		pretendToBeVisual: true
	})
}

/* -------------------------SERVER CODE------------------------- */

// Configure server
setupAuthoritativePhaser()
io = new Server(port, {
	cors: {
		origin: '*', // Allow any origin, you can change this to specific domains
		methods: ['GET', 'POST'],
	},
})

// Starting headless client worker
cluster.on('fork', (worker) => {
	console.log(`Worker ${worker.id} created`)
	workerId = worker.id
})
cluster.fork({ file: path.join(process.cwd(), 'src/js/headlessClient2.js') })
console.log('Started client worker')

// Client worker listener
cluster.on('message', (data) => {
	switch (data.type) {
		case 'playerUpdate':
			updateBackEndPlayerList(data.players, data.moved)
			io.emit('playerMoved', players) // Removed 'moved' variable since it's not defined
			break
		default:
	}
})

console.log("Starting connection")
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
	cluster.workers[workerId].send({ type: 'newPlayer', player: newPlayer })
	// WORKER x BACK => CLIENT
	socket.broadcast.emit('newPlayer', newPlayer)

	// When the player starts moving, notify other clients
	socket.on('playerStart', () => {
		// WORKER x BACK => CLIENT
		socket.broadcast.emit('playerStarted', players[socket.id].id)
	})

	// When the player is moving, update its velocity and notify other clients
	socket.on('playerKeyUpdate', (movementData) => {
		players[movementData.playerId].keyStates = movementData.keyStates
		cluster.workers[workerId].send({ type: 'playerKeyUpdate', playerId: movementData.playerId, keyStates: movementData.keyStates })
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

