import { parentPort } from 'worker_threads'

let buffer
parentPort.on('message', (payload) => {
	buffer = payload
	console.log(buffer[0]); // Output: 10
	buffer[0] = 42;
	console.log(buffer[0]); // Output: 42
	setTimeout(() => {
		parentPort.postMessage('ok')
	}, 1000)
})

parentPort.postMessage('ready')



