import { Button } from '../../Models/Button'
import { MainMenuScene } from '../../scenes/MainMenuScene'
import { MainMenuState } from './State'

export class InLobbyState implements MainMenuState {
  handleInput(mainMenu: MainMenuScene, index: Number): void {
    console.log('handling input in lobby state')
    if (0 == index) {
      mainMenu.socketInstance.createLobby(mainMenu.playerName)
      while (!mainMenu.selectedTheme) {
        mainMenu.selectedTheme = prompt('Enter a number for map theme(1:cloud, 2:jungle, 3:city, 4:hell)', '1')
      }
      mainMenu.add.text(mainMenu.scale.width * 0.5, mainMenu.scale.height * 0.5, 'You are host').setOrigin(0.5)
      mainMenu.playerCountText = mainMenu.add
        .text(
          mainMenu.scale.width * 0.5,
          mainMenu.scale.height * 0.6,
          `Waiting for players... ${mainMenu.playerCount}/4`
        )
        .setOrigin(0.5)

      var startGameButtonImage = mainMenu.add
        .image(mainMenu.scale.width * 0.5, mainMenu.scale.height * 0.7, 'glass-panel')
        .setDisplaySize(150, 50)
      var startGameButtonText = mainMenu.add
        .text(startGameButtonImage.x, startGameButtonImage.y, 'Start Game')
        .setOrigin(0.5)

      mainMenu.buttons.push(new Button(startGameButtonImage, startGameButtonText))
      mainMenu.selectButton(0)

      startGameButtonImage.on('selected', () => {
        console.log('Start game pressed')
        mainMenu.socketInstance.startGame(mainMenu.playerName, mainMenu.selectedTheme)
      })
    } else {
      setTimeout(function () {
        var lobby

        var lobbyButtonImage = mainMenu.add
          .image(mainMenu.scale.width * 0.5, mainMenu.scale.height * 0.6, 'glass-panel')
          .setDisplaySize(500, 300)
        var lobbyTitleText = mainMenu.add
          .text(lobbyButtonImage.x * 0.7, lobbyButtonImage.y * 0.68, 'Lobby Name')
          .setOrigin(0.5)
        var lobbyCountText = mainMenu.add
          .text(lobbyButtonImage.x * 1.3, lobbyButtonImage.y * 0.68, 'Player Count')
          .setOrigin(0.5)
        var splitter = mainMenu.add
          .text(lobbyButtonImage.x * 1, lobbyButtonImage.y * 0.72, `${'-'.repeat(48)}`)
          .setOrigin(0.5)
        var lobbyButtonNameText = mainMenu.add
          .text(
            lobbyButtonImage.x * 0.65,
            lobbyButtonImage.y,
            mainMenu.lobbies.map(lobby => `${lobby.name}`).join('\n')
          )
          .setOrigin(0.5)
        var lobbyButtonCountText = mainMenu.add
          .text(
            lobbyButtonImage.x * 1.3,
            lobbyButtonImage.y,
            mainMenu.lobbies.map(lobby => `${lobby.playerCount}/4`).join('\n')
          )
          .setOrigin(0.5)
        mainMenu.lobbies
          .map(lobby => `${lobby.name}`)
          .forEach(lobby => {
            let lobbyNameText = mainMenu.add
              .text(lobbyButtonImage.x * 0.65, lobbyButtonImage.y, lobby)
              .setOrigin(0.5)
              .setInteractive()
              .on('pointerdown', function () {
                lobbyTitleText.visible = false
                lobbyCountText.visible = false
                splitter.visible = false
                lobbyButtonNameText.visible = false
                lobbyButtonCountText.visible = false
                lobbyNameText.visible = false
                mainMenu.playerCountText = mainMenu.add.text(
                  lobbyButtonImage.x * 0.76,
                  lobbyButtonImage.y,
                  `Joining lobby...`
                )
                mainMenu.socketInstance.joinLobby(lobby, mainMenu.playerName)
                mainMenu.transitionToWaitingState()
              })
          })
      }, 500)
    }
  }
  createInput(mainMenu: MainMenuScene): void {}
  update(mainMenu: MainMenuScene): void {
    if (mainMenu.playerCount < 2) {
      var boton = mainMenu.buttons.find(button => button.Text.text == 'Start Game')
      boton?.Image.setVisible(false)
      boton?.Text.setVisible(false)
      mainMenu.buttonSelector.visible = false
    }
    if (mainMenu.playerCount >= 2 && mainMenu.playerCount <= 4) {
      var boton = mainMenu.buttons.find(button => button.Text.text == 'Start Game')
      boton?.Image.setVisible(true)
      boton?.Text.setVisible(true)
      mainMenu.buttonSelector.visible = true
    }
    mainMenu.playerCountText?.setText(`Waiting for players... ${mainMenu.playerCount}/4`)
  }
}
