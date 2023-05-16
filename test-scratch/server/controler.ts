/* -------------------------LIBRARIES IMPORTS------------------------- */

import { Socket, io } from 'socket.io-client'
import * as readline from 'readline'

/* -------------------------TYPES------------------------- */

/* -------------------------VARIABLES------------------------- */

const loginID: string = "CONTROLER"

let socket: Socket
let ownId: string

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
})

/* -------------------------FUNCTIONS------------------------- */

function prompt() {
	rl.question('[TSD]>$ ', (answer) => {
		switch (answer.toLowerCase()) {
			case 'exit':
				socket.disconnect()
				process.exit()
				break
			case 'stop':
				socket.emit('stop')
				break
			case 'party':
				socket.emit('newHeadless')
				break
			case 'unparty':
				socket.emit('deleteHeadless')
				break
			default:
				console.log('Unknown command')
		}
		prompt()
	})
}

/* -------------------------MAIN CODE------------------------- */

socket = io('http://localhost:3001')

socket.on('ownID', (playerId) => {
	ownId = playerId
	console.log("Own id:", ownId)
	socket.emit('identification', loginID)
	prompt()
})
