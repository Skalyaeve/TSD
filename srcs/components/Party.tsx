import React, { useEffect, useRef } from 'react'
import Phaser from 'phaser'

function Party() {
	// Valeurs
	const config = {
		type: Phaser.AUTO,
		width: 800,
		height: 600,
		physics: {
			default: 'arcade',
			arcade: {
				gravity: { y: 300 },
				debug: false
			}
		},
		scene: {
			preload: preload,
			create: create
		}
	}
	let game: Phaser.Game | null = null
	const gameRef = useRef(null)

	// Modifieurs
	function preload(this: Phaser.Scene) {
		this.load.image('sky', './/resources/assets/sky.png')
		this.load.image('wiz', './/resources/assets/TEST.png')
	}
	function create(this: Phaser.Scene) {
		this.add.image(400, 300, 'sky')
	}

	useEffect(() => {
		if (gameRef.current) {
			game = new Phaser.Game({ ...config, parent: gameRef.current })
		}
		return () => {
			if (game) {
				game.destroy(true)
			}
		}
	}, [])

	// Retour
	return (
		<div className='party main__content'>
			<div ref={gameRef}></div>
		</div>
	)
}
export default Party