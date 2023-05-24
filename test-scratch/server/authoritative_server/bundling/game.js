/* -------------------------LIBRARIES IMPORTS------------------------- */
import Phaser from 'phaser';
import { io } from 'socket.io-client';
/* -------------------------VARIABLES------------------------- */
const loginID = "PHASER-HEADLESS-CLIENT";
const config = {
    type: Phaser.HEADLESS,
    width: 800,
    height: 600,
    autoFocus: false,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 0 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
let game;
let socket;
let ownId;
/* -------------------------FUNCTIONS------------------------- */
function startGame() {
    game = new Phaser.Game(config);
}
function startSocket() {
    socket = io('http://localhost:3001');
    socket.on('ownID', (playerId) => {
        ownId = playerId;
        console.log("Own id:", ownId);
        socket.emit('identification', loginID);
    });
}
/* -------------------------PHASER FUNCTIONS------------------------- */
function preload() { }
function create() { }
function update() { }
/* -------------------------MAIN CODE------------------------- */
startGame();
startSocket();
