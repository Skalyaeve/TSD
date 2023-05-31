/* -------------------------LIBRARIES IMPORTS------------------------- */
import { io } from 'socket.io-client';
import * as readline from 'readline';
/* -------------------------TYPES------------------------- */
/* -------------------------VARIABLES------------------------- */
const loginID = "CONTROLER";
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
                socket.emit('newHeadless');
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
            case 'kick':
                rl.question('Id?>$ ', (id) => {
                    socket.emit('kickPlayer', id);
                    prompt(socket);
                });
                break;
            case 'kick all':
                socket.emit('kickAllPlayers');
                prompt(socket);
                break;
            default:
                console.log('Unknown command');
                prompt(socket);
        }
    });
}
/* -------------------------MAIN CODE------------------------- */
socket = io('http://localhost:3001');
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
