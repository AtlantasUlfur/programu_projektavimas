import { LobbiesEnum } from '../../Models/Enums'
import { MainMenuScene } from '../../scenes/MainMenuScene'
import { MainMenuState } from './State'

export class WaitingState implements MainMenuState {
  handleInput(mainMenu: MainMenuScene): void {
    // Handle input for the waiting state
  }
  createInput(mainMenu: MainMenuScene): void {}

  update(mainMenu: MainMenuScene): void {
    mainMenu.playerCountText?.setText(`Joining lobby...`)
    if (mainMenu.lobbyStatus == LobbiesEnum.IN_LOBBY) {
      mainMenu.transitionToInLobbyState()
    }
  }
}
