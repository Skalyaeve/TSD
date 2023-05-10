/* -------------------------LIBRARIES IMPORTS------------------------- */

/* -------------------------ASSETS IMPORTS------------------------- */
// Images && Spritesheets
const playerIdle__Sheet = '../resource/assets/black.png';
const mageIdle__Sheet = '../resource/assets/black.png';
const blank__Sheet = '../resource/assets/black.png';
const black__Sheet = '../resource/assets/black.png';
/* -------------------------letIABLES------------------------- */
// Game letiable
let game = null;
// Canvas constants
let canvas = {
    xSize: 1920,
    ySize: 1080,
    gameSpeed: 1000,
};
// Players list
let players = {};
// Skins list
let skins = {};
// Player event queues
let creationQueue = [];
let moveQueue = [];
let deletionQueue = [];
// Last outgoing update timestamp
let lastUpdateSent;
let movingPlayers = [];
/* -------------------------SCENE PRELOADING------------------------- */
// Initialise all skins of the scene
function skinsInitialisation(scene) {
    skins['player'] = {
        name: 'player',
        idleSheet: playerIdle__Sheet,
        nbFrames: 2,
        xSize: 100,
        ySize: 175,
        xResize: 100,
        yResize: 175,
        xOffset: 0,
        yOffset: 0,
        scaleFactor: 1
    };
    skins['mage'] = {
        name: 'mage',
        idleSheet: mageIdle__Sheet,
        nbFrames: 8,
        xSize: 250,
        ySize: 250,
        xResize: 50,
        yResize: 52,
        xOffset: 100,
        yOffset: 114,
        scaleFactor: 2.5
    };
    skins['black'] = {
        name: 'black',
        idleSheet: black__Sheet,
        nbFrames: 2,
        xSize: 125,
        ySize: 250,
        xResize: 125,
        yResize: 250,
        xOffset: 0,
        yOffset: 0,
        scaleFactor: 2.5
    };
    skins['blank'] = {
        name: 'blank',
        idleSheet: blank__Sheet,
        nbFrames: 2,
        xSize: 125,
        ySize: 250,
        xResize: 125,
        yResize: 250,
        xOffset: 0,
        yOffset: 0,
        scaleFactor: 2.5
    };
    for (let skinName in skins) {
        scene.load.spritesheet(skinName + 'Idle', skins[skinName].idleSheet, { frameWidth: skins[skinName].xSize, frameHeight: skins[skinName].ySize });
    }
}
/* -------------------------SCENE CREATION------------------------- */
// Create players for this scene
function createPlayer(playerId, scene) {
    let player = players[playerId];
    let skin = skins[player.skin];
    player.sprite = scene.physics.add.sprite(player.xPos, player.yPos, player.skin + 'Idle');
    if (player.sprite.body) {
        player.sprite.body.setSize(skin.xResize, skin.yResize);
        player.sprite.body.setOffset(skin.xOffset, skin.yOffset);
    }
    player.sprite.setScale(skin.scaleFactor, skin.scaleFactor);
    player.sprite.setBounce(1);
    player.sprite.setCollideWorldBounds(true);
    player.sprite.setImmovable(true);
    if (player.xDir == 'left')
        player.sprite.setFlipX(true);
    else if (player.xDir == 'right')
        player.sprite.setFlipX(false);
    player.keyStates.up = false;
    player.keyStates.down = false;
    player.keyStates.left = false;
    player.keyStates.right = false;
}
// Check if directional keys are pressed
function allKeysUp(player) {
    if (!player.keyStates.up && !player.keyStates.down && !player.keyStates.left && !player.keyStates.right)
        return true;
    return false;
}
/* -------------------------SCENE UPDATE------------------------- */
// Adapts player moveState and devolity following the pressed keys
function checkKeyInputs() {
    for (let playerId of moveQueue) {
        let player = players[playerId];
        let endVelocityX = 0;
        let endVelocityY = 0;
        if (player.keyStates.left)
            endVelocityX = -canvas.gameSpeed;
        if (player.keyStates.right)
            endVelocityX = endVelocityX + canvas.gameSpeed;
        if (player.keyStates.up)
            endVelocityY = -canvas.gameSpeed;
        if (player.keyStates.down)
            endVelocityY = endVelocityY + canvas.gameSpeed;
        if (endVelocityX || endVelocityY)
            movingPlayers[movingPlayers.length] = playerId;
        if (player.sprite) {
            player.sprite.setVelocity(endVelocityX, endVelocityY);
        }
    }
}
function checkSendUpdate() {
    // Add check for time
    if (process.send) {
        process.send({ type: 'playerUpdate', players: players, moved: movingPlayers });
        movingPlayers = [];
    }
}
// Create new player upon connection
function checkNewPlayer(scene) {
    for (let playerId of creationQueue) {
        createPlayer(players[playerId].id, scene);
    }
    creationQueue = [];
}
// Delete player upon disconnection
function checkDisconnect() {
    for (let playerId of deletionQueue) {
        players[playerId].sprite?.destroy();
        delete players[playerId];
    }
    deletionQueue = [];
}
/* -------------------------PHASER FUNCTIONS------------------------- */
// Scene preloading for textures & keys
function preload() {
    //skinsInitialisation(this)
}
// Scene creation
function create() {
}
// Scene update
function update() {
    /*checkNewPlayer(this)
    checkDisconnect()
    checkKeyInputs()
    //WORK IN PROGRESS HERE
    checkSendUpdate()*/
}
/* -------------------------MAIN FUNCTIONS------------------------- */
function createGame() {
    const config = {
        type: Phaser.HEADLESS,
        width: canvas.xSize,
        height: canvas.ySize,
        banner: false,
        physics: {
            default: 'arcade',
        },
        scene: {
            preload: preload,
            create: create,
            update: update,
        },
    };
    game = new Phaser.Game({ ...config });
}
function destroyGame() {
    if (game) {
        for (let playerId in players)
            players[playerId].sprite?.destroy();
        game.destroy(true, false);
        game = null;
    }
    process.exit();
}
function addNewPlayer(player) {
    players[player.id] = player;
    creationQueue[creationQueue.length] = player.id;
    console.log("A new player connected");
}
function disconnectPlayer(playerId) {
    deletionQueue[deletionQueue.length] = playerId;
    console.log("A player has disconnected");
}
function updatePlayerKeys(playerId, keyStates) {
    players[playerId].keyStates.up = keyStates.up;
    players[playerId].keyStates.down = keyStates.down;
    players[playerId].keyStates.left = keyStates.left;
    players[playerId].keyStates.right = keyStates.right;
    moveQueue[moveQueue.length] = playerId;
}
/* -------------------------MAIN FUNCTIONS------------------------- */
process.on('message', (data) => {
    switch (data.type) {
        case 'destroy':
            destroyGame();
            break;
        case 'newPlayer':
            addNewPlayer(data.player);
            break;
        case 'playerDisconnected':
            disconnectPlayer(data.playerId);
            break;
        case 'playerKeyUpdate':
            updatePlayerKeys(data.playerId, data.keyStates);
            break;
        default:
            console.log("Unknown event type", data.type);
    }
});
createGame();
