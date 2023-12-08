import * as Phaser from 'phaser'
import { config } from '../config/Config'
import { MainMenuScene } from './scenes/MainMenuScene'
import MainScene from './scenes/MainScene'
import GameUI from './scenes/GameUi'
import GameOverScene from './scenes/GameOverScene'
import { BaseScene } from './utils/Template/BaseScene'
import { ConsoleTerminal } from './utils/Interpreter/ConsoleTerminal'

var MAIN_MENU_KEY = 'MainMenu'
var MAIN_KEY = 'MainScene'
var UI_KEY = 'UIScene'
var GAME_OVER_KEY = 'GameOver'
var CONSOLE_TERMINAL_KEY = "ConsoleTerminal"
class Game extends Phaser.Game {
  constructor() {
    super(config)

    this.loadScene(MAIN_MENU_KEY, MainMenuScene)
    this.loadScene(MAIN_KEY, MainScene)
    this.loadScene(UI_KEY, GameUI)
    this.loadScene(GAME_OVER_KEY, GameOverScene)
    this.loadScene(CONSOLE_TERMINAL_KEY, ConsoleTerminal)
    this.scene.start(MAIN_MENU_KEY)
  }
  
  loadScene(key: string, scene : typeof BaseScene){
    this.scene.add(key, scene)
  }
}

window.onload = function () {
  const game = new Game()
}
