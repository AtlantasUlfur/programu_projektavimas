import { DirectionEnum } from '../../Models/Enums'
import { Player } from '../../Models/Player'
import MainScene from '../../scenes/MainScene'

export interface Proxy {
  run(payload: any);
  validate();
}
export class MovementProxy implements Proxy {
  private mainScene: MainScene
  constructor(mainScene: MainScene) {
    this.mainScene = mainScene
  }
  public run(payload: {direction: DirectionEnum, commandCounter: number}) {
    if (this.validate()) {
      this.mainScene.handleMovement(payload.direction, payload.commandCounter)
    }
  }
  public validate() {
    if (this.mainScene.playersTurnId == this.mainScene.player.id && !this.mainScene.player.isDead()) {
      return true
    }
    return false
  }
}

export class DamageProxy implements Proxy{
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
