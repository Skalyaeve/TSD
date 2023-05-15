/* -------------------------LIBRARIES IMPORTS------------------------- */
import * as path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { Server } from 'socket.io';
import { JSDOM } from 'jsdom';
import { v4 as uuidv4 } from 'uuid';
/* -------------------------VARIABLES------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const port = 3001;
const clientIDLogin = "a52b4f5d-f4e8-40bd-8d49-fda62e74d859";
const headlessIDLogin = "b300c0f7-f8e4-4604-a514-cdf28b1d21ba";
let io;
let players = {};
let headless = {};
let nbRight = 0;
let nbLeft = 0;
/* -------------------------FUCNTIONS------------------------- */
function createNewPlayer() {
    let newPlayer;
    let finalSide = (nbRight > nbLeft ? 'left' : 'right');
    console.log(finalSide + " connected");
    if (nbRight > nbLeft)
        nbLeft = nbLeft + 1;
    else
        nbRight = nbRight + 1;
    console.log("r:", nbRight, "l:", nbLeft);
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
function setupAuthoritativePhaser() {
    JSDOM.fromFile(path.join(__dirname, '../authoritative_server/dist/index.html'), {
        // To run the scripts in the html file
        runScripts: "dangerously",
        // Also load supported external resources
        resources: "usable",
        // So requestAnimatinFrame events fire
        pretendToBeVisual: true
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
    console.log(`Player connected: ${socket.id}`);
    socket.emit('ownID', `${socket.id}`);
});
// Identification handler
io.on('identification', (loginInfo) => {
    console.log("Player logging in:", loginInfo.playerId);
    if (loginInfo.socketLoginID == "PHASER-WEB-CLIENT") {
        players[loginInfo.playerId] = createNewPlayer();
        console.log("A new player has connected");
    }
    else if (loginInfo.socketLoginID == "PHASER-HEADLESS-CLIENT") {
        headless[loginInfo.playerId] = createNewPlayer();
        console.log("A new headless client has connected");
    }
});
// Start a new headless client
setupAuthoritativePhaser();
