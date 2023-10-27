import { Player } from '../../Models/Player'

export interface ICommand {
  execute(): any
  undo(): any
}

export class PlayerChangeWeapon implements ICommand {
  player: Player

  constructor(player: Player) {
    this.player = player
  }

    execute() {
        this.player.switchToSideArm();
    }
    undo() {
        this.player.switchToMainArm();
    }
    
}