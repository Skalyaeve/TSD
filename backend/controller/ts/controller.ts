/* -------------------------LIBRARIES IMPORTS------------------------- */

import { io, Socket } from 'socket.io-client'
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

			case 'help':
				console.log("'help': List all commands")
				console.log("'exit': Exit the controller")
				console.log("'open': Creates a new party instance")
				console.log("'close': Close a party instance")
				console.log("'reset': Close all party instances")
				console.log("'display': Display a party instance")
				console.log("'list': List all party instances")
				prompt(socket)
				break

			case 'exit':
				socket.disconnect()
				process.exit()

			case 'open':
				socket.emit('newParty')
				prompt(socket)
				break

			case 'close':
				rl.question('Id?>$ ', (id: string) => {
					socket.emit('closeParty', id)
					prompt(socket)
				})
				break

			case 'reset':
				socket.emit('closeAllParties')
				prompt(socket)
				break

			case 'display':
				rl.question('Id?>$ ', (id: string) => {
					socket.emit('displaySocket', id)
				})
				break

			case 'list':
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
	socket.emit('identification', loginID)
	console.log("/* ----------------------TSD CONTROLLER---------------------- */")
	console.log("Own id:", ownId)
	console.log("Type 'help' for a list of commands")
	prompt(socket)
})

socket.on('displayLine', (line: string) => {
	console.log(line)
})

socket.on('endOfDisplay', () => {
	prompt(socket)
})

