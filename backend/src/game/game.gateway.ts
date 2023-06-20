/* -------------------------LIBRARIES IMPORTS------------------------- */

import { v4 as uuidv4 } from 'uuid';
import { Worker } from 'worker_threads'
import { Server, Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
/*import { UserSocketsService } from '../chat/chat.userSocketsService.js';
import { ChatService } from '../chat/chat.service.js';*/

/* -------------------------TYPES------------------------- */

// Socket and socket type
interface socketInfo {
	socket: Socket									// Socket
	type: string | undefined						// Socket type
}

// Player key states
interface keyStates {
	up: boolean										// Player UP key state
	down: boolean									// Player DOWN key state
	left: boolean									// Player LEFT key state
	right: boolean									// Player RIGHT key state
}

// Skins
interface skin {
	name: string									// Skin name
	width: number									// Skin width
	height: number									// Skin height
}

// Players
interface player {
	id: string										// Player ID
	sessionId: string | undefined					// Player session ID
	skin: string									// Player skin name
}

// Party session
interface party {
	id: string										// Party id
	worker: Worker									// Party worker	
	leftPlayerId: string							// Party left player ID
	rightPlayerId: string							// Party right player ID
}

// Party login data
interface loginData {
	sessionId: string
}

// Player construction interface (sent to the client)
interface clientPlayerConstruct {
	side: 'left' | 'right'							// Player side
	skin: string									// Player skin
}

// Players construction interface (sent to the session)
interface sessionPlayerConstruct {
	side: 'left' | 'right'							// Player side
	xPos: number									// Player initial X position
	yPos: number									// Player initial Y position
	width: number									// Player width
	height: number									// Player height
}

// Player update (sent by the back to the session)
interface playerUpdateToSession {
	side: 'left' | 'right'							// Player side
	keyStates: keyStates							// Player key states
}

// New properties (sent by the session to the back)
interface newPropsFromSession {
	sessionId: string								// Session ID
	leftProps: objectProps							// Left player properties
	rightProps: objectProps							// Right player properties
	ballProps: objectProps							// Ball properties
}

// New properties (sent by the back to the client)
interface newPropsToClient {
	leftProps: objectProps							// Left player properties
	rightProps: objectProps							// Right player properties
	ballProps: objectProps							// Ball properties
}

// Properties of a game object (sent to the client)
interface objectProps {
	xPos: number									// X coordinate of object
	yPos: number									// Y coordinate of object
}

/* -------------------------WEBSOCKET-CLASS------------------------- */

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] }, namespace: 'game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer()
	server: Server;

	private readonly clientType: string = "PHASER-WEB-CLIENT"
	private readonly controllerType: string = "CONTROLLER"
	/*private readonly userService: UserSocketsService = new UserSocketsService
	private readonly chatService: ChatService*/

	private matchQueue: string[] = []

	private sockets: { [id: string]: socketInfo } = {}

	private players: { [id: string]: player } = {}

	private parties: { [partyId: string]: party } = {}

	private skins: { [key: string]: skin } = {
		['Boreas']: {
			name: 'Boreas',
			width: 16,
			height: 20
		}
	}

	/* -------------------------FUNCTIONS------------------------- */

	// Create a new client player construct
	newClientConstruct(side: "left" | "right"): clientPlayerConstruct {
		let newPlayer: clientPlayerConstruct = {
			side: side,
			skin: 'Boreas',
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

	
	// Set session id in player object and emit to each client it's side
	initialiseWebClients(leftPlayerId: string, rightPlayerId: string, newParty: party){
		this.players[leftPlayerId].sessionId = newParty.id
		this.players[rightPlayerId].sessionId = newParty.id
		this.sockets[leftPlayerId].socket.emit('clientSide', 'left')
		this.sockets[rightPlayerId].socket.emit('clientSide', 'right')
	}

	// Create the loginData object to store the session id and send it to the session
	createWorker(newParty: party){
		let sessionLoginData: loginData = { sessionId: newParty.id }
		newParty.worker.postMessage(sessionLoginData)
		// Session message listener
		newParty.worker.on('message', (incomingProps: newPropsFromSession) => {
			let outgoingProps: newPropsToClient = {
				leftProps: incomingProps.leftProps,
				rightProps: incomingProps.rightProps,
				ballProps: incomingProps.ballProps
			}
			this.sockets[newParty.leftPlayerId].socket.emit('newProps', outgoingProps)
			this.sockets[newParty.rightPlayerId].socket.emit('newProps', outgoingProps)
		})
	}

	// Create the player construct objects for clients and emit them to each client
	createWebConstructs(leftPlayerId: string, rightPlayerId: string){
		let leftClientConstruct: clientPlayerConstruct = this.newClientConstruct('left')
		let rightClientConstruct: clientPlayerConstruct = this.newClientConstruct('right')
		this.sockets[leftPlayerId].socket.emit('playerConstruct', leftClientConstruct)
		this.sockets[rightPlayerId].socket.emit('playerConstruct', leftClientConstruct)
		this.sockets[leftPlayerId].socket.emit('playerConstruct', rightClientConstruct)
		this.sockets[rightPlayerId].socket.emit('playerConstruct', rightClientConstruct)
	}

	// Get skins for both side, create the session construct objects and emit them to the session
	createSessionConstructs(leftPlayerId: string, rightPlayerId: string, newParty: party){
		let leftSkin = this.skins[this.players[leftPlayerId].skin]
		let rightSkin = this.skins[this.players[rightPlayerId].skin]
		let leftSessionConstruct: sessionPlayerConstruct = this.newSessionConstruct('left', leftSkin.width, leftSkin.height)
		let rightSessionConstruct: sessionPlayerConstruct = this.newSessionConstruct('right', rightSkin.width, rightSkin.height)
		newParty.worker.postMessage(leftSessionConstruct)
		newParty.worker.postMessage(rightSessionConstruct)
	}
	20
	// Starts a new party
	async createParty(leftPlayerId: string, rightPlayerId: string) {
		this.sockets[leftPlayerId].socket.emit('matched')
		this.sockets[rightPlayerId].socket.emit('matched')
		// Create new session
		let newParty: party = {
			id: uuidv4(),
			worker: new Worker('./toolDist/session.js'),
			leftPlayerId: leftPlayerId,
			rightPlayerId: rightPlayerId
		}
		// Store the new party in the parties object
		this.parties[newParty.id] = newParty
		console.log("New party: ", newParty.id)
		// Wait for party to be created and sens constructs to clients and session
		setTimeout(() => {
			this.initialiseWebClients(leftPlayerId, rightPlayerId, newParty)
			this.createWorker(newParty)
			this.createWebConstructs(leftPlayerId, rightPlayerId)
			this.createSessionConstructs(leftPlayerId, rightPlayerId, newParty)
		}, 100)
	}

	// Creates a new party if 
	checkMatchQueue() {
		if (this.matchQueue.length >= 2) {
			console.log("More than 2 players in matchmaking queue starting a new session")
			let firstPlayer = this.matchQueue.pop()
			let secondPlayer = this.matchQueue.pop()
			this.createParty(firstPlayer, secondPlayer)
		}
	}

	/* -------------------------GLOBAL EVENT LISTENERS------------------------- */

	async handleConnection(socket: Socket, ...args: any[]) {
		this.sockets[socket.id] = {
			socket: socket,
			type: undefined,
		};
		/*let userData = await this.chatService.getUserFromSocket(socket)
		let userSockets = this.userService.getUserSocketIds(userData.id)
		if (!userData)
			console.log("Not connected")
		else{
			this.userService.setUser(userData.id, socket)
		}*/
		socket.emit('Welcome');
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
					skin: "Boreas"
					// CALL DB TO GET SKIN
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

	@SubscribeMessage('stopMatchmaking')
	handleStopMatchmaking(socket: Socket){
		for (let index = 0; index < this.matchQueue.length; index++){
			if (this.matchQueue[index] == socket.id){
				this.matchQueue.splice(index, 1)
			}
			break
		}
		socket.emit('unmatched')
	}

	@SubscribeMessage('playerKeyUpdate')
	handlePlayerKeyUpdate(socket: Socket, payload: keyStates) {
		if (this.sockets[socket.id].type == this.clientType && this.players[socket.id].sessionId) {
			let sessionId: string = this.players[socket.id].sessionId
			let update: playerUpdateToSession = {
				side: (this.parties[sessionId].leftPlayerId == socket.id ? 'left' : 'right'),
				keyStates: payload
			}
			this.parties[sessionId].worker.postMessage(update)
		}	
	}

	
	/*@SubscribeMessage('playerStart')
	handlePlayerStart(socket: Socket) {
		if (this.sockets[socket.id].type == this.clientType) {
		}
	}

	@SubscribeMessage('playerStop')
	handlePlayerStop(socket: Socket) {
		if (this.sockets[socket.id].type == this.clientType) {
		}
	}*/

	/* -------------------------CONTROLLER EVENT LISTENERS------------------------- */

	/*// Display a connected socket to the controller
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
	}*/
}
