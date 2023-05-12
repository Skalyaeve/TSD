import { path } from 'path';

import { Server } from 'socket.io'

import { JSDOM } from 'jsdom';

let port					// Listening port for socket.io
let io						// Socket.io server

function setupAuthoritativePhaser() {
	JSDOM.fromFile(path.join(__dirname, 'authoritative_server/dist/index.html'), {
		// To run the scripts in the html file
		runScripts: "dangerously",
		// Also load supported external resources
		resources: "usable",
		// So requestAnimatinFrame events fire
		pretendToBeVisual: true
	})
}

port = process.env.PORT || 3001
io = new Server(port, {
	cors: {
		origin: '*', // Allow any origin, you can change this to specific domains
		methods: ['GET', 'POST'],
	},
})
console.log("listening on 3001")
setupAuthoritativePhaser();