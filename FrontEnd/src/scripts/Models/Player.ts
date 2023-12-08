import { Textures } from 'phaser'
import { SizeEnum, DirectionEnum } from './Enums'
import { IGun } from '../Interfaces/Guns/IGun'
import { IRifle } from '../Interfaces/Guns/IRifle'
import { IGrenadeLauncher } from '../Interfaces/Guns/IGrenadeLauncher'
import { IPistol } from '../Interfaces/Guns/IPistol'
import _ from 'lodash'
import { IGunOwnerAbstraction } from '../Interfaces/BridgeAbstraction/IGunOwnerAbstraction'
import { IItem } from '../Interfaces/IItem'
import GunsArray from '../utils/Iterator/GunsArray'
import GunsIterator from '../utils/Iterator/GunsIterator'

export class Player extends Phaser.GameObjects.Sprite implements IGunOwnerAbstraction{
  public id: string
  public playerName: Phaser.GameObjects.Text
  public currentHealth: integer
  public tilePos: Phaser.Math.Vector2
  public attackPower: number = 0
  public selectedGun: IGun
  public isBleeding?: boolean;
  public isCrippled?: boolean;
  private gunsIterator: GunsIterator;
  private allGuns_: GunsArray;
  set allGuns(value: GunsArray)
  {
    this.allGuns_ = value;
    this.gunsIterator = value.getIterator();
  }
  get allGuns(){
    return this.allGuns_
  }
  public gunImage: Phaser.GameObjects.Image 

  private MAX_INVENTORY_SIZE = 4;
  public inventory: Array<IItem> = [];

  constructor(scene: Phaser.Scene, key: string) {
    super(scene, 0, 0, key)
  }

  

  update(time: number, delta: number) {
    this.showPlayerNickname()
    this.showChosenGun()
  }

  setTilePos(x: number, y: number) {
    this.tilePos = new Phaser.Math.Vector2(x, y)
    this.setPosition(
      this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
      this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET
    )
    this.showPlayerNickname()
    this.showChosenGun()
  }
  setHP(amount: number) {
    this.currentHealth = amount
  }

  showPlayerNickname() {
    // this.playerName.x = this.x - (this.playerName.width / 2);
    // this.playerName.y = this.y - (this.height / 2);
    this.playerName.setPosition(
      this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
      this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET - SizeEnum.PLAYER_NAME_OFFSET
    )
  }
  showChosenGun() {
    // this.playerName.x = this.x - (this.playerName.width / 2);
    // this.playerName.y = this.y - (this.height / 2);
    this.gunImage.setPosition(
      this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
      this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET - SizeEnum.PLAYER_NAME_OFFSET + 10
    )
  }

  move(direction: DirectionEnum, stepCount: integer) {
    if (!this.isDead()) {
      switch (direction) {
        case DirectionEnum.UP:
          this.tilePos.y -= stepCount
          this.setPosition(
            this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
            this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET
          )
          break
        case DirectionEnum.DOWN:
          this.tilePos.y += stepCount
          this.setPosition(
            this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
            this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET
          )
          break
        case DirectionEnum.LEFT:
          this.tilePos.x -= stepCount
          this.setPosition(
            this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
            this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET
          )
          break
        case DirectionEnum.RIGHT:
          this.tilePos.x += stepCount
          this.setPosition(
            this.tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET,
            this.tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET
          )
          break
        default:
          console.log('Somethings wrong...')
          break
      }
    }
  }

  onDamage(damage: integer) {
    this.currentHealth -= damage
  }
  getTexture() {
    return this.texture
  }
  isDead(): boolean {
    return this.currentHealth <= 0
  }

  getPlayerName(): string {
    return this.playerName.text
  }
  getCurrentHealth(): integer {
    return this.currentHealth
  }
  die() {
    this.setTexture('dead').setFrame(1051)
    this.gunImage.visible = false
    this.playerName.setText('DEAD')
  }
  setGun(gun: IGun): void {
    // needs specific gun at some point
    this.selectedGun = gun
    this.setGunImage(this.selectedGun.gunFrame)
  }
  selectNextGun(){
    if(this.gunsIterator.hasNext())
    {
      this.selectedGun = this.gunsIterator.next();
      this.setGunImage(this.selectedGun.gunFrame);
    }
  }
  selectPreviousGun(){
    if(this.gunsIterator.hasPrevious()){
      this.selectedGun = this.gunsIterator.previous();
      this.setGunImage(this.selectedGun.gunFrame);
    }
  }
  setGunImage(gunFrame: number) {
    if (this.gunImage !== undefined) {
      this.gunImage.destroy()
    }

    this.gunImage = this.scene.add.image(0, 0, 'guns', gunFrame).setScale(0.2)

    this.gunImage.setDepth(10)
    this.gunImage.setOrigin(0.5, 1.5)

    this.showChosenGun()
  }

  addItem(item : IItem){
    //FIXME: if item was removed from the inventory it becomes undefined.
    // Check for undefined and replace with new object
    if(this.inventory.length < this.MAX_INVENTORY_SIZE){
      this.inventory.push(item);
    }
  }

  removeItem(itemIndex : number){
    delete this.inventory[itemIndex];
  }

  getItem(itemIndex : number){
    return this.inventory[itemIndex];
  }
}
