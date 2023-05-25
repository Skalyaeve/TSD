/* -------------------------LIBRARIES IMPORTS------------------------- */

import { v4 as uuidv4 } from 'uuid';
import { Worker } from 'worker_threads'
import { Server, Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';

/* -------------------------TYPES------------------------- */

// Socket and socket type
interface socketInfo {
	socket: Socket								// Socket
	type: string | undefined					// Socket type
}

// Player key states
interface keyStates {
	up: boolean									// Player UP key state
	down: boolean								// Player DOWN key state
	left: boolean								// Player LEFT key state
	right: boolean								// Player RIGHT key state
}

// Skins
interface skin {
	name: string								// Skin name
	width: number								// Skin width
	height: number								// Skin height
}

// Players
interface player {
	id: string									// Player ID
	sessionId: string | undefined
	skin: string

	/*xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	xDir: string								// Player X direction (left/right)
	keyStates: keyStates						// Player key states
	xVel: number								// Player X velocity
	yVel: number								// Player Y velocity
	lastMove: string							// Player last movement state (none/idle/run)
	move: string								// Player actual movement state (idle/run)
	skin: string								// Player skin name
	anim: string								// Player current animation*/
}

// Party session
interface party {
	id: string
	worker: Worker
	leftPlayerId: string
	rightPlayerId: string
}

// Player construction interface (sent to the client)
interface clientPlayerConstruct {
	side: 'left' | 'right'						// Player side
	skin: "player" | "mage" | "blank" | "black"	// Player skin
}

// Players construction interface (sent to the session)
interface sessionPlayerConstruct {
	side: 'left' | 'right'						// Player side
	xPos: number								// Player initial X position
	yPos: number								// Player initial Y position
	width: number								// Player width
	height: number								// Player height
}

// Player update (sent by the client to the back)
interface playerUpdateFromClient {
	keyStates: keyStates						// Player key states
}

// Player update (sent by the back to the session)
interface playerUpdateToSession {
	side: 'left' | 'right'						// Player side
	keyStates: keyStates						// Player key states
}

// New properties (sent by the session to the back)
interface newPropsFromSession {
	sessionId: string							// Session ID
	leftProps: objectProps						// Left player properties
	rightProps: objectProps						// Right player properties
	ballProps: objectProps						// Ball properties
}

// New properties (sent by the back to the client)
interface newPropsToClient {
	leftProps: objectProps						// Left player properties
	rightProps: objectProps						// Right player properties
	ballProps: objectProps						// Ball properties
}

// Properties of a game object (sent to the client)
interface objectProps {
	xPos: number
	yPos: number
	xVel: number
	yVel: number
}

/* -------------------------WEBSOCKET-CLASS------------------------- */

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] }, namespace: 'game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	readonly clientType: string = "PHASER-WEB-CLIENT"
	readonly controllerType: string = "CONTROLLER"

	matchQueue: string[] = []

	sockets: { [id: string]: socketInfo } = {}

	players: { [id: string]: player } = {}

	parties: { [partyId: string]: party } = {}

	skins: { [key: string]: skin } = {
		['player']: {
			name: 'player',
			width: 100,
			height: 175
		},
		['mage']: {
			name: 'mage',
			width: 250,
			height: 250
		}
	}

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
		anim: 'IdleAnim'
	}*/

	// Create a new client player construct
	newClientConstruct(side: "left" | "right"): clientPlayerConstruct {
		let newPlayer: clientPlayerConstruct = {
			side: side,
			skin: 'mage',
		}
		return newPlayer
	}

	// Create a new sesion player construct
	newSessionConstruct(side: "left" | "right", width: number, height: number): sessionPlayerConstruct {
		let newPlayer: sessionPlayerConstruct = {
			side: side,
			xPos: (side == 'left' ? 250 : 1670),
			yPos: 540,
			width: width,
			height: height,
		}
		return newPlayer
	}

	// Starts a new party
	createParty(leftPlayerId: string, rightPlayerId: string) {
		let newParty: party = {
			id: uuidv4(),
			worker: new Worker('session.js'),
			leftPlayerId: leftPlayerId,
			rightPlayerId: rightPlayerId
		}
		newParty.worker.on('message', (incomingProps: newPropsFromSession) => {
			let outgoingProps: newPropsToClient = {
				leftProps: incomingProps.leftProps,
				rightProps: incomingProps.rightProps,
				ballProps: incomingProps.ballProps
			}
			this.sockets[leftPlayerId].socket.emit('newProps', outgoingProps)
			this.sockets[rightPlayerId].socket.emit('newProps', outgoingProps)
		})
		this.players[leftPlayerId].sessionId = newParty.id
		this.players[rightPlayerId].sessionId = newParty.id
		let leftSkin = this.skins[this.players[leftPlayerId].skin]
		let rightSkin = this.skins[this.players[rightPlayerId].skin]
		let leftClientConstruct: clientPlayerConstruct = this.newClientConstruct('left')
		let rightClientConstruct: clientPlayerConstruct = this.newClientConstruct('right')
		this.sockets[leftPlayerId].socket.emit('playerConstruct', leftClientConstruct)
		this.sockets[rightPlayerId].socket.emit('playerConstruct', rightClientConstruct)
		let leftSessionConstruct: sessionPlayerConstruct = this.newSessionConstruct('left', leftSkin.width, leftSkin.height)
		let rightSessionConstruct: sessionPlayerConstruct = this.newSessionConstruct('right', rightSkin.width, rightSkin.height)
		newParty.worker.postMessage('message', leftSessionConstruct)
		newParty.worker.postMessage('message', rightSessionConstruct)
	}


	checkMatchQueue() {
		if (this.matchQueue.length == 2) {
			this.createParty(this.matchQueue[0], this.matchQueue[1])
			this.matchQueue = []
		}
	}

	/* -------------------------GLOBAL EVENT LISTENERS------------------------- */

	async handleConnection(socket: Socket, ...args: any[]) {
		this.sockets[socket.id] = {
			socket: socket,
			type: undefined,
		};
		socket.emit('Welcome');
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
				console.log("New player session:", socket.id)
				this.sockets[socket.id].type = this.clientType
				this.players[socket.id] = {
					id: socket.id,
					sessionId: undefined,
					skin: "mage"
				}
				this.matchQueue[this.matchQueue.length] = socket.id
				this.checkMatchQueue()
				break
			case this.controllerType:
				console.log("New controller:", socket.id)
				this.sockets[socket.id].type = this.controllerType
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

	/* -------------------------CONTROLLER EVENT LISTENERS------------------------- */

	// Creates a new party
	@SubscribeMessage('newParty')
	handleNewParty(socket: Socket) {
		if (this.sockets[socket.id].type == this.controllerType) {
			console.log("New Headless Session")
			this.setupAuthoritativePhaser()
		}
	}

	// Display a connected socket to the controller
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

	// Display all the connected sockets to the controller
	@SubscribeMessage('displayAllSocket')
	handleDisplayAllSocket(socket: Socket) {
		if (this.sockets[socket.id].type == this.controllerType) {
			for (let socketId in this.sockets)
				socket.emit('displayLine', "Socket: " + socketId + " type: " + this.sockets[socketId].type)
			socket.emit('endOfDisplay')
		}
	}

	/*@SubscribeMessage('closeParty')
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
	}*/

	/*@SubscribeMessage('closeAllParties')
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
	}*/
}
