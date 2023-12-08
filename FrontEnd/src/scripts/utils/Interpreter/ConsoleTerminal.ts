import { i } from 'mathjs'
import { Player } from '../../Models/Player'
import { CommandExpression } from './CommandExpression'
import { COMMANDS } from './Commands'
import { sceneEvents } from '../../Events/EventsController'

export class ConsoleTerminal extends Phaser.Scene {
  private isOpen: boolean = false
  private inputText: string = ''
  private textInput: Phaser.GameObjects.Text
  private waterMark: Phaser.GameObjects.Text
  private background: Phaser.GameObjects.Rectangle
  private commandInfo: Phaser.GameObjects.Text
  private playerList: Player[]
  private player: Player

  constructor() {
    super({ key: 'ConsoleTerminal' })
  }

  init(data) {
    this.playerList = data['playerList']
    this.player = data['playerObj']
  }
  update() {}

  preload() {}

  create() {
    const scene = this
    this.background = this.add.rectangle(0, 0, 2000, 200, 0xff0000)
    this.background.setAlpha(0.5)

    this.textInput = this.add.text(10, 10, '', { fontFamily: 'Arial', fontSize: '16', color: '#ffffff' })
    this.commandInfo = this.add.text(10, 30, '', { fontFamily: 'Arial', fontSize: '16', color: '#ffffff' })
    this.waterMark = this.add.text(850, 80, '', { fontFamily: 'Arial', fontSize: '16', color: '#ffffff' })
    this.textInput.setWordWrapWidth(Number.parseInt(this.game.canvas.width.toString()))

    this.input.keyboard.on('keydown', this.handleKeyPress, this)

    this.close()
  }

  open(): void {
    console.log('open() method, opened')
    console.log('width', Number.parseInt(this.sys.game.config.width.toString()))
    console.log('in main game', this.cameras.main.displayWidth)
    this.waterMark.setText('© XCOM GAME DEV CONSOLE')

    this.isOpen = true
    this.textInput.setText('> ')
    this.background.setAlpha(0.5)
  }

  close(): void {
    console.log('close() method, closed')
    this.isOpen = false
    this.textInput.setText('')
    this.waterMark.setText('')
    this.commandInfo.setText('')
    this.inputText = ''
    this.background.setAlpha(0)
  }

  isCharLetter(char) {
    return /^[a-z-0-9]$/i.test(char)
  }

  // let chr = String.fromCharCode(event.keyCode)
  // const cmd = this.inputText.split(' ')
  handleKeyPress(event: Phaser.Input.Keyboard.Key): void {
    let chr = String.fromCharCode(event.keyCode)
    if (this.isOpen) {
      switch (event.keyCode) {
        case 187: // PLUS SIGN CLOSE CONSOLE IF OPEN
          this.close()
          break
        case 13: // ENTER KEY PRESSED HANDLE COMMANDS
          this.interpretCommand(this.inputText)
          this.inputText = ''
          this.textInput.setText('> ')
          break

        case 8: // BACKSPACE PRESSED
          this.inputText = this.inputText.slice(0, -1)
          this.textInput.setText('> ' + this.inputText)
          break

        default: // UPDATE INPUT TEXT
          if (this.isCharLetter(chr) || event.keyCode === 32) {
            this.inputText += chr
            this.textInput.setText('> ' + this.inputText)
          }
      }
    } else if (!this.isOpen) {
      if (event.keyCode === 187) {
        this.open()
      }
    }
  }

  handleKillCommand(playerToKill: string) {
    let didFind = false
    
    this.playerList.forEach(playerInList => {
      if (playerInList.playerName.text.toLowerCase() == playerToKill.toString().toLowerCase()) {
        didFind = true
        console.log('found player, killing')
        sceneEvents.emit('kill', playerInList.id)
        this.commandInfo.setText('KILLED PLAYER ' + playerToKill)
        setTimeout(() => {
          this.commandInfo.setText('')
        }, 1500)
      }
      console.log(playerInList.playerName.text)
    })
    if (!didFind) {
      this.commandInfo.setText('PLAYER ' + playerToKill + ' NOT FOUND')
      setTimeout(() => {
        this.commandInfo.setText('')
      }, 1500)
    }
  }

  handleMoveCommand(direction: number, commandCounter: number) {
    console.log("in handle move command", direction, commandCounter)
    sceneEvents.emit('movement', { direction, commandCounter })
    this.commandInfo.setText('MOVED')
    setTimeout(() => {
      this.commandInfo.setText('')
    }, 1500)
  }

  handleUndoCommand() {
    sceneEvents.emit('Undo')
    this.commandInfo.setText('TURN UNDONE')
    setTimeout(() => {
      this.commandInfo.setText('')
    }, 1500)
  }
  

  handleInvincibility() {
    sceneEvents.emit('god', this.player.id)
    this.commandInfo.setText('INVINCIBILITY ACTIVATED ')
        setTimeout(() => {
          this.commandInfo.setText('')
        }, 1500)
  }

  handleNoCommand(noCommand: string) {
    this.commandInfo.setText('NO SUCH COMMAND "' + noCommand + '"')
    setTimeout(() => {
      this.commandInfo.setText('')
    }, 1500)
  }

  interpretCommand(command: string): void {
    const expression = new CommandExpression(command)
    expression.interpret(this)
  }
}
