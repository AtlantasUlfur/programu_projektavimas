import { LobbiesEnum } from '../../Models/Enums'
import { MainMenuScene } from '../../scenes/MainMenuScene'
import { MainMenuState } from './State'

export class WaitingState implements MainMenuState {
  handleInput(mainMenu: MainMenuScene): void {}
  createInput(mainMenu: MainMenuScene): void {}

  update(mainMenu: MainMenuScene): void {
    mainMenu.playerCountText?.setText(`Joining lobby...`)
    console.log(mainMenu.lobbyStatus)
    if (mainMenu.lobbyStatus == LobbiesEnum.IN_LOBBY) {
      mainMenu.transitionToInLobbyState()
    } else if (mainMenu.lobbyStatus == LobbiesEnum.DENIED) {
      mainMenu.transitionToDeniedState()
    }
  }
}
