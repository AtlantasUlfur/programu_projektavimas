import { LobbiesEnum } from '../../Models/Enums'
import { MainMenuScene } from '../../scenes/MainMenuScene'
import { MainMenuState } from './State'

export class DeniedState implements MainMenuState {
  handleInput(mainMenu: MainMenuScene): void {
    // Handle input for the denied state
  }
  createInput(mainMenu: MainMenuScene): void {}

  update(mainMenu: MainMenuScene): void {
    alert('Lobby not found')
    mainMenu.lobbyStatus = LobbiesEnum.MENU
    mainMenu.sceneManager?.restartCurrentScene()
    mainMenu.transitionToMenuState() // Transition back to the menu state
  }
}
