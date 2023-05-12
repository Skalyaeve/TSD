import Phaser from 'phaser'
import { io } from 'socket.io-client'

const config = {
	type: Phaser.HEADLESS,
	parent: 'phaser-example',
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
function preload() { }
function create() { }
function update() { }
const game = new Phaser.Game(config);
const socket = io('http://localhost:3001')