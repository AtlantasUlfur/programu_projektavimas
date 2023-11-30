import { MainMenuScene } from '../../scenes/MainMenuScene'

export interface MainMenuState {
  handleInput(mainMenu: MainMenuScene, index: Number): void
  update(mainMenu: MainMenuScene): void
  createInput(mainMenu: MainMenuScene): void
}
