/* -------------------------LIBRARIES IMPORTS------------------------- */

import { v4 as uuidv4 } from 'uuid';
import { Worker } from 'worker_threads'
import { Server, Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { log, time } from 'console';
/*import { UserSocketsService } from '../chat/chat.userSocketsService.js';
import { ChatService } from '../chat/chat.service.js';*/

/* -------------------------TYPES------------------------- */

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
	leftSize: {
		width: number
		heigth: number
	}
	rightSize: {
		width: number
		heigth: number
	}
}

// Players
interface player {
	id: string										// Player ID
	workerId: string | undefined					// Player worker ID
	skin: string									// Player skin name
}

// Party worker
interface party {
	id: string										// Party id
	worker: Worker									// Party worker	
	workerState: string
	leftPlayerId: string							// Party left player ID
	leftPlayerState: string
	rightPlayerId: string							// Party right player ID
	rightPlayerState: string
}

// Party login data
interface loginData {
	workerId: string
}

// Player construction interface (sent to the client)
interface clientPlayerConstruct {
	side: 'left' | 'right'							// Player side
	skin: string									// Player skin
}

// Players construction interface (sent to the worker)
interface workerPlayerConstruct {
	side: 'left' | 'right'							// Player side
	xPos: number									// Player initial X position
	yPos: number									// Player initial Y position
	width: number									// Player width
	height: number									// Player height
}

// Player update (sent by the back to the worker)
interface playerUpdateToWorker {
	side: 'left' | 'right'							// Player side
	keyStates: keyStates							// Player key states
}

interface gameState {
	actualState: string
}

interface stateUpdate {
	newState: string
}

// New properties (sent by the worker to the back)
interface newPropsFromWorker {
	workerId: string								// Worker ID
	leftProps: objectProps							// Left player properties
	rightProps: objectProps							// Right player properties
	ballProps: objectProps							// Ball properties
}

// New properties (sent by the client to the back)
interface newPropsFromClient {
	keys: keyStates,
	dir: "up" | "down" | "left" | "right" | "none" | undefined
}

// New properties (sent by the back to the client)
interface newPropsToClient {
	leftProps: objectProps							// Left player properties
	rightProps: objectProps							// Right player properties
	ballProps: objectProps							// Ball properties
}

interface newDirection {
	left: "up" | "down" | "left" | "right" | "none" | undefined
	right: "up" | "down" | "left" | "right" | "none" | undefined
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

	/*private readonly userService: UserSocketsService = new UserSocketsService
	private readonly chatService: ChatService*/

	private matchQueue: string[] = []

	private sockets: { [id: string]: Socket } = {}

	private players: { [id: string]: player } = {}

	private parties: { [partyId: string]: party } = {}

	private skins: { [key: string]: skin } = {
		['Test']: {
			name: 'Test',
			leftSize: {
				width: 25,
				heigth: 25
			},
			rightSize: {
				width: 25,
				heigth: 25
			},
		},
		['Boreas']: {
			name: 'Boreas',
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
		},
		['Fealeen']: {
			name: 'Fealeen',
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
		},
		['Garrick']: {
			name: 'Garrick',
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
		},
		['Helios']: {
			name: 'Helios',
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 19
			},
		},
		['Liliana']: {
			name: 'Liliana',
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
		},
		['Orion']: {
			name: 'Orion',
			leftSize: {
				width: 15,
				heigth: 18
			},
			rightSize: {
				width: 15,
				heigth: 18
			},
		},
		['Rylan']: {
			name: 'Rylan',
			leftSize: {
				width: 15,
				heigth: 18
			},
			rightSize: {
				width: 15,
				heigth: 18
			},
		},
		['Selene']: {
			name: 'Selene',
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
		},
		['Thorian']: {
			name: 'Thorian',
			leftSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
			rightSize: {
				width: 15, // A CORRIGER
				heigth: 18
			},
		},
	}

	/* -------------------------FUNCTIONS------------------------- */

	// Type checker for new props
	isNewProps(payload: newPropsFromWorker | gameState): payload is newPropsFromWorker {
		return (<newPropsFromWorker>payload).ballProps !== undefined
	}

	// Type checker for game state
	isGameState(incomingData: newPropsFromWorker | gameState): incomingData is gameState {
		return (<gameState>incomingData).actualState !== undefined
	}

	// Create the loginData object to store the worker id and send it to the worker
	createWorker(newParty: party) {
		newParty.worker.on('message', (payload: newPropsFromWorker | gameState) => {
			if (this.isNewProps(payload)) {
				let outgoingProps: newPropsToClient = {
					leftProps: payload.leftProps,
					rightProps: payload.rightProps,
					ballProps: payload.ballProps
				}
				if (this.players[newParty.leftPlayerId].workerId)
					this.sockets[newParty.leftPlayerId].emit('newProps', outgoingProps)
				if (this.players[newParty.rightPlayerId].workerId)
					this.sockets[newParty.rightPlayerId].emit('newProps', outgoingProps)
			}
			else if (this.isGameState(payload)) {
				newParty.workerState = payload.actualState
				if (newParty.workerState == 'init') {
					let workerLoginData: loginData = { workerId: newParty.id }
					newParty.worker.postMessage(workerLoginData)
				}
				else if (newParty.workerState == 'ready') {
					this.createWorkerConstructs(newParty.leftPlayerId, newParty.rightPlayerId, newParty)
				}
				else if (newParty.workerState == 'created' && newParty.leftPlayerState == 'created' && newParty.rightPlayerState == 'created') {
					newParty.worker.postMessage({ newState: "started" })
				}
			}
		})
	}

	// Create the player construct objects for clients and emit them to each client
	createWebConstructs(leftPlayerId: string, rightPlayerId: string) {
		let leftClientConstruct: clientPlayerConstruct = { side: "left", skin: this.players[leftPlayerId].skin }
		let rightClientConstruct: clientPlayerConstruct = { side: "right", skin: this.players[rightPlayerId].skin }
		if (this.players[leftPlayerId].workerId) {
			this.sockets[leftPlayerId].emit('playerConstruct', leftClientConstruct)
			this.sockets[leftPlayerId].emit('playerConstruct', rightClientConstruct)
		}
		if (this.players[leftPlayerId].workerId) {
			this.sockets[rightPlayerId].emit('playerConstruct', leftClientConstruct)
			this.sockets[rightPlayerId].emit('playerConstruct', rightClientConstruct)
		}
	}

	// Create a new sesion player construct
	newWorkerConstruct(side: "left" | "right", width: number, height: number): workerPlayerConstruct {
		return {
			side: side,
			xPos: (side == 'left' ? 250 : 1670),
			yPos: 540,
			width: width,
			height: height,
		}
	}

	// Get skins for both side, create the worker construct objects and emit them to the worker
	createWorkerConstructs(leftPlayerId: string, rightPlayerId: string, newParty: party) {
		let leftSkin = this.skins[this.players[leftPlayerId].skin]
		let rightSkin = this.skins[this.players[rightPlayerId].skin]
		let leftWorkerConstruct = this.newWorkerConstruct('left', leftSkin.rightSize.width, leftSkin.rightSize.heigth)
		let rightWorkerConstruct = this.newWorkerConstruct('right', rightSkin.rightSize.width, rightSkin.rightSize.heigth)
		newParty.worker.postMessage(leftWorkerConstruct)
		newParty.worker.postMessage(rightWorkerConstruct)
	}

	// Starts a new party
	async createParty(leftPlayerId: string, rightPlayerId: string) {
		let newParty: party = {
			id: uuidv4(),
			worker: new Worker('./toolDist/worker.js'),
			workerState: "building",
			leftPlayerId: leftPlayerId,
			leftPlayerState: "building",
			rightPlayerId: rightPlayerId,
			rightPlayerState: "building"
		}
		this.parties[newParty.id] = newParty
		this.players[leftPlayerId].workerId = newParty.id
		this.players[rightPlayerId].workerId = newParty.id
		if (this.players[leftPlayerId].workerId)
			this.sockets[leftPlayerId].emit('matched')
		if (this.players[rightPlayerId].workerId)
			this.sockets[rightPlayerId].emit('matched')
		this.createWorker(newParty)
	}

	// Creates a new party if there is at least two player in the queue
	checkMatchQueue() {
		if (this.matchQueue.length >= 2) {
			console.log("NEW MATCH")
			let firstPlayer = this.matchQueue.pop()
			let secondPlayer = this.matchQueue.pop()
			this.createParty(firstPlayer, secondPlayer)
		}
	}

	/* -------------------------GLOBAL EVENT LISTENERS------------------------- */

	// Event handler for connection
	async handleConnection(socket: Socket, ...args: any[]) {
		/*let userData = await this.chatService.getUserFromSocket(socket)
		let userSockets = this.userService.getUserSocketIds(userData.id)
		if (!userData)
		console.log("Not connected")
		else {
			this.userService.setUser(userData.id, socket)
		}*/
		console.log("New player connecting:", socket.id)
		this.sockets[socket.id] = socket
		this.players[socket.id] = {
			id: socket.id,
			workerId: undefined,
			skin: "Boreas"
			// CALL DB TO GET SKIN
		}
		this.matchQueue.push(socket.id)
		socket.emit('matching');
		this.checkMatchQueue()
	}

	// Event handler for stopMatchmaking request
	@SubscribeMessage('stopMatchmaking')
	handleStopMatchmaking(socket: Socket) {
		for (let index = 0; index < this.matchQueue.length; index++) {
			if (this.matchQueue[index] == socket.id) {
				this.matchQueue.splice(index, 1)
				break
			}
		}
		socket.emit('unmatched')
	}

	// Event handler for player key update
	@SubscribeMessage('playerKeyUpdate')
	handlePlayerKeyUpdate(socket: Socket, payload: newPropsFromClient) {
		if (this.players[socket.id].workerId) {
			let workerId: string = this.players[socket.id].workerId
			let update: playerUpdateToWorker = {
				side: (this.parties[workerId].leftPlayerId == socket.id ? 'left' : 'right'),
				keyStates: payload.keys
			}
			this.parties[workerId].worker.postMessage(update)
			let leftPlayerId: string = this.parties[workerId].leftPlayerId
			let rightPlayerId: string = this.parties[workerId].rightPlayerId
			let dir: newDirection = {
				left: (leftPlayerId == socket.id ? payload.dir : undefined),
				right: (rightPlayerId == socket.id ? payload.dir : undefined)
			}
			if (this.players[leftPlayerId].workerId)
				this.sockets[this.parties[workerId].leftPlayerId].emit('changeDirection', dir)
			if (this.players[rightPlayerId].workerId)
				this.sockets[this.parties[workerId].rightPlayerId].emit('changeDirection', dir)

		}
	}

	// Event handler for player state update
	@SubscribeMessage('playerStateUpdate')
	handlePlayerStateUpdate(socket: Socket, payload: gameState) {
		if (this.players[socket.id].workerId) {
			let party = this.parties[this.players[socket.id].workerId]
			if (party.leftPlayerId == socket.id) {
				party.leftPlayerState = payload.actualState
			}
			else if (party.rightPlayerId == socket.id) {
				party.rightPlayerState = payload.actualState
			}
			if (party.rightPlayerState == 'ready' && party.leftPlayerState == 'ready') {
				this.createWebConstructs(party.leftPlayerId, party.rightPlayerId)
			}
			else if (party.workerState == 'created' && party.leftPlayerState == 'created' && party.rightPlayerState == 'created') {
				party.worker.postMessage({ newState: "started" })
			}
		}
	}

	// Event handler for player leaving a game
	@SubscribeMessage('leavingGame')
	handleLeavingGame(socket: Socket) {
		socket.emit('gameStopped', false)
		socket.disconnect()
	}

	// Event handler for player disconnection
	async handleDisconnect(socket: Socket) {
		let disconnectedPlayer: player = this.players[socket.id]
		if (disconnectedPlayer.workerId) {
			let ongoingParty: party = this.parties[disconnectedPlayer.workerId]
			ongoingParty.worker.terminate().then(() => {
				console.log("worker [" + ongoingParty.id.slice(0, 4) + "] terminated")
				this.players[ongoingParty.leftPlayerId].workerId = undefined
				this.players[ongoingParty.rightPlayerId].workerId = undefined
				if (disconnectedPlayer.id == ongoingParty.leftPlayerId) {
					console.log("Left player left the game:", disconnectedPlayer.id)
					this.sockets[ongoingParty.rightPlayerId].emit('gameStopped', true)
				}
				else {
					console.log("Right player left the game:", disconnectedPlayer.id)
					this.sockets[ongoingParty.leftPlayerId].emit('gameStopped', true)
				}
				delete this.parties[ongoingParty.id]
				delete this.players[disconnectedPlayer.id]
				if (disconnectedPlayer.id == ongoingParty.leftPlayerId)
					this.sockets[ongoingParty.rightPlayerId].disconnect()
				else
					this.sockets[ongoingParty.leftPlayerId].disconnect()
			})
		}
		delete this.sockets[socket.id]
	}
}
