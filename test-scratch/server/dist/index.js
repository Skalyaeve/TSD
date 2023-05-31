/* -------------------------LIBRARIES IMPORTS------------------------- */
import { Worker } from 'worker_threads';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
/* -------------------------VARIABLES------------------------- */
const port = 3001;
const clientIDLogin = "PHASER-WEB-CLIENT";
const controlerIDLogin = "CONTROLER";
let io;
let sockets = {};
let players = {};
let workers = [];
let matchQueue = [];
let nbRight = 0;
let nbLeft = 0;
/* -------------------------FUCNTIONS------------------------- */
function createNewPlayer() {
    let newPlayer;
    let finalSide = (nbRight > nbLeft ? 'left' : 'right');
    if (nbRight > nbLeft)
        nbLeft = nbLeft + 1;
    else
        nbRight = nbRight + 1;
    console.log(finalSide + " connected", "r:", nbRight, "l:", nbLeft);
    newPlayer = {
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
    };
    return newPlayer;
}
// Starts a new headless session
function newSimulation() {
    let newWorker = new Worker('./dist/phaser.js');
}
// Setup for client socket listeners
function setupClientListeners(socket) {
    socket.on('', () => { });
}
// Setup for controler socket listeners
function setupControlerListeners(socket) {
    socket.on('newHeadless', () => {
        console.log("New headless");
        newSimulation();
    });
    socket.on('displaySocket', (socketId) => {
        if (sockets[socketId])
            socket.emit('displayLine', "Socket: " + socketId + " type: " + sockets[socketId].type);
        else
            socket.emit('displayLine', "Unknown socket " + socketId);
        socket.emit('endOfDisplay', {});
    });
    socket.on('displayAllSockets', () => {
        for (let socketId in sockets) {
            socket.emit('displayLine', "Socket: " + socketId + " type: " + sockets[socketId].type);
        }
        socket.emit('endOfDisplay', {});
    });
    socket.on('closeParty', (socketId) => {
        if (sockets[socketId] && sockets[socketId].type == 'headless') {
            sockets[socketId].socket.disconnect();
            delete sockets[socketId];
            console.log("Socket destroyed by server:", socketId);
        }
        else
            console.log("Can't destroy unknown socket:", socketId);
    });
    socket.on('closeAllParties', () => {
        for (let socketId in sockets) {
            if (sockets[socketId].type == 'headless') {
                sockets[socketId].socket.disconnect();
                delete sockets[socketId];
                console.log("Socket destroyed by server:", socketId);
            }
        }
    });
}
/* -------------------------MAIN CODE------------------------- */
// Setting up socket.IO server
io = new Server(port, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
console.log("listening on port:", port);
// Connection handler
io.on('connection', (socket) => {
    sockets[socket.id] = {
        socket: socket,
        type: 'unknown'
    };
    // Identification handler
    socket.on('identification', (socketLoginID) => {
        switch (socketLoginID) {
            case clientIDLogin:
                players[socket.id] = createNewPlayer();
                matchQueue[matchQueue.length] = socket.id;
                sockets[socket.id].type = 'client';
                setupClientListeners(socket);
                console.log("Player logging in:", socket.id);
                break;
            case controlerIDLogin:
                sockets[socket.id].type = 'controler';
                setupControlerListeners(socket);
                console.log("New controler:", socket.id);
                break;
            default:
                socket.disconnect();
        }
    });
});
