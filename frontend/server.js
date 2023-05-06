import path from 'path'
import express from 'express'
import { dirname } from 'path'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { Worker } from 'worker_threads'

/* -------------------------VARIABLES------------------------- */

const players = {}
const app = express()
const httpServer = createServer(app)
const port = process.env.PORT || 3001
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const clientWorker = new Worker('./backDist/headlessClient.js')

const io = new Server(httpServer, {
	cors: {
		origin: '*', // Allow any origin, you can change this to specific domains
		methods: ['GET', 'POST'],
	},
})

let nbLeft = 0
let nbRight = 0

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

/* -------------------------SERVER CODE------------------------- */

// Serve static assets from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')))

// Serve the index.html file for all routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

// Start listening on specified port
httpServer.listen(port, () => {
	console.log(`Server listening on port ${port}`)
})

clientWorker.on('message', (data) => {
	io.emit('update', data)
})

// Socket.IO connection handling
io.on('connection', (socket) => {
	console.log(`Player connected: ${socket.id}`)
	// Send the player his own ID
	socket.emit('ownID', `${socket.id}`)

	// Create a new player with a unique ID and initial position
	const newPlayer = createNewPlayer(`${socket.id}`)
	// Add the new player to the players object
	players[socket.id] = newPlayer
	// Send the current players list to the newly connected player
	socket.emit('currentPlayers', Object.values(players))
	
	// Notify all clients and the headless client about the new player
	clientWorker.postMessage({ type: 'newPlayer', player: newPlayer})
	socket.broadcast.emit('newPlayer', newPlayer)

	//WORK IN PROGRESS HERE

	// When the player starts moving, notify other clients
	socket.on('playerStart', () => {
		socket.broadcast.emit('playerStarted', players[socket.id].id)
	})

	// When the player is moving, update its velocity and notify other clients
	socket.on('playerMovement', (movementData) => {
		players[socket.id].xPos = movementData.xPos
		players[socket.id].yPos = movementData.yPos
		socket.broadcast.emit('playerMoved', players[socket.id].id, movementData.xPos, movementData.yPos)
	})

	// When the player stop moving, notify other clients
	socket.on('playerStop', () => {
		socket.broadcast.emit('playerStoped', players[socket.id].id)
	})

	//WORK IN PROGRESS HERE

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

