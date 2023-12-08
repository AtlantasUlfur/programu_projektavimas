import { ArgumentExpression } from './ArgumentExpression'
import { COMMANDS } from './Commands'
import { ConsoleTerminal } from './ConsoleTerminal'
import { Expression } from './Expression'
export class CommandExpression extends Expression {
  private command: string
  private arguments: ArgumentExpression[]

  constructor(command: string) {
    super()
    const cmd = command.split(' ')
    this.command = cmd[0]
    const argumentValues = cmd.slice(1)
    this.arguments = argumentValues.map(value => new ArgumentExpression(value))
  }

  interpret(terminal: ConsoleTerminal): void {
    switch (this.command) {
      case COMMANDS.KILL:
        if (this.arguments[0]) {
          terminal.handleKillCommand(this.arguments[0].interpret(terminal) as string)
        } else {
          terminal.handleNoCommand(this.command)
        }
        break
      case COMMANDS.UNDO:
        terminal.handleUndoCommand()
        break
      case COMMANDS.GOD:
        terminal.handleInvincibility()
        break
      case COMMANDS.MOVE:
        if (this.arguments[0] && this.arguments[1]) {
          let direction = this.arguments[0].interpret(terminal) as number
          let count = this.arguments[1].interpret(terminal) as number
          if (isNaN(direction) || direction > 3 || direction < 0) {
            const directionString = this.arguments[0].interpret(terminal) as string
            switch (directionString.toLowerCase()) {
              case 'up':
                direction = 0
                break
              case 'left':
                direction = 2
                break
              case 'right':
                direction = 3
                break
              case 'down':
                direction = 1
                break
            }
            if (isNaN(count) || count > 5 || count < 0) {
              console.log('count is wrong')
              terminal.handleNoCommand(this.command)
              return
            }
            console.log('moving', direction, count, typeof count)
            terminal.handleMoveCommand(direction, count)
          } else if (isNaN(count) || count > 5 || count < 0) {
            console.log('count is wrong')
            terminal.handleNoCommand(this.command)
          } else {
            console.log('moving')
            terminal.handleMoveCommand(direction, count)
          }
          break
        }
      default:
        terminal.handleNoCommand(this.command)
        break
    }
  }
}
