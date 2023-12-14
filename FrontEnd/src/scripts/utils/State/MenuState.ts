import { Button } from '../../Models/Button'
import { MainMenuScene } from '../../scenes/MainMenuScene'
import { MainMenuState } from './State'

// Concrete implementation
export class MenuState implements MainMenuState {
  createInput(mainMenu: MainMenuScene): void {
    mainMenu.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      createButtonImage.off('selected')
    })
    const { width, height } = mainMenu.scale

    //Title
    var title = mainMenu.add
      .text(width * 0.5, height * 0.2, 'XCOM GAME')
      .setOrigin(0.5)
      .setFontSize(58)

    // Play button
    var createButtonImage = mainMenu.add.image(width * 0.5, height * 0.6, 'glass-panel').setDisplaySize(150, 50)
    var createButtonText = mainMenu.add.text(createButtonImage.x, createButtonImage.y, 'Create Game').setOrigin(0.5)

    var createButton = new Button(createButtonImage, createButtonText)

    // Join Button
    var joinButtonImage = mainMenu.add
      .image(createButtonImage.x, createButtonImage.y + createButtonImage.displayHeight + 10, 'glass-panel')
      .setDisplaySize(150, 50)
    var joinButtonText = mainMenu.add.text(joinButtonImage.x, joinButtonImage.y, 'Join Game').setOrigin(0.5)

    var joinButton = new Button(joinButtonImage, joinButtonText)

    mainMenu.buttons.push(createButton)
    mainMenu.buttons.push(joinButton)
    mainMenu.buttonSelector = mainMenu.add.image(0, 0, 'cursor-hand')
    mainMenu.selectButton(0)

    // Ask for player name
    while (!mainMenu.playerName) {
      mainMenu.playerName = prompt('Please enter your name:', '')
    }

    // Show player name
    var playerNameText = mainMenu.add
      .text(width * 0.9, height * 0.05, `Player: ${mainMenu.playerName}`)
      .setOrigin(1, 0)
      .setFontSize(26)

    createButtonImage.on('selected', () => {
      console.log('Create game pressed')
      mainMenu.transitionToInLobbyState()
      mainMenu.buttonClick(mainMenu, 0)
    })

    joinButtonImage.on('selected', () => {
      console.log('Join game pressed')
      mainMenu.transitionToInLobbyState()
      mainMenu.buttonClick(mainMenu, 1)
    })
  }
  handleInput(mainMenu: MainMenuScene): void {
    console.log('handling input in menu state')
  }
  update(mainMenu: MainMenuScene): void {}
}
