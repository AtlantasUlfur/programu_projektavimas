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

  constructor() {
    super({ key: 'ConsoleTerminal' })
  }

  init(data) {
    this.playerList = data['playerList']
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

  handleKeyPress(event: Phaser.Input.Keyboard.Key): void {
    console.log('pressed open console')
    let chr = String.fromCharCode(event.keyCode)
    console.log('pressed char:', chr)
    console.log('keycode:', event.keyCode)
    const cmd = this.inputText.split(' ')
    if (this.isOpen) {
      switch (event.keyCode) {
        case 187: // PLUS SIGN CLOSE CONSOLE IF OPEN
          this.close()
          break

        case 13: // ENTER KEY PRESSED HANDLE COMMANDS
          if (cmd[0] === COMMANDS.KILL) {
            this.playerList.forEach(playerInList => {
              console.log('text entered:', cmd[1])
              console.log('player name', playerInList.playerName.text)
              if (playerInList.playerName.text == cmd[1].toLowerCase()) {
                console.log('killing')
                sceneEvents.emit('kill', playerInList.id)
                this.commandInfo.setText('KILLED PLAYER ' + cmd[1])
                setTimeout(() => {
                  this.commandInfo.setText('')
                }, 1500)
              }
              console.log(playerInList.playerName.text)
            })
          } else if (cmd[0] === COMMANDS.PAUSE) {
          } else if (cmd[0] === COMMANDS.GOD) {
            // Handle GOD command
            this.commandInfo.setText('GOD MODE ACTIVATION HAS SUCCEDED')
            setTimeout(() => {
              this.commandInfo.setText('')
            }, 1500)
          } else {
            this.commandInfo.setText('NO SUCH COMMAND "' + this.inputText + '"')
            setTimeout(() => {
              this.commandInfo.setText('')
            }, 1500)
          }
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

  executeCommand(command: string, context: Context): void {
    console.log('Command executed:', this.inputText)
    // Extend this method to handle specific commands

    this.inputText = ''
    this.textInput.setText('> ')
  }

  interpretCommand(command: string, context: Context): void {
    const expression = new CommandExpression(command)
    expression.interpret(context, this)
  }
}
