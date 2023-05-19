/* -------------------------LIBRARIES IMPORTS------------------------- */

import { Socket, Server } from 'socket.io';
const io = require('socket.io-client');
import * as readline from 'readline'

/* -------------------------TYPES------------------------- */

/* -------------------------VARIABLES------------------------- */

const loginID: string = "CONTROLLER"

let socket: Socket
let ownId: string

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

/* -------------------------FUNCTIONS------------------------- */

function prompt(socket: Socket) {
	rl.question('[TSD]>$ ', (answer) => {
		switch (answer.toLowerCase()) {

			case 'exit':
				socket.disconnect()
				process.exit()
				break

			case 'stop':
				socket.emit('stop')
				prompt(socket)
				break

			case 'party':
				socket.emit('newParty')
				prompt(socket)
				break

			case 'unparty':
				rl.question('Id?>$ ', (id) => {
					socket.emit('closeParty', id)
					prompt(socket)
				})
				break

			case 'unparty all':
				socket.emit('closeAllParties')
				prompt(socket)
				break

			case 'display':
				rl.question('Id?>$ ', (id) => {
					socket.emit('displaySocket', id)
				})
				break

			case 'display all':
				socket.emit('displayAllSockets')
				break

			default:
				console.log('Unknown command')
				prompt(socket)
		}
	})
}

/* -------------------------MAIN CODE------------------------- */

socket = io('http://localhost:3000/game')

socket.on('ownID', (playerId) => {
	ownId = playerId
	console.log("Own id:", ownId)
	socket.emit('identification', loginID)
	prompt(socket)
})

socket.on('displayLine', (line: string) => {
	console.log(line)
})

socket.on('endOfDisplay', () => {
	prompt(socket)
})

