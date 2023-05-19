"use strict";
/* -------------------------LIBRARIES IMPORTS------------------------- */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const io = require('socket.io-client');
const readline = __importStar(require("readline"));
/* -------------------------TYPES------------------------- */
/* -------------------------VARIABLES------------------------- */
const loginID = "CONTROLLER";
let socket;
let ownId;
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
/* -------------------------FUNCTIONS------------------------- */
function prompt(socket) {
    rl.question('[TSD]>$ ', (answer) => {
        switch (answer.toLowerCase()) {
            case 'exit':
                socket.disconnect();
                process.exit();
                break;
            case 'stop':
                socket.emit('stop');
                prompt(socket);
                break;
            case 'party':
                socket.emit('newParty');
                prompt(socket);
                break;
            case 'unparty':
                rl.question('Id?>$ ', (id) => {
                    socket.emit('closeParty', id);
                    prompt(socket);
                });
                break;
            case 'unparty all':
                socket.emit('closeAllParties');
                prompt(socket);
                break;
            case 'display':
                rl.question('Id?>$ ', (id) => {
                    socket.emit('displaySocket', id);
                });
                break;
            case 'display all':
                socket.emit('displayAllSockets');
                break;
            default:
                console.log('Unknown command');
                prompt(socket);
        }
    });
}
/* -------------------------MAIN CODE------------------------- */
socket = io('http://localhost:3000/game');
socket.on('ownID', (playerId) => {
    ownId = playerId;
    console.log("Own id:", ownId);
    socket.emit('identification', loginID);
    prompt(socket);
});
socket.on('displayLine', (line) => {
    console.log(line);
});
socket.on('endOfDisplay', () => {
    prompt(socket);
});
