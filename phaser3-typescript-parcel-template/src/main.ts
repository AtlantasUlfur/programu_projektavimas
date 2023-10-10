import * as Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'
import TestScene from './scenes/Scene2'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 768,
	height: 672,
	physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        },
		matter: {
			debug: false,
		}
    },
	scene: [TestScene]
}

const game = new Phaser.Game(config)
export default game
