import { Textures } from 'phaser';
import { SizeEnum, DirectionEnum } from './Enums'
import { IGun } from '../Interfaces/Guns/IGun';
export class Player extends Phaser.GameObjects.Sprite {
  public id : string;
  public playerName: Phaser.GameObjects.Text;
  public currentHealth: integer;
  public tilePos : Phaser.Math.Vector2;
  public attackPower: number = 0;
  public selectedGun: IGun;
  public gunImage: Phaser.GameObjects.Image

  constructor(scene: Phaser.Scene, key: string) {
    super(scene, 0, 0, key)

  }

  update(time: number, delta: number) {
    this.showPlayerNickname()
    this.showChosenGun()
  }

  setTilePos(x: number, y: number){
    this.tilePos = new Phaser.Math.Vector2(x, y);
    this.setPosition(this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET);
    this.showPlayerNickname();
    this.showChosenGun();
  }
  setHP(amount: number){
    this.currentHealth = amount
  }

  showPlayerNickname() {
    // this.playerName.x = this.x - (this.playerName.width / 2);
    // this.playerName.y = this.y - (this.height / 2);
    this.playerName.setPosition(this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET - SizeEnum.PLAYER_NAME_OFFSET)
  }
  showChosenGun() {
    // this.playerName.x = this.x - (this.playerName.width / 2);
    // this.playerName.y = this.y - (this.height / 2);
    this.gunImage.setPosition(this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET - SizeEnum.PLAYER_NAME_OFFSET + 10)
  }

  move(direction : DirectionEnum, stepCount : integer){
    switch (direction) {
      case DirectionEnum.UP:
        this.tilePos.y -= stepCount;
        this.setPosition(this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET);
        break;
      case DirectionEnum.DOWN:
        this.tilePos.y += stepCount;
        this.setPosition(this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET);
        break;
      case DirectionEnum.LEFT:
        this.tilePos.x -= stepCount;
        this.setPosition(this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET);
        break;
      case DirectionEnum.RIGHT:
        this.tilePos.x += stepCount;
        this.setPosition(this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET);
        break;
      default:
        console.log("Somethings wrong...")
        break;
    }
  }


  onDamage(damage: integer) {
    this.currentHealth -= damage
  }
  getTexture(){
    return this.texture
  }
  isDead(): boolean {
    return this.currentHealth <= 0
  }

  getPlayerName() : string{
    return this.playerName.text
  }
  getCurrentHealth() : integer{
    return this.currentHealth
  }
  die(){
    this.setTexture('dead').setFrame(1051);
    this.gunImage.visible = false;
    this.playerName.setText("DEAD");
  }
}
