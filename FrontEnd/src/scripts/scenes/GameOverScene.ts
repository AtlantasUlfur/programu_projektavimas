import Phaser from 'phaser'
import { sceneEvents } from '../Events/EventsController'

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver')
  }

  preload() {
    this.load.image('glass-panel', '../../assets/glassPanel.png')
  }

  init() {
    var gameOverWidget = this.add
      .image(this.scale.width * 0.5, this.scale.height * 0.5, 'glass-panel')
      .setDisplaySize(500, 300)
      .setVisible(false)
    var gameOverWidgetText = this.add
      .text(gameOverWidget.x, gameOverWidget.y, 'Game Over ')
      .setOrigin(0.5)
      .setFontSize(48)
      .setVisible(false)

    sceneEvents.on('gameOver', payload => {
      console.log('Game Over')
      if (payload.victory) gameOverWidgetText.setText('Victory').setVisible(true)
      else gameOverWidgetText.setText('Game Over \n You Lose').setVisible(true)

      gameOverWidget.setVisible(true)
    })
  }

  create() {}

  update() {}
}
