export class SceneManagerFacade {
  scene: Phaser.Scenes.ScenePlugin

  constructor(scene: Phaser.Scenes.ScenePlugin) {
    this.scene = scene
  }

  startMainScene(payload) {
    var theme = payload.theme
    switch (theme) {
      case '1':
        theme = 'cloud_background'
        this.scene.start('MainScene', { payload, theme })
        break
      case '2':
        theme = 'jungle_background'
        this.scene.start('MainScene', { payload, theme })
        break
      case '3':
        theme = 'city_background'
        this.scene.start('MainScene', { payload, theme })
        break
      case '4':
        theme = 'hell_background'
        this.scene.start('MainScene', { payload, theme })
        break
      default:
        theme = 'cloud_background'
        this.scene.start('MainScene', { payload, theme })
        break
    }
  }

  runGameOverScene() {
    console.log("running game over scene")
    this.scene.run('GameOver')
  }

  runGameUIScene(player, playerList, playersTurnId) {
    console.log("run ui scene")
    this.scene.run('UIScene', { playerObj: player, players: playerList, playersTurnId: playersTurnId })
  }
  runConsoleTerminalScene(playerList, playerObj) {
    console.log("running console scene")
    this.scene.run('ConsoleTerminal', { playerList, playerObj })
  }

  restartCurrentScene() {
    this.scene.restart()
  }
}
