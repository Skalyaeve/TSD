"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _phaser = _interopRequireDefault(require("phaser"));
var _worker_threads = require("worker_threads");
var _playerSheet = _interopRequireDefault(require("./resource/assets/playerSheet.png"));
var _Idle = _interopRequireDefault(require("./resource/assets/Mage/Idle.png"));
var _blank = _interopRequireDefault(require("./resource/assets/blank.png"));
var _black = _interopRequireDefault(require("./resource/assets/black.png"));
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; } /* -------------------------LIBRARIES IMPORTS------------------------- */ /* -------------------------ASSETS IMPORTS------------------------- */ // Images && Spritesheets
/* -------------------------TYPES------------------------- */

// Player key states interface
// Skins interface
// Players interface
// Game canvas interface
/* -------------------------VARIABLES------------------------- */
// Game variable
var game = null;

// Canvas constants
var canvas = {
  xSize: 1920,
  ySize: 1080,
  gameSpeed: 1000
};

// Players list
var players = {};

// Skins list
var skins = {};

// Player event queues
var creationQueue = [];
var moveQueue = [];
var deletionQueue = [];

// Last outgoing update timestamp
var lastUpdateSent;
var movingPlayers = [];

/* -------------------------SCENE PRELOADING------------------------- */

// Initialise all skins of the scene
function skinsInitialisation(scene) {
  skins['player'] = {
    name: 'player',
    idleSheet: _playerSheet["default"],
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
    idleSheet: _Idle["default"],
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
    idleSheet: _black["default"],
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
    idleSheet: _blank["default"],
    nbFrames: 2,
    xSize: 125,
    ySize: 250,
    xResize: 125,
    yResize: 250,
    xOffset: 0,
    yOffset: 0,
    scaleFactor: 2.5
  };
  for (var skinName in skins) {
    scene.load.spritesheet(skinName + 'Idle', skins[skinName].idleSheet, {
      frameWidth: skins[skinName].xSize,
      frameHeight: skins[skinName].ySize
    });
  }
}

/* -------------------------SCENE CREATION------------------------- */

// Create players for this scene
function createPlayer(playerId, scene) {
  var player = players[playerId];
  var skin = skins[player.skin];
  player.sprite = scene.physics.add.sprite(player.xPos, player.yPos, player.skin + 'Idle');
  if (player.sprite.body) {
    player.sprite.body.setSize(skin.xResize, skin.yResize);
    player.sprite.body.setOffset(skin.xOffset, skin.yOffset);
  }
  player.sprite.setScale(skin.scaleFactor, skin.scaleFactor);
  player.sprite.setBounce(1);
  player.sprite.setCollideWorldBounds(true);
  player.sprite.setImmovable(true);
  if (player.xDir == 'left') player.sprite.setFlipX(true);else if (player.xDir == 'right') player.sprite.setFlipX(false);
  player.keyStates.up = false;
  player.keyStates.down = false;
  player.keyStates.left = false;
  player.keyStates.right = false;
}

// Check if directional keys are pressed
function allKeysUp(player) {
  if (!player.keyStates.up && !player.keyStates.down && !player.keyStates.left && !player.keyStates.right) return true;
  return false;
}

/* -------------------------SCENE UPDATE------------------------- */

// Adapts player moveState and devolity following the pressed keys
function checkKeyInputs() {
  var _iterator = _createForOfIteratorHelper(moveQueue),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var playerId = _step.value;
      var _player = players[playerId];
      var endVelocityX = 0;
      var endVelocityY = 0;
      if (_player.keyStates.left) endVelocityX = -canvas.gameSpeed;
      if (_player.keyStates.right) endVelocityX = endVelocityX + canvas.gameSpeed;
      if (_player.keyStates.up) endVelocityY = -canvas.gameSpeed;
      if (_player.keyStates.down) endVelocityY = endVelocityY + canvas.gameSpeed;
      if (endVelocityX || endVelocityY) movingPlayers[movingPlayers.length] = playerId;
      if (_player.sprite) {
        _player.sprite.setVelocity(endVelocityX, endVelocityY);
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
}
function checkSendUpdate() {
  // Add check for time
  if (_worker_threads.parentPort) {
    _worker_threads.parentPort.postMessage({
      type: 'playerUpdate',
      players: players,
      moved: movingPlayers
    });
    movingPlayers = [];
  }
}

// Create new player upon connection
function checkNewPlayer(scene) {
  var _iterator2 = _createForOfIteratorHelper(creationQueue),
    _step2;
  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var playerId = _step2.value;
      createPlayer(players[playerId].id, scene);
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }
  creationQueue = [];
}

// Delete player upon disconnection
function checkDisconnect() {
  var _iterator3 = _createForOfIteratorHelper(deletionQueue),
    _step3;
  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _players$playerId$spr;
      var playerId = _step3.value;
      (_players$playerId$spr = players[playerId].sprite) === null || _players$playerId$spr === void 0 ? void 0 : _players$playerId$spr.destroy();
      delete players[playerId];
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }
  deletionQueue = [];
}

/* -------------------------PHASER FUNCTIONS------------------------- */

// Scene preloading for textures & keys
function preload() {
  skinsInitialisation(this);
}

// Scene creation
function create() {}

// Scene update
function update() {
  checkNewPlayer(this);
  checkDisconnect();
  checkKeyInputs();
  //WORK IN PROGRESS HERE
  checkSendUpdate();
}

/* -------------------------MAIN FUNCTIONS------------------------- */

function createGame() {
  var config = {
    type: _phaser["default"].HEADLESS,
    width: canvas.xSize,
    height: canvas.ySize,
    physics: {
      "default": 'arcade',
      arcade: {
        gravity: {
          y: 0
        },
        debug: false
      }
    },
    scene: {
      preload: preload,
      create: create,
      update: update
    }
  };
  game = new _phaser["default"].Game(_objectSpread({}, config));
}
function destroyGame() {
  if (game) {
    for (var playerId in players) {
      var _players$playerId$spr2;
      (_players$playerId$spr2 = players[playerId].sprite) === null || _players$playerId$spr2 === void 0 ? void 0 : _players$playerId$spr2.destroy();
    }
    game.destroy(true, false);
    game = null;
  }
  if (_worker_threads.parentPort) _worker_threads.parentPort.close;
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

if (_worker_threads.parentPort) {
  _worker_threads.parentPort.on('message', function (data) {
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
}
createGame();
