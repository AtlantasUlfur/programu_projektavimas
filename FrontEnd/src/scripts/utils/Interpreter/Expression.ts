import { ConsoleTerminal } from "./ConsoleTerminal"

export abstract class Expression {
  abstract interpret(terminal: ConsoleTerminal): void
}
