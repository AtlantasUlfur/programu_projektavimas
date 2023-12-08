import { ConsoleTerminal } from './ConsoleTerminal'
import { Expression } from './Expression'

export class ArgumentExpression extends Expression {
  private argumentValue: string | number

  constructor(argumentValue: string | number) {
    super()
    this.argumentValue = argumentValue
  }

  interpret(terminal: ConsoleTerminal): string | number {
    console.log("arg", this.argumentValue)
    if (typeof this.argumentValue === 'number') {
      return this.argumentValue
    }

    const parsedValue = Number(this.argumentValue as string)

    if (!isNaN(parsedValue)) {
      return parsedValue
    } else {
      return this.argumentValue
    }
  }
}
