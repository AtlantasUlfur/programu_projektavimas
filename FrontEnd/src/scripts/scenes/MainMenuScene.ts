import * as Phaser from 'phaser'
import SocketController from '../SocketController'
import { Button } from '../Models/Button'
import { LobbiesEnum } from '../Models/Enums'
import { SessionServer } from '../Models/ServerModels'

export class MainMenuScene extends Phaser.Scene {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private buttons: Button[] = []
  private selectedButtonIndex = 0
  private buttonSelector!: Phaser.GameObjects.Image
  private socketInstance: SocketController
  public playerCount: number = 0
  private checkPlayerCount: boolean = false
  private playerCountText: Phaser.GameObjects.Text
  public lobbyStatus: LobbiesEnum = LobbiesEnum.MENU
  public playerName: string | null
  public lobbies: SessionServer[] = []
  public selectedTheme: string | null

  constructor() {
    super('MainMenu')
  }

  init() {
    this.cursors = this.input.keyboard.createCursorKeys()

    // //Socket initialise
    this.socketInstance = SocketController.getInstance()
    this.socketInstance.connect('http://localhost:8081', this)
  }

  preload() {
    this.load.image('glass-panel', '../../assets/glassPanel.png')
    this.load.image('cursor-hand', '../../assets/cursor_hand.png')
  }

  create() {
    const scene = this

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      createButtonImage.off('selected')
    })

    const { width, height } = this.scale

    //Title
    var title = this.add
      .text(width * 0.5, height * 0.2, 'XCOM GAME')
      .setOrigin(0.5)
      .setFontSize(58)

    // Play button
    var createButtonImage = this.add.image(width * 0.5, height * 0.6, 'glass-panel').setDisplaySize(150, 50)
    var createButtonText = this.add.text(createButtonImage.x, createButtonImage.y, 'Create Game').setOrigin(0.5)

    var createButton = new Button(createButtonImage, createButtonText)

    // Join Button
    var joinButtonImage = this.add
      .image(createButtonImage.x, createButtonImage.y + createButtonImage.displayHeight + 10, 'glass-panel')
      .setDisplaySize(150, 50)
    var joinButtonText = this.add.text(joinButtonImage.x, joinButtonImage.y, 'Join Game').setOrigin(0.5)

    var joinButton = new Button(joinButtonImage, joinButtonText)

    this.buttons.push(createButton)
    this.buttons.push(joinButton)
    this.buttonSelector = this.add.image(0, 0, 'cursor-hand')
    this.selectButton(0)

    // Ask for player name
    while (!this.playerName) {
      this.playerName = prompt('Please enter your name:', '')
    }

    // Show player name
    var playerNameText = this.add
      .text(width * 0.9, height * 0.05, `Player: ${this.playerName}`)
      .setOrigin(1, 0)
      .setFontSize(26)

    createButtonImage.on('selected', () => {
      console.log('Create game pressed')
      this.buttonClick(scene, 0)
    })

    joinButtonImage.on('selected', () => {
      console.log('Join game pressed')
      this.buttonClick(scene, 1)
    })
  }
  startGame(payload: any) {
    var theme = payload.theme;
    switch(theme) {
      case "1":
        theme = "cloud_background";
        this.scene.start("MainScene", {payload, theme});
        break;
      case "2":
        theme = "jungle_background";
        this.scene.start("MainScene", {payload, theme});
        break;
      case "3":
        theme = "city_background";
        this.scene.start("MainScene", {payload, theme});
        break;
      case "4":
        theme = "hell_background";
        this.scene.start("MainScene", {payload, theme});
        break;
      default:
        theme = "cloud_background";
        this.scene.start("MainScene", {payload, theme});
        break;
    }
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

    switch (this.lobbyStatus) {
      case LobbiesEnum.IN_LOBBY:
        this.playerCountText?.setText(`Waiting for players... ${this.playerCount}/4`)
        break
      case LobbiesEnum.WAITING:
        this.playerCountText?.setText(`Joining lobby...`)
        break
      case LobbiesEnum.DENIED:
        alert('Lobby not found')
        this.lobbyStatus = LobbiesEnum.MENU
        this.scene.restart()
        break
      default:
        break
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

    if (0 == index) {
      scene.socketInstance.createLobby(this.playerName)
      scene.lobbyStatus = LobbiesEnum.IN_LOBBY
      while(!this.selectedTheme) {
        this.selectedTheme = prompt("Enter a number for map theme(1:cloud, 2:jungle, 3:city, 4:hell)", "1");
      }
      scene.add.text(scene.scale.width * 0.5, scene.scale.height * 0.5, 'You are host').setOrigin(0.5)
      scene.playerCountText = scene.add
        .text(scene.scale.width * 0.5, scene.scale.height * 0.6, `Waiting for players... ${scene.playerCount}/4`)
        .setOrigin(0.5)

      var startGameButtonImage = this.add
        .image(scene.scale.width * 0.5, scene.scale.height * 0.7, 'glass-panel')
        .setDisplaySize(150, 50)
      var startGameButtonText = this.add
        .text(startGameButtonImage.x, startGameButtonImage.y, 'Start Game')
        .setOrigin(0.5)

      scene.buttons.push(new Button(startGameButtonImage, startGameButtonText))
      this.selectButton(0)
      scene.buttonSelector.visible = true

      startGameButtonImage.on('selected', () => {
        console.log('Start game pressed')
        scene.socketInstance.startGame(this.playerName, this.selectedTheme)
      })
    } else {
      setTimeout(function () {
        var lobby

        var lobbyButtonImage = scene.add
          .image(scene.scale.width * 0.5, scene.scale.height * 0.6, 'glass-panel')
          .setDisplaySize(500, 300)
        var lobbyTitleText = scene.add
          .text(lobbyButtonImage.x * 0.7, lobbyButtonImage.y * 0.68, 'Lobby Name')
          .setOrigin(0.5)
        var lobbyCountText = scene.add
          .text(lobbyButtonImage.x * 1.3, lobbyButtonImage.y * 0.68, 'Player Count')
          .setOrigin(0.5)
        var splitter = scene.add
          .text(lobbyButtonImage.x * 1, lobbyButtonImage.y * 0.72, `${'-'.repeat(48)}`)
          .setOrigin(0.5)
        var lobbyButtonNameText = scene.add
          .text(lobbyButtonImage.x * 0.65, lobbyButtonImage.y, scene.lobbies.map(lobby => `${lobby.name}`).join('\n'))
          .setOrigin(0.5)
        var lobbyButtonCountText = scene.add
          .text(
            lobbyButtonImage.x * 1.3,
            lobbyButtonImage.y,
            scene.lobbies.map(lobby => `${lobby.playerCount}/4`).join('\n')
          )
          .setOrigin(0.5)

        setTimeout(function () {
          while (!lobby) {
            lobby = prompt('Please enter the lobby you wish to join:', '')
          }
          scene.playerCountText = scene.add.text(lobbyButtonImage.x * 0.76, lobbyButtonImage.y, `Joining lobby...`)
          scene.socketInstance.joinLobby(lobby, scene.playerName)
          scene.lobbyStatus = LobbiesEnum.WAITING
          lobbyTitleText.visible = false
          lobbyCountText.visible = false
          splitter.visible = false
          lobbyButtonNameText.visible = false
          lobbyButtonCountText.visible = false
        }, 500)
      }, 500)

      // var createButtonText = this.add.text(createButtonImage.x, createButtonImage.y, 'Create Game')
      // .setOrigin(0.5)
      // scene.lobbyStatus = LobbiesEnum.WAITING;

      // scene.playerCountText = scene.add.text(scene.scale.width * 0.5, scene.scale.height * 0.6, `Joining lobby...`)
      // .setOrigin(0.5)
    }
  }
}
