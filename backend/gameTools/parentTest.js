import { Worker } from 'worker_threads'
const bufferSize = 8;
export const buffer = new SharedArrayBuffer(bufferSize);
export let array = new Uint8Array(buffer);
array[0] = 10;
let worker = new Worker('./childTest.js')

worker.on('message', (payload) => {
	if (payload == "ready")
		worker.postMessage(array)
	if (payload == "ok")
		console.log(array[0], "bite")
})
