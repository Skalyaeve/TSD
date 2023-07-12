/* -------------------------LIBRARIES IMPORTS------------------------- */

import { v4 as uuidv4 } from 'uuid';
import { Worker } from 'worker_threads'
import { Server, Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
/*import { UserSocketsService } from '../chat/chat.userSocketsService.js';
import { ChatService } from '../chat/chat.service.js';*/
import { UserService } from '../user/user.service.js';

/* -------------------------TYPES------------------------- */

type Size = { width: number, height: number }
type Coordinates = { x: number, y: number }
type Side = 'left' | 'right'
type Direction = 'up' | 'down' | 'left' | 'right' | 'none'
type GameState = 'init' | 'ready' | 'created' | 'started' | 'stopped'
type workerMessage = newPropsFromWorker | GameState | GameEvent | playerLife

const gameEvent = ['goal', '3', '2', '1', 'fight', 'blocked', 'stop'] as const;
type GameEvent = (typeof gameEvent)[number];
type Skin = 'Boreas' | 'Helios' | 'Selene' | 'Liliana' | 'Orion' | 'Faeleen' | 'Rylan' | 'Garrick' | 'Thorian' | 'Test'
type lifeType = number | 'init'

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
	size: Size										// Skin size
}

// Players
interface player {
	id: string										// Player ID
	workerId: string | undefined					// Player worker ID
	skin: string									// Player skin name
}

interface playerLife {
	left: lifeType
	right: lifeType
}

// Party worker
interface party {
	id: string										// Party id (worker ID)
	worker: Worker									// Party worker	
	workerState: string								// GameState of the party worker
	leftPlayerId: string							// Left player client ID
	leftPlayerState: string							// GameState of the left player client
	rightPlayerId: string							// Right player client ID
	rightPlayerState: string						// GameState of the right player client
}

// ----WORKER COMMUNICATION------------------------- //

// Login data (sent to the worker)
interface loginData {
	workerId: string								// Worker own ID
}

// Players construction interface (sent to the worker)
interface workerPlayerConstruct {
	side: Side										// Player side
	coords: Coordinates								// Player coordinates
	size: Size										// Player size
	skin: string									// Player skin
}

// New properties (sent by the worker)
interface newPropsFromWorker {
	workerId: string								// Worker ID
	leftProps: Coordinates							// Left player properties
	rightProps: Coordinates							// Right player properties
	ballProps: Coordinates							// Ball properties
}

// Player update (sent to the worker)
interface playerUpdateToWorker {
	side: Side										// Player side
	keyStates: keyStates							// Player key states
}

// ----CLIENT COMMUNICATION------------------------- //

// Player construction interface (sent to the client)
interface clientPlayerConstruct {
	side: Side										// Player side
	skin: string									// Player skin name
}

// New properties (sent to the client)
interface newPropsToClient {
	leftProps: Coordinates							// Left player properties
	rightProps: Coordinates							// Right player properties
	ballProps: Coordinates							// Ball properties
}

// New properties (sent by the client)
interface newPropsFromClient {
	keys: keyStates,								// Keys pressed by the client
	dir: Direction | undefined						// Direction of the client's player
}

// New direction for both players (sent to the client)
interface newDirection {
	left: Direction | undefined						// New direction of the left player
	right: Direction | undefined					// New direction of the right player
}

/* -------------------------WEBSOCKET-CLASS------------------------- */

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] }, namespace: 'game' })
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	constructor(private userService: UserService) {}

	@WebSocketServer()
	server: Server;

	/*private readonly userService: UserSocketsService = new UserSocketsService
	private readonly chatService: ChatService*/
	private readonly screenHeight: number = 1080
	private readonly screenWidth: number = 1920
	private readonly playerScaleFactor = 7
	// Matchmaking queue
	private matchQueue: string[] = []
	// List of connected sockets (matchmaking + in game) (indexed by socket id)
	private sockets: { [id: string]: Socket } = {}
	// List of all connected players sockets (indexed by socket id)
	private players: { [id: string]: player } = {}
	// List of all ongoing parties (indexed by worker id)
	private parties: { [partyId: string]: party } = {}
	// List of all skins and their respective sizes (indexed by name) (WILL BE DELETED)
	private skins: { [key: string]: skin } = {
		['Test']: {
			name: 'Test',
			size: {
				width: 25,
				height: 25
			}
		},
		['Boreas']: {
			name: 'Boreas',
			size: {
				width: 15, // A CORRIGER
				height: 19
			}
		},
		['Fealeen']: {
			name: 'Fealeen',
			size: {
				width: 15, // A CORRIGER
				height: 18
			}
		},
		['Garrick']: {
			name: 'Garrick',
			size: {
				width: 15, // A CORRIGER
				height: 19
			}
		},
		['Helios']: {
			name: 'Helios',
			size: {
				width: 15, // A CORRIGER
				height: 19
			}
		},
		['Liliana']: {
			name: 'Liliana',
			size: {
				width: 15, // A CORRIGER
				height: 18
			}
		},
		['Orion']: {
			name: 'Orion',
			size: {
				width: 15,
				height: 18
			}
		},
		['Rylan']: {
			name: 'Rylan',
			size: {
				width: 15,
				height: 18
			}
		},
		['Selene']: {
			name: 'Selene',
			size: {
				width: 15, // A CORRIGER
				height: 18
			}
		},
		['Thorian']: {
			name: 'Thorian',
			size: {
				width: 15, // A CORRIGER
				height: 18
			}
		},
	}

	/* -------------------------FUNCTIONS------------------------- */

	// Type checker for new props
	isNewProps(payload: workerMessage): payload is newPropsFromWorker {
		return (<newPropsFromWorker>payload).ballProps !== undefined
	}

	isGameEvent(payload: any): payload is GameEvent {
		return gameEvent.includes(payload);
	};

	isLifeUpdate(payload: workerMessage): payload is playerLife {
		return (<playerLife>payload).left !== undefined
	}

	// Create the loginData object to store the worker id and send it to the worker
	createWorker(newParty: party) {
		newParty.worker.on('message', (payload: workerMessage) => {
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
			else if (this.isLifeUpdate(payload)) {
				this.sockets[newParty.leftPlayerId].emit('lifeUpdate', payload)
				this.sockets[newParty.rightPlayerId].emit('lifeUpdate', payload)
			}
			else if (this.isGameEvent(payload)) {
				switch (payload) {
					case ('stop'):
						this.sockets[newParty.leftPlayerId].emit('eventOff')
						this.sockets[newParty.rightPlayerId].emit('eventOff')
						break
					default:
						this.sockets[newParty.leftPlayerId].emit('eventOn', payload)
						this.sockets[newParty.rightPlayerId].emit('eventOn', payload)
				}
			}
			else {
				newParty.workerState = payload
				if (newParty.workerState == 'init') {
					let workerLoginData: loginData = { workerId: newParty.id }
					newParty.worker.postMessage(workerLoginData)
				}
				else if (newParty.workerState == 'ready') {
					this.createWorkerConstructs(newParty.leftPlayerId, newParty.rightPlayerId, newParty)
				}
				else if (newParty.workerState == 'created' && newParty.leftPlayerState == 'created' && newParty.rightPlayerState == 'created') {
					newParty.worker.postMessage({ newState: 'started' })
				}
			}
		})
	}

	// Create the player construct objects for clients and emit them to each client
	createWebConstructs(leftPlayerId: string, rightPlayerId: string) {
		let leftClientConstruct: clientPlayerConstruct = { side: 'left', skin: this.players[leftPlayerId].skin }
		let rightClientConstruct: clientPlayerConstruct = { side: 'right', skin: this.players[rightPlayerId].skin }
		if (this.players[leftPlayerId].workerId) {
			this.sockets[leftPlayerId].emit('playerConstruct', leftClientConstruct)
			this.sockets[leftPlayerId].emit('playerConstruct', rightClientConstruct)
		}
		if (this.players[rightPlayerId].workerId) {
			this.sockets[rightPlayerId].emit('playerConstruct', leftClientConstruct)
			this.sockets[rightPlayerId].emit('playerConstruct', rightClientConstruct)
		}
	}

	// Create a new sesion player construct
	newWorkerConstruct(id: string, side: Side, size: Size): workerPlayerConstruct {
		return {
			side: side,
			coords: {
				x: (side === 'left' ? 250 - size.width * this.playerScaleFactor / 2 : this.screenWidth - 250 - size.width * this.playerScaleFactor / 2),
				y: (this.screenHeight / 2 - size.height * this.playerScaleFactor / 2),
			},
			size: { width: size.width * this.playerScaleFactor, height: size.height * this.playerScaleFactor },
			skin: this.players[id].skin
		}
	}

	// Get skins for both side, create the worker construct objects and emit them to the worker
	createWorkerConstructs(leftPlayerId: string, rightPlayerId: string, newParty: party) {
		let leftSkin = this.skins[this.players[leftPlayerId].skin]
		let rightSkin = this.skins[this.players[rightPlayerId].skin]
		let leftWorkerConstruct = this.newWorkerConstruct(leftPlayerId, 'left', leftSkin.size)
		let rightWorkerConstruct = this.newWorkerConstruct(rightPlayerId, 'right', rightSkin.size)
		newParty.worker.postMessage(leftWorkerConstruct)
		newParty.worker.postMessage(rightWorkerConstruct)
	}

	// Starts a new party
	async createParty(leftPlayerId: string, rightPlayerId: string) {
		let newParty: party = {
			id: uuidv4(),
			worker: new Worker('./dist/worker.js'),
			workerState: 'building',
			leftPlayerId: leftPlayerId,
			leftPlayerState: 'building',
			rightPlayerId: rightPlayerId,
			rightPlayerState: 'building'
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
		console.log('Not connected')
		else {
			this.userService.setUser(userData.id, socket)
		}*/
		const user = await this.userService.findOneById(1)
		console.log('New player connecting:', socket.id)
		this.sockets[socket.id] = socket
		this.players[socket.id] = {
			id: socket.id,
			workerId: undefined,
			skin: user.character
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
	handlePlayerStateUpdate(socket: Socket, payload: GameState) {
		if (this.players[socket.id].workerId) {
			let party = this.parties[this.players[socket.id].workerId]
			if (party.leftPlayerId == socket.id) {
				party.leftPlayerState = payload
			}
			else if (party.rightPlayerId == socket.id) {
				party.rightPlayerState = payload
			}
			if (party.rightPlayerState == 'ready' && party.leftPlayerState == 'ready') {
				this.createWebConstructs(party.leftPlayerId, party.rightPlayerId)
			}
			else if (party.workerState == 'created' && party.leftPlayerState == 'created' && party.rightPlayerState == 'created') {
				party.worker.postMessage({ newState: 'started' })
			}
		}
	}

	// Event handler for player disconnection
	async handleDisconnect(socket: Socket) {
		let disconnectedPlayer: player = this.players[socket.id]
		if (disconnectedPlayer.workerId) {
			let ongoingParty: party = this.parties[disconnectedPlayer.workerId]
			ongoingParty.worker.terminate().then(() => {
				console.log('worker [' + ongoingParty.id.slice(0, 4) + '] terminated')
				this.players[ongoingParty.leftPlayerId].workerId = undefined
				this.players[ongoingParty.rightPlayerId].workerId = undefined
				let remainingPlayerId = (disconnectedPlayer.id == ongoingParty.leftPlayerId ? ongoingParty.rightPlayerId : ongoingParty.leftPlayerId)
				this.sockets[remainingPlayerId].emit('gameStopped', true)
				delete this.parties[ongoingParty.id]
				delete this.players[disconnectedPlayer.id]
			})
		}
		delete this.sockets[disconnectedPlayer.id]
	}
}
