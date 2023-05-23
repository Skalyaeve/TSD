/* -------------------------LIBRARIES IMPORTS------------------------- */

import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { JSDOM } from 'jsdom';
import * as path from 'path';
import { fileURLToPath } from 'url';

/* -------------------------TYPES------------------------- */

// Socket and socket type for server
interface socketInfo {
	socket: Socket								// Socket
	type: string								// Socket type
}

// Player key states interface
interface keyStates {
	up: boolean									// Player UP key state
	down: boolean								// Player DOWN key state
	left: boolean								// Player LEFT key state
	right: boolean								// Player RIGHT key state
}

// Player update content
interface playerUpdate {
	xPos: number
	yPos: number
	xVel: number
	yVel: number
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

interface playerConstruct {
	id: string
	side: "left" | "right"
	skin: "player" | "mage" | "blank" | "black"
}

interface party {
	id: string
	hostID: string
	playerOneId: string
	playerTwoId: string
}

/* -------------------------PATH CONSTANTS------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------WEBSOCKET-HANDLING------------------------- */

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] }, namespace: 'game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	/* -------------------------VARIABLES------------------------- */

	readonly clientType: string = "PHASER-WEB-CLIENT"
	readonly headlessType: string = "PHASER-HEADLESS-CLIENT"
	readonly controllerType: string = "CONTROLLER"

	matchQueue: string[] = []

	sockets: { [id: string]: socketInfo } = {}

	players: { [id: string]: player } = {}

	parties: { [partyId: string]: party } = {}

	nbRight: number = 0
	nbLeft: number = 0

	dom: JSDOM

	/* -------------------------FUNCTIONS------------------------- */


	/*let newPlayer: player = {
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
		anim: 'IdleAnim'*/

	// Create a new player construct
	createNewPlayer(): playerConstruct {
		let finalSide: "left" | "right" = (this.nbRight > this.nbLeft ? 'left' : 'right')
		this.nbRight > this.nbLeft ? this.nbLeft += 1 : this.nbRight += 1
		console.log(finalSide + " connected", "r:", this.nbRight, "l:", this.nbLeft)
		let newPlayer: playerConstruct = {
			id: uuidv4(),
			side: finalSide,
			skin: 'mage',
		}
		return newPlayer
	}

	// Starts a new headless session
	async setupAuthoritativePhaser() {
		this.dom = await JSDOM.fromFile(path.join(__dirname, '../../headless/bundle/index.html'), {
			// To run the scripts in the html file
			runScripts: "dangerously",
			// Also load supported external resources
			resources: "usable",
			// So requestAnimatinFrame events fire
			pretendToBeVisual: true
		});
	}


	/* -------------------------GLOBAL EVENT LISTENERS------------------------- */

	async handleConnection(socket: Socket, ...args: any[]) {
		this.sockets[socket.id] = {
			socket: socket,
			type: 'unknown',
		};
		socket.emit('ownID', `${socket.id}`);
		console.log("Connection:", socket.id)
	}

	async handleDisconnect(socket: Socket) {
		let client = this.sockets[socket.id]
		if (client.type == this.clientType)
			delete this.sockets[socket.id]
		console.log("Client", client.socket.id, "type:", client.type, "disconnected")
	}

	@SubscribeMessage('identification')
	handleIdentification(socket: Socket, payload: string) {
		switch (payload) {
			case this.clientType:
				this.sockets[socket.id].type = this.clientType
				console.log("New player session:", socket.id)
				break
			case this.headlessType:
				this.sockets[socket.id].type = this.headlessType
				console.log("New headless session:", socket.id)
				break
			case this.controllerType:
				this.sockets[socket.id].type = this.controllerType
				console.log("New controller:", socket.id)
				break
			default:
				console.log("Wrong client type, disconnecting...")
				socket.disconnect()
		}
	}

	/* -------------------------WEB EVENT LISTENERS------------------------- */

	@SubscribeMessage('playerKeyUpdate')
	handlePlayerKeyUpdate(socket: Socket, payload: keyStates) {
		if (this.sockets[socket.id].type == this.clientType) {
		}
	}

	@SubscribeMessage('playerStart')
	handlePlayerStart(socket: Socket) {
		if (this.sockets[socket.id].type == this.clientType) {
		}
	}

	@SubscribeMessage('playerStop')
	handlePlayerStop(socket: Socket) {
		if (this.sockets[socket.id].type == this.clientType) {
		}
	}

	/* -------------------------HEADLESS EVENT LISTENERS------------------------- */

	@SubscribeMessage('playerUpdate')
	handlePlayerUpdate(socket: Socket) {
		if (this.sockets[socket.id].type == this.headlessType) {
		}
	}

	/* -------------------------CONTROLLER EVENT LISTENERS------------------------- */

	@SubscribeMessage('newParty')
	handleNewParty(socket: Socket) {
		if (this.sockets[socket.id].type == this.controllerType) {
			console.log("New Headless Session")
			this.setupAuthoritativePhaser()
		}
	}

	@SubscribeMessage('displaySocket')
	handleDisplaySocket(socket: Socket, payload: string) {
		if (this.sockets[socket.id].type == this.controllerType) {
			if (this.sockets[payload])
				socket.emit('displayLine', "Socket: " + payload + " type: " + this.sockets[payload].type)
			else
				socket.emit('displayLine', "Unknown socket: " + payload)
			socket.emit('endOfDisplay')
		}
	}

	@SubscribeMessage('displayAllSocket')
	handleDisplayAllSocket(socket: Socket) {
		if (this.sockets[socket.id].type == this.controllerType) {
			for (let socketId in this.sockets)
				socket.emit('displayLine', "Socket: " + socketId + " type: " + this.sockets[socketId].type)
			socket.emit('endOfDisplay')
		}
	}

	@SubscribeMessage('closeParty')
	handleCloseParty(socket: Socket, payload: string) {
		if (this.sockets[socket.id].type == this.controllerType) {
			if (this.sockets[payload] && this.sockets[payload].type == this.headlessType) {
				this.sockets[payload].socket.disconnect()
				delete this.sockets[payload]
				console.log("Socket destroyed by server:", payload)
			}
			else
				console.log("Can't destroy unknown socket:", payload)
		}
	}

	@SubscribeMessage('closeAllParties')
	handleCloseAllParties(socket: Socket) {
		if (this.sockets[socket.id].type == this.controllerType) {
			for (let socketId in this.sockets) {
				if (this.sockets[socketId] && this.sockets[socketId].type == this.headlessType) {
					this.sockets[socketId].socket.disconnect()
					delete this.sockets[socketId]
					console.log("Socket destroyed by server:", socketId)
				}
				else
					console.log("Can't destroy unknown socket:", socketId)
			}
		}
	}
}
