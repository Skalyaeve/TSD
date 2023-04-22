import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
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

// Player class definition
class Player {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }
}

// Socket.IO connection handling
const players = new Map();

io.on('connection', (socket) => {
	console.log('a user connected');

	// Add your Socket.IO event handling logic here
	// e.g., socket.on('event_name', (data) => {});

	socket.on('disconnect', () => {
		console.log('user disconnected');
	});
});

