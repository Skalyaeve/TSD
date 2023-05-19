/* -------------------------LIBRARIES IMPORTS------------------------- */

import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { JSDOM } from 'jsdom';
import * as path from 'path';

/* -------------------------TYPES------------------------- */

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

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'], namespace: 'game' } })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	/* -------------------------VARIABLES------------------------- */

	readonly clientIDLogin: string = "PHASER-WEB-CLIENT"
	readonly headlessIDLogin: string = "PHASER-HEADLESS-CLIENT"
	readonly controllerIDLogin: string = "CONTROLLER"

	sockets: { [id: string]: socketInfo } = {}

	players: { [id: string]: player } = {}
	headless: string[] = []
	matchQueue: string[] = []

	nbRight: number = 0
	nbLeft: number = 0

	/* -------------------------FUNCTIONS------------------------- */

	createNewPlayer(): player {
		let finalSide = (this.nbRight > this.nbLeft ? 'left' : 'right')
		if (this.nbRight > this.nbLeft)
			this.nbLeft = this.nbLeft + 1
		else
			this.nbRight = this.nbRight + 1
		console.log(finalSide + " connected", "r:", this.nbRight, "l:", this.nbLeft)
		let newPlayer: player = {
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
	setupAuthoritativePhaser() {
		JSDOM.fromFile(path.join(__dirname, '../authoritative_server/dist/index.html'), {
			// To run the scripts in the html file
			runScripts: "dangerously",
			// Also load supported external resources
			resources: "usable",
			// So requestAnimatinFrame events fire
			pretendToBeVisual: true
		})
	}

	/* -------------------------GLOBAL EVENT LISTENERS------------------------- */

	async handleConnection(client: Socket, ...args: any[]) {
		client.emit('ownID', `${client.id}`);
		this.sockets[client.id] = {
			socket: client,
			type: 'unknown',
		};
	}

	async handleDisconnect(client: Socket) {
		// Disconnect logic here...
	}

	@SubscribeMessage('identification')
	handleIdentification(client: Socket, payload: string) {
		switch (payload) {
			case this.clientIDLogin:
				//players[socket.id] = createNewPlayer()
				//matchQueue[matchQueue.length] = socket.id
				this.sockets[client.id].type = 'client'
				console.log("Player logging in:", client.id)
				break
			case this.headlessIDLogin:
				//headless[headless.length] = socket.id
				this.sockets[client.id].type = 'headless'
				console.log("New headless session:", client.id)
				break
			case this.controllerIDLogin:
				this.sockets[client.id].type = 'controler'
				console.log("New controler:", client.id)
				break
			default:
				client.disconnect()
		}
	}

	/* -------------------------WEB EVENT LISTENERS------------------------- */

	/* -------------------------HEADLESS EVENT LISTENERS------------------------- */

	/* -------------------------CONTROLLER EVENT LISTENERS------------------------- */

	@SubscribeMessage('newParty')
	handleNewParty(client: Socket) {
		if (this.sockets[client.id].type == this.controllerIDLogin) {
			console.log("New Headless Session")
			this.setupAuthoritativePhaser()
		}
	}

	@SubscribeMessage('displaySocket')
	handleDisplaySocket(client: Socket, payload: string) {
		if (this.sockets[client.id].type == this.controllerIDLogin) {
			if (this.sockets[payload])
				client.emit('displayLine', "Socket: " + payload + " type: " + this.sockets[payload].type)
			else
				client.emit('displayLine', "Unknown socket: " + payload)
			client.emit('endOfDisplay')
		}
	}

	@SubscribeMessage('displayAllSocket')
	handleDisplayAllSocket(client: Socket) {
		if (this.sockets[client.id].type == this.controllerIDLogin) {
			for (let socketId in this.sockets)
				client.emit('displayLine', "Socket: " + socketId + " type: " + this.sockets[socketId].type)
			client.emit('endOfDisplay')
		}
	}

	/*@SubscribeMessage('displayAllSocket')
	handleDisplayAllSocket(client: Socket) {
		if (this.sockets[client.id].type == this.controllerIDLogin) {
			for (let socketId in this.sockets)
				client.emit('displayLine', "Socket: " + socketId + " type: " + this.sockets[socketId].type)
			client.emit('endOfDisplay')
		}
	}*/
}
