import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/* ------------------- FUNCTIONS ------------------- */

let side = 'left'

function getSkin(skinName) {
	let scaleFactor
	let skinId
	if (skinName == 'mage') {
		scaleFactor = 2.5
		skinId = 1
	}
	else {
		scaleFactor = 1
		skinId = 0
	}
	return {
		scaleFactor,
		skinId
	}
}

function createNewPlayer(idStr) {
	if (side == 'left')
		side = 'right'
	else side = 'left'
	return {
		id: idStr,
		xPos: (side == 'left' ? 250 : 1670),
		yPos: 250 + Math.random() * 580,
		xDir: (side == 'left' ? 'right' : 'left'),
		lastMove: 'none',
		move: 'idle',
		skin: 'mage',
		anim: 'IdleAnim'
	}
}

/* ------------------- START THE SERVER ------------------- */

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: '*', // Allow any origin, you can change this to specific domains
		methods: ['GET', 'POST'],
	},
});

const port = process.env.PORT || 3001;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Serve static assets from the 'dist' folder
app.use(express.static(path.join(__dirname, 'dist')));

// Serve the index.html file for all routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start listening on specified port
httpServer.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// Socket.IO connection handling
const players = {};

io.on('connection', (socket) => {
	console.log(`Player connected: ${socket.id}`);
	// Send the player his own ID
	socket.emit('ownID', `${socket.id}`)

	// Create a new player with a unique ID and initial position
	const newPlayer = createNewPlayer(`${socket.id}`);
	// Add the new player to the players object
	players[socket.id] = newPlayer
	// Send the current players list to the newly connected player
	socket.emit('currentPlayers', Object.values(players));
	// Notify all clients about the new player
	socket.broadcast.emit('newPlayer', newPlayer);

	// When the player starts moving, notify other clients
	socket.on('playerStart', () => {
		socket.broadcast.emit('playerStarted', players[socket.id].id);
	})
	// When the player is moving, update its velocity and notify other clients
	socket.on('playerMovement', (movementData) => {
		players[socket.id].xPos = movementData.xPos
		players[socket.id].yPos = movementData.yPos
		socket.broadcast.emit('playerMoved', players[socket.id].id, movementData.xPos, movementData.yPos);
	});
	// When the player stop moving, notify other clients
	socket.on('playerStop', () => {
		socket.broadcast.emit('playerStoped', players[socket.id].id)
	})

	// When the player disconnects, remove them from the players object and notify other clients
	socket.on('disconnect', () => {
		console.log(`Player disconnected: ${socket.id}`);
		delete players[socket.id];
		io.emit('playerDisconnected', socket.id);
	});
});

