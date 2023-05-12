import * as path from 'path';

import { Server } from 'socket.io';

import { JSDOM } from 'jsdom';

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

const port = 3001
const io = new Server(port, {
	cors: {
		origin: '*', // Allow any origin, you can change this to specific domains
		methods: ['GET', 'POST'],
	},
})
console.log("listening on 3001")
setupAuthoritativePhaser();