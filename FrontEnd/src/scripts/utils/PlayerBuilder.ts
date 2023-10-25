import { IGun } from '../Interfaces/Guns/IGun'
import { SizeEnum } from '../Models/Enums'
import { Player } from '../Models/Player'

interface PlayerBuilderInterface {
  setPosition(tilePos: Phaser.Math.Vector2): void
  setName(name: string): void
  setHP(hp: number | undefined): void
  setFrame(frame: number): void
  setColor(color: string): void
  setSocketId(socketId: string): void
  setGun(gun : IGun): void;
  build(): Player;
}

export default class PlayerBuilder implements PlayerBuilderInterface {
  private player : Player;
  private scene : Phaser.Scene;
  private key : string;

  constructor(scene, key) {
    this.scene = scene;
    this.key = key;
    this.reset();
  }
  public reset() {
    this.player = new Player(this.scene, this.key)
  }
  setPosition(tilePos: Phaser.Math.Vector2): void {
    this.player.tilePos = tilePos;
    this.player.setPosition(tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET);
    
  }

  setName(name: string): void {
    this.player.playerName = this.player.scene.add.text(0, 0, name, {
      fontFamily: 'Arial',
      fontSize: '16',
      fontStyle: 'bold',
    });
    this.player.playerName.setDepth(10);
    this.player.playerName.setOrigin(0.5, 1.5);
    this.player.playerName.setResolution(7);
    this.player.playerName.setPosition(this.player.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.player.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET - SizeEnum.PLAYER_NAME_OFFSET)
    this.player.showPlayerNickname();
  }

  setHP(hp: number): void {
    this.player.currentHealth = hp;
  }
  setFrame(frame: number): void {
    this.player.setTexture('player');
    this.player.setFrame(frame);
    this.player.setDepth(0);
  }
  setColor(color: string): void {
    this.player.playerName.setColor(color)
  }

  setSocketId(socketId: string): void {
    this.player.id = socketId;
  }
  setGun(gun : IGun) : void {
     // needs specific gun at some point
     this.player.selectedGun = gun;
     this.player.gunImage = this.scene.add.image(
         0, 0, 'guns', this.player.selectedGun.gunFrame
     ).setScale(0.2);
 
     this.player.gunImage.setDepth(10);
     this.player.gunImage.setOrigin(0.5, 1.5);
 
     this.player.showChosenGun();
  }

  build(): Player {
    const result = this.player;
    //Add to scene
    this.scene.add.existing(this.player);
    this.reset()
    return result;
  }
}
