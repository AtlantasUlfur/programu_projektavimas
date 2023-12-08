import * as Phaser from 'phaser'
import SocketController from '../SocketController'
import { Button } from '../Models/Button'
import { LobbiesEnum } from '../Models/Enums'
import { SessionServer } from '../Models/ServerModels'
import { SceneManagerFacade } from '../utils/Facade/SceneManagerFacade'
import { MainMenuState } from '../utils/State/State'
import { MenuState } from '../utils/State/MenuState'
import { InLobbyState } from '../utils/State/InLobbyState'
import { WaitingState } from '../utils/State/WaitingState'
import { DeniedState } from '../utils/State/DeniedState'
import { BaseScene } from '../utils/Template/BaseScene'
import { ConsoleTerminal } from '../utils/Interpreter/ConsoleTerminal'
export class MainMenuScene extends BaseScene {
  private state: MainMenuState
  public cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  public buttons: Button[] = []
  private consoleTerminal : ConsoleTerminal
  private selectedButtonIndex = 0
  public buttonSelector!: Phaser.GameObjects.Image
  public playerCount: number = 0
  private checkPlayerCount: boolean = false
  public playerCountText: Phaser.GameObjects.Text
  public lobbyStatus: LobbiesEnum = LobbiesEnum.MENU
  public playerName: string | null
  public lobbies: SessionServer[] = []
  public selectedTheme: string | null
  public sceneManager: SceneManagerFacade

  constructor() {
    super('MainMenu')
    this.state = new MenuState()
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()

    // //Socket initialise
    this.socketInstance = SocketController.getInstance()
    this.socketInstance.connect('http://localhost:8081', this)
    this.sceneManager = new SceneManagerFacade(this.scene)
  }

  preload() {
    this.load.image('glass-panel', '../../assets/glassPanel.png')
    this.load.image('cursor-hand', '../../assets/cursor_hand.png')
  }

  create() {
    const scene = this
    console.log("main menu width:", this.sys.game.config.width)
    console.log("main menu height:", this.sys.game.config.height)
    this.state.createInput(this)
  }

  startGame(payload: any) {
    this.sceneManager?.startMainScene(payload)
  }

  selectButton(index: number) {
    const currentButton = this.buttons[this.selectedButtonIndex]

    // set the current selected button to a white tint
    currentButton.Image.setTint(0xffffff)

    const button = this.buttons[index]

    // set the newly selected button to a green tint
    button.Image.setTint(0x66ff7f)

    // move the hand cursor to the right edge
    this.buttonSelector.x = button.Image.x + button.Image.displayWidth * 0.5
    this.buttonSelector.y = button.Image.y + 10

    // store the new selected index
    this.selectedButtonIndex = index
  }

  selectNextButton(change = 1) {
    let index = this.selectedButtonIndex + change

    // wrap the index to the front or end of array
    if (index >= this.buttons.length) {
      index = 0
    } else if (index < 0) {
      index = this.buttons.length - 1
    }

    this.selectButton(index)
  }

  confirmSelection() {
    const button = this.buttons[this.selectedButtonIndex]

    // emit the 'selected' event
    button.Image.emit('selected')
  }

  update() {
    this.state.update(this)
    const upJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
    const downJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.down!)
    const spaceJustPressed = Phaser.Input.Keyboard.JustDown(this.cursors.space!)
    if (upJustPressed) {
      this.selectNextButton(-1)
    } else if (downJustPressed) {
      this.selectNextButton(1)
    } else if (spaceJustPressed) {
      this.confirmSelection()
    }
  }

  buttonClick(scene: this, index: number) {
    this.socketInstance.getLobbies()
    //Hide Buttons
    scene.buttons.forEach(element => {
      element.Image.visible = false
      element.Text.visible = false
    })
    scene.buttons = []
    scene.buttonSelector.visible = false
    //Index = 0 -> Create Game; index = 1 -> Join Game
    this.state.handleInput(this, index)
  }
  transitionToMenuState() {
    this.state = new MenuState()
    this.lobbyStatus = LobbiesEnum.MENU
  }

  transitionToInLobbyState() {
    this.state = new InLobbyState()
    this.lobbyStatus = LobbiesEnum.IN_LOBBY
  }

  transitionToWaitingState() {
    this.state = new WaitingState()
    this.lobbyStatus = LobbiesEnum.WAITING
  }

  transitionToDeniedState() {
    this.state = new DeniedState()
    this.lobbyStatus = LobbiesEnum.DENIED
  }
}
