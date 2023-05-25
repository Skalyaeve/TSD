/* -------------------------LIBRARIES IMPORTS------------------------- */
import { parentPort } from 'worker_threads';
import { ArcadePhysics } from 'arcade-physics';
/* -------------------------VARIABLES------------------------- */
// Game constants
const screenWidth = 1920;
const screenHeight = 1080;
const targetFPS = 60;
const playerSpeed = 150;
// Physics initialisation
const config = {
    width: screenWidth,
    height: screenHeight,
    gravity: {
        x: 0,
        y: 0
    }
};
const physics = new ArcadePhysics(config);
// Game variables
let tick = 0;
let players = [];
let ball;
/* -------------------------CREATION FUNCTIONS------------------------- */
// Create the ball
function createBall() {
    ball = {
        body: physics.add.body(screenHeight / 2, screenWidth / 2)
    };
    ball.body.setCircle(25);
    ball.body.setCollideWorldBounds(true, undefined, undefined, undefined);
    console.log("Added ball");
}
// Create a new player
function createPlayer(construct) {
    let newPlayer = {
        id: construct.id,
        body: physics.add.body(construct.xPos, construct.yPos, construct.width, construct.height)
    };
    newPlayer.body.setBounce(1, 1);
    newPlayer.body.setCollideWorldBounds(true, undefined, undefined, undefined);
    physics.add.collider(ball.body, newPlayer.body);
    players[players.length] = newPlayer;
    console.log("Added player");
}
/* -------------------------UPDATE FUNCTIONS------------------------- */
// Update players local speed usinf keyStates recieved from main process
function updatePlayer(update) {
    let xVel = 0;
    let yVel = 0;
    if (update.keyStates.up)
        yVel = yVel - playerSpeed;
    if (update.keyStates.down)
        yVel = yVel + playerSpeed;
    if (update.keyStates.left)
        xVel = xVel - playerSpeed;
    if (update.keyStates.right)
        xVel = xVel + playerSpeed;
    players[update.id].body.setVelocity(xVel, yVel);
}
/* -------------------------PORT EVENTS------------------------- */
function portListener() {
    parentPort?.on("message", (incomingData) => {
        switch (incomingData.type) {
            case 'construct':
                createPlayer(incomingData);
                break;
            case 'update':
                updatePlayer(incomingData);
                break;
            default:
        }
    });
}
/* -------------------------MAIN FUNCTIONS------------------------- */
function update() {
    let properties = [];
    physics.world.update(tick * 1000, 1000 / targetFPS);
    physics.world.postUpdate();
    tick++;
    if (tick % 2) {
        for (let player of players) {
            properties[properties.length] = {
                target: player.id,
                xPos: player.body.x,
                yPos: player.body.x,
                xVel: player.body.velocity.x,
                yVel: player.body.velocity.y
            };
        }
        properties[properties.length] = {
            target: "ball",
            xPos: ball.body.x,
            yPos: ball.body.x,
            xVel: ball.body.velocity.x,
            yVel: ball.body.velocity.y
        };
        parentPort?.postMessage(properties);
    }
}
/* -------------------------MAIN CODE------------------------- */
function main() {
    portListener();
    setTimeout(() => {
        createBall();
        setInterval(() => {
            update();
        }, 1000 / targetFPS);
    }, 100);
}
main();
