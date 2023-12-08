import { Player } from '../../Models/Player'
import GunsIterator from '../Iterator/GunsIterator'

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
      this.player.selectNextGun();
    }
    undo() {
      this.player.selectPreviousGun();
    }
    
}