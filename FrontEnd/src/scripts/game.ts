import * as Phaser from 'phaser'
import { config } from '../config/Config'
import { MainMenuScene } from './scenes/MainMenuScene'
import MainScene from './scenes/MainScene'
import GameUI from './scenes/GameUi'
import GameOverScene from './scenes/GameOverScene'
import { ConsoleTerminal } from './utils/Interpreter/ConsoleTerminal'

var MAIN_MENU_KEY = 'MainMenu'
var MAIN_KEY = 'MainScene'
var UI_KEY = 'UIScene'
var GAME_OVER_KEY = 'GameOver'
var CONSOLE_TERMINAL_KEY = "ConsoleTerminal"
class Game extends Phaser.Game {
  constructor() {
    super(config)
    this.scene.add(MAIN_MENU_KEY, MainMenuScene)
    this.scene.add(MAIN_KEY, MainScene)
    this.scene.add(UI_KEY, GameUI)
    this.scene.add(GAME_OVER_KEY, GameOverScene)

    this.scene.add(CONSOLE_TERMINAL_KEY, ConsoleTerminal)
    this.scene.start(MAIN_MENU_KEY)
  }
}

window.onload = function () {
  const game = new Game()
}
