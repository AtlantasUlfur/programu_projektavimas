import { ConsoleTerminal } from "./ConsoleTerminal"

export abstract class Expression {
  abstract interpret(context: Context, terminal: ConsoleTerminal): void
}
