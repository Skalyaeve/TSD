/* -------------------------LIBRARIES IMPORTS------------------------- */
import { parentPort } from 'worker_threads';
import { ArcadePhysics } from 'arcade-physics';
/* -------------------------VARIABLES------------------------- */
// Game constants
const screenWidth = 1920;
const screenHeight = 1080;
const targetFPS = 60;
const playerSpeed = 1000;
// Game variables
let sessionId = undefined;
let leftPlayer = undefined;
let rightPlayer = undefined;
let ball = undefined;
let tick = 0;
let gameState = "off";
let oldProps = undefined;
let newProps = undefined;
// Physics initialisation
const physics = new ArcadePhysics({
    width: screenWidth,
    height: screenHeight,
    gravity: {
        x: 0,
        y: 0
    }
});
/* -------------------------CREATION FUNCTIONS------------------------- */
// Create the ball
function createBall() {
    ball = { body: physics.add.body(screenHeight / 2, screenWidth / 2) };
    ball.body.setCircle(25);
    ball.body.setBounce(1, 1);
    ball.body.setCollideWorldBounds(true, undefined, undefined, undefined);
    console.log("[", sessionId?.slice(0, 4), "] Added ball");
}
// Create a new player
function createPlayer(construct) {
    let newPlayer = {
        side: construct.side,
        body: physics.add.body(construct.xPos, construct.yPos, construct.width, construct.height)
    };
    newPlayer.body.setCollideWorldBounds(true, undefined, undefined, undefined);
    if (ball)
        physics.add.collider(ball.body, newPlayer.body);
    if (leftPlayer) {
        rightPlayer = newPlayer;
        console.log("[", sessionId?.slice(0, 4), "] Added right player");
    }
    else {
        leftPlayer = newPlayer;
        console.log("[", sessionId?.slice(0, 4), "] Added left player");
    }
    if (leftPlayer && rightPlayer && ball)
        gameState = "on";
    else
        gameState = "off";
}
/* -------------------------UPDATE FUNCTIONS------------------------- */
// Update players local speed usinf keyStates recieved from main process
function updatePlayer(updatedPlayer) {
    let xVel = 0;
    let yVel = 0;
    if (updatedPlayer.keyStates.up)
        yVel = yVel - playerSpeed;
    if (updatedPlayer.keyStates.down)
        yVel = yVel + playerSpeed;
    if (updatedPlayer.keyStates.left)
        xVel = xVel - playerSpeed;
    if (updatedPlayer.keyStates.right)
        xVel = xVel + playerSpeed;
    if (leftPlayer && rightPlayer) {
        console.log("[", sessionId?.slice(0, 4), "] Updating player vel");
        if (updatedPlayer.side == leftPlayer.side)
            leftPlayer.body.setVelocity(xVel, yVel);
        else
            rightPlayer.body.setVelocity(xVel, yVel);
    }
}
/* -------------------------PORT INPUT------------------------- */
function isLogin(incomingData) {
    return incomingData.sessionId !== undefined;
}
function isConstruct(incomingData) {
    return incomingData.xPos !== undefined;
}
function portListener() {
    parentPort?.on("message", (incomingData) => {
        if (isLogin(incomingData))
            sessionId = incomingData.sessionId;
        else if (isConstruct(incomingData))
            createPlayer(incomingData);
        else
            updatePlayer(incomingData);
    });
}
/* -------------------------PORT OUTPUT------------------------- */
function getProperties(body) {
    return {
        xPos: body.x,
        yPos: body.y,
        xVel: body.velocity.x,
        yVel: body.velocity.y
    };
}
// Send objects properties to
function sendProperties() {
    if (sessionId && leftPlayer && ball && rightPlayer && parentPort) {
        if (newProps)
            oldProps = Object.assign({}, newProps);
        newProps = {
            sessionId: sessionId,
            leftProps: getProperties(leftPlayer.body),
            rightProps: getProperties(rightPlayer.body),
            ballProps: getProperties(ball.body)
        };
        if (oldProps) {
            parentPort.postMessage(newProps);
        }
    }
}
/* -------------------------MAIN FUNCTIONS------------------------- */
// Update the game to the next tick
function update() {
    physics.world.update(tick * 1000, 1000 / targetFPS);
    physics.world.postUpdate();
    tick++;
    sendProperties();
}
/* -------------------------MAIN CODE------------------------- */
function main() {
    createBall();
    setTimeout(() => {
        portListener();
        setInterval(() => {
            if (gameState == "on")
                update();
        }, 1000 / targetFPS);
    }, 100);
}
main();
