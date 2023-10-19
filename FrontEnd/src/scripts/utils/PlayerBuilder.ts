import { Player } from '../Models/Player' // Assuming Player class and Enums are in the same file

export default class PlayerBuilder {
  private scene: Phaser.Scene
  private x: number
  private y: number
  private key: string
  private name: string
  private hp?: number
  private socketId: string
  private frame: number

  constructor(scene: Phaser.Scene) {
    this.scene = scene
  }

  setPosition(x: number, y: number): PlayerBuilder {
    this.x = x
    this.y = y
    return this
  }

  setKey(key: string): PlayerBuilder {
    this.key = key
    return this
  }

  setName(name: string): PlayerBuilder {
    this.name = name
    return this
  }

  setHP(hp: number | undefined): PlayerBuilder {
    this.hp = hp == undefined ? 100 : hp;
    return this
  }
  setFrame(frame: number): PlayerBuilder {
    this.frame = frame;
    return this
  }

  setSocketId(socketId: string): PlayerBuilder {
    this.socketId = socketId
    return this
  }

  build(): Player {
    const player = new Player(this.scene, this.x, this.y, this.key, this.frame, this.name, this.hp, this.socketId)

    return player
  }
}
