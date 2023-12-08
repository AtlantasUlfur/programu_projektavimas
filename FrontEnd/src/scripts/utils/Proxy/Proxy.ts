import { DirectionEnum } from '../../Models/Enums'
import { Player } from '../../Models/Player'
import MainScene from '../../scenes/MainScene'

export class MovementProxy {
  private mainScene: MainScene
  constructor(mainScene: MainScene) {
    this.mainScene = mainScene
  }
  public run(direction: DirectionEnum, commandCounter: number) {
    if (this.validate()) {
      this.mainScene.handleMovement(direction, commandCounter)
    }
  }
  public validate() {
    if (this.mainScene.playersTurnId == this.mainScene.player.id && !this.mainScene.player.isDead()) {
      return true
    }
    return false
  }
}

export class DamageProxy {
  private mainScene: MainScene
  constructor(mainScene: MainScene) {
    this.mainScene = mainScene
  }
  public run(payload) {
    if (this.validate()) {
      this.mainScene.handleDamage(payload)
    }
  }
  public validate() {
    if (this.mainScene.playersTurnId == this.mainScene.player.id && !this.mainScene.player.isDead()) {
      return true
    }
    return false
  }
}
