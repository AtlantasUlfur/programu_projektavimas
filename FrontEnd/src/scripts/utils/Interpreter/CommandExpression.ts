import { ConsoleTerminal } from "./ConsoleTerminal"
import { Expression } from "./Expression"
export class CommandExpression extends Expression {
  constructor(private command: string) {
    super()
  }

  interpret(context: Context, terminal: ConsoleTerminal): void {
    terminal.executeCommand(this.command, context)
  }
}
