import { SizeEnum } from './Enums'
export class Player extends Phaser.GameObjects.Sprite {
  private playerName: Phaser.GameObjects.Text
  private isMoved: boolean
  private isFinished: boolean
  private currentHealth: integer
  private waitText: Phaser.GameObjects.Text

  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, 0, 0, key)

    this.currentHealth = 100
    this.isMoved = false
    this.isFinished = false

    //Add to scene
    this.scene.add.existing(this)

    //Self explanitory
    this.setTexture('player')

    this.setDepth(0)

    this.setPosition(x, y)

    this.playerName = this.scene.add.text(0, 0, 'YOU', {
      fontFamily: 'Arial',
      fontSize: '16',
      fontStyle: 'bold',
      color: '#008000'
    })
    this.playerName.setDepth(10)
    this.playerName.setOrigin(0.5, 1.5)
    this.playerName.setResolution(7)
  }

  update(time: number, delta: number) {
    this.showPlayerNickname()
  }

  showPlayerNickname() {
    // this.playerName.x = this.x - (this.playerName.width / 2);
    // this.playerName.y = this.y - (this.height / 2);
    this.playerName.setPosition(this.x, this.y - SizeEnum.PLAYER_NAME_OFFSET)
  }

  setMoveStatus(isMoved: boolean) {
    this.isMoved = isMoved
  }

  isAvailable(): boolean {
    return !this.isFinished
  }

  onDamage(damage: integer) {
    this.currentHealth -= damage
  }

  isDead(): boolean {
    return this.currentHealth <= 0
  }

  createFinishedText() {
    this.waitText = this.scene.add
      .text(this.x, this.y, 'E', {
        padding: {
          left: 10,
          top: 10
        }
      })
      .setVisible(false)
  }

  setFinishedText() {
    this.waitText.setX(this.x)
    this.waitText.setY(this.y)
    this.waitText.setVisible(true)
  }

  finishAction() {
    this.setMoveStatus(false)
    this.isFinished = true
    this.setFinishedText()
  }

  startAction() {
    this.isFinished = false
    this.waitText.setVisible(false)
  }
}
