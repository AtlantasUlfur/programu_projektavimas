import { Textures } from 'phaser';
import { SizeEnum, DirectionEnum } from './Enums'
import { IGun } from '../Interfaces/Guns/IGun';
import { GunCreator } from '../utils/GunCreator';
export class Player extends Phaser.GameObjects.Sprite {
  public id : string;
  private playerName: Phaser.GameObjects.Text;
  private isMoved: boolean;
  private isFinished: boolean;
  private currentHealth: integer;
  private waitText: Phaser.GameObjects.Text;
  private allGuns: IGun[];
  private color: string
  private gunImage: Phaser.GameObjects.Image

  public tilePos : Phaser.Math.Vector2;
  public attackPower: number = 0;

  public selectedGun: IGun;

  public mainGunIndex: number;
  public sideGunIndex: number;



  constructor(scene: Phaser.Scene, tilePos : Phaser.Math.Vector2, key: string, frame: number, name: string, hp: number, socketId : string, color: string) {
    super(scene, 0, 0, key)

    this.id = socketId;
    this.currentHealth = hp;
    this.isMoved = false;
    this.isFinished = false;

    this.tilePos = tilePos;

    //Add to scene
    this.scene.add.existing(this);

    //Self explanitory
    this.setTexture('player');
    this.setFrame(frame);
    this.setDepth(0);
    this.setPosition(tilePos.x * SizeEnum.TILE_SIZE + SizeEnum.TILE_X_OFFSET, tilePos.y * SizeEnum.TILE_SIZE - SizeEnum.TILE_Y_OFFSET);

    //Create player name
    this.playerName = this.scene.add.text(0, 0, name, {
      fontFamily: 'Arial',
      fontSize: '16',
      fontStyle: 'bold',
      color: color
    });
    this.playerName.setDepth(10);
    this.playerName.setOrigin(0.5, 1.5);
    this.playerName.setResolution(7);

    this.showPlayerNickname();


    this.allGuns = GunCreator.CreateAllGuns();

    // needs specific gun at some point
    if(this.allGuns.length > 0){
      this.selectedGun = this.allGuns[3];
      this.sideGunIndex = 0;

      this.mainGunIndex = 3;
      
      this.gunImage = this.scene.add.image(
        0, 0, 'guns', this.selectedGun.gunFrame
        ).setScale(0.2);

      this.gunImage.setDepth(10);
      this.gunImage.setOrigin(0.5, 1.5);

      this.showChosenGun();
    } 
  }

  selectWeapon(index: number)
  {
    this.gunImage.destroy();
    this.selectedGun = this.allGuns[index]

    this.gunImage = this.scene.add.image(
      0, 0, 'guns', this.selectedGun.gunFrame
      ).setScale(0.2);

    this.gunImage.setDepth(10);
    this.gunImage.setOrigin(0.5, 1.5);

    this.showChosenGun();
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

  setMoveStatus(isMoved: boolean) {
    this.isMoved = isMoved
  }

  isAvailable(): boolean {
    return !this.isFinished
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
  getPlayerName() : string{
    return this.playerName.text
  }
  getCurrentHealth() : integer{
    return this.currentHealth
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
