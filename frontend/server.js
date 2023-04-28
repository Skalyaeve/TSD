import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';

/* ------------------- FUNCTIONS ------------------- */

let side = 'left'
let skin = 'mage'

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
		xPos: (side == 'left' ? 100 : 1820),
		yPos: 100 + Math.random() * 880,
		xDir: (side == 'left' ? 'right' : 'left'),
		lastMove: 'none',
		move: 'idle',
		skinId: getSkin(skin).skinId,
		scaleFactor: getSkin(skin).scaleFactor
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

httpServer.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});

// Socket.IO connection handling
const players = {};

io.on('connection', (socket) => {
	console.log(`Player connected: ${socket.id}`);

	// Create a new player with a unique ID and initial position
	const newPlayer = createNewPlayer(`${socket.id}`);

	// Add the new player to the players object
	players[socket.id] = newPlayer

	// Send the current players list to the newly connected player
	socket.emit('currentPlayers', Object.values(players));

	// Send the player his own ID
	socket.emit('ownID', `${socket.id}`)

	// Notify all clients about the new player
	socket.broadcast.emit('newPlayer', newPlayer);

	// When the player start moving, update its velocity and notify other clients
	socket.on('playerMovement', (movementData) => {
		players[socket.id].xPos = movementData.xPos;
		players[socket.id].yPos = movementData.yPos;

		socket.broadcast.emit('playerMoved', players[socket.id]);
	});

	// When the player stop moving, update its velocity and notify other clients
	socket.on('playerStop', (movementData) => {
		players[socket.id].xPos = movementData.xPos
		players[socket.id].yPos = movementData.yPos

		socket.broadcast.emit('playerStoped', players[socket.id])
	})

	// When the player disconnects, remove them from the players object and notify other clients
	socket.on('disconnect', () => {
		console.log(`Player disconnected: ${socket.id}`);
		delete players[socket.id];
		io.emit('playerDisconnected', socket.id);
	});
});

