import Phaser from 'phaser'

import { sceneEvents } from '../Events/EventsController'
import { Player } from '../Models/Player'
import { DirectionEnum } from '../Models/Enums'
import { PlayerChangeWeapon } from '../utils/Command/Command'
import { IItem } from '../Interfaces/IItem'

export default class GameUI extends Phaser.Scene {
  MenuGroup: Phaser.GameObjects.Group
  baseSprite: Phaser.GameObjects.Sprite
  expandSprite: Phaser.GameObjects.Sprite
  backBtn: Phaser.GameObjects.Sprite
  nameLabel: Phaser.GameObjects.Text
  player: Player
  playerTexture: Phaser.Textures.Texture
  hpLabel: Phaser.GameObjects.Text
  turnLabel: Phaser.GameObjects.Text
  playerSprite: Phaser.GameObjects.Sprite
  hotbarOne: Phaser.GameObjects.Sprite
  hotbarTwo: Phaser.GameObjects.Sprite
  hotbarThree: Phaser.GameObjects.Sprite
  hotbarFour: Phaser.GameObjects.Sprite
  mainGunHotbar: Phaser.GameObjects.Sprite
  mainGunIcon: Phaser.GameObjects.Image
  switchWeaponBtnUp: Phaser.GameObjects.Sprite
  switchWeaponBtnDown: Phaser.GameObjects.Sprite
  switchWeaponCommand: PlayerChangeWeapon
  sideGunHotbar: Phaser.GameObjects.Sprite
  sideGunIcon: Phaser.GameObjects.Image
  playerList: Player[]
  playersTurnId: string
  arrowUp: Phaser.GameObjects.Sprite
  arrowDown: Phaser.GameObjects.Sprite
  arrowLeft: Phaser.GameObjects.Sprite
  arrowRight: Phaser.GameObjects.Sprite
  Undo: Phaser.GameObjects.Sprite
  commandUp: Phaser.GameObjects.Sprite
  commandDown: Phaser.GameObjects.Sprite
  brokenBone: Phaser.GameObjects.Sprite
  bleeding: Phaser.GameObjects.Sprite
  commandLabel: Phaser.GameObjects.Text
  commandText: Phaser.GameObjects.Text
  commandCounter: number
  constructor() {
    super({ key: 'UIScene' })
  }
  preload() {
    //Load textures
    this.load.spritesheet('base', '../../assets/base.png', { frameWidth: 1920, frameHeight: 1080 })
    this.load.spritesheet('back', '../../assets/back.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('arrow', '../../assets/arrow.png', { frameWidth: 64, frameHeight: 64 })
    this.load.spritesheet('frame', '../../assets/frame.png', { frameWidth: 96, frameHeight: 96 })
    this.load.spritesheet('attack', '../../assets/attack.png', { frameWidth: 88, frameHeight: 88 })
    this.load.spritesheet('arrowup', '../../assets/arrow_top.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('arrowdown', '../../assets/arrow_down.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('arrowleft', '../../assets/arrow_left.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('arrowright', '../../assets/arrow_right.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('guns', '../../assets/guns.png', { frameWidth: 160, frameHeight: 160 })
    this.load.spritesheet('gun-switch', '../../assets/GunSwitch.png', { frameWidth: 130, frameHeight: 130 })
    this.load.spritesheet('broken_bone', '../../assets/broken_bone.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('bleeding', '../../assets/bleeding.png', { frameWidth: 128, frameHeight: 128 })
    this.load.spritesheet('health-potion', '../../assets/health-potion.png', { frameWidth: 32, frameHeight: 32 })
    this.load.spritesheet('clock', '../../assets/clock.png', { frameWidth: 120, frameHeight: 120 })
  }
  init(data) {
    this.commandCounter = 1
    this.player = data['playerObj']
    this.playersTurnId = data['playersTurnId']
    this.playerList = data['players']
  }

  update() {
    if (this.player.isCrippled && this.baseSprite.visible) 
    {
      this.brokenBone.setVisible(true)
    }
    else {
      this.brokenBone.setVisible(false)
    }
    if (this.player.isBleeding && this.baseSprite.visible) 
    {
      this.bleeding.setVisible(true)
    }
    else {
      this.bleeding.setVisible(false)
    }
    if (this.player.isBleeding && this.commandCounter > 3){
      this.commandCounter = 3;
      this.commandText.setText(this.commandCounter.toString());
    } 

  }

  create() {
    const scene = this

    this.switchWeaponCommand = new PlayerChangeWeapon(this.player)

    this.baseSprite = this.add.sprite(0, 0, 'base')
    this.baseSprite.displayHeight = 600
    this.baseSprite.displayWidth = 300
    this.baseSprite.setOrigin(1, 0)
    this.baseSprite.setPosition(1000, 0)

    this.expandSprite = this.add.sprite(0, 0, 'arrow')
    this.expandSprite.displayHeight = 40
    this.expandSprite.displayWidth = 40
    this.expandSprite.setOrigin(1, 0)
    this.expandSprite.setPosition(1000, 300)
    this.expandSprite.setVisible(false)
    this.expandSprite.disableInteractive()
    this.expandSprite.on('pointerdown', event => {
      this.MenuGroup.setVisible(true)
      this.expandSprite.disableInteractive()
      this.expandSprite.setVisible(false)
    })

    this.backBtn = this.add.sprite(0, 0, 'back')
    this.backBtn.displayHeight = 20
    this.backBtn.displayWidth = 20
    this.backBtn.setOrigin(1, 0)
    this.backBtn.setPosition(990, 3)
    this.backBtn.setInteractive()
    this.backBtn.on('pointerdown', event => {
      this.MenuGroup.setVisible(false)
      this.expandSprite.setInteractive()
      this.expandSprite.setVisible(true)
    })
    this.nameLabel = this.add.text(0, 0, 'xddd', {
      fontSize: '50'
    })
    this.nameLabel.scale = 2
    this.nameLabel.setOrigin(1, 0)
    this.nameLabel.setPosition(870, 70)

    this.nameLabel.text = this.player.getPlayerName()
    this.playerTexture = this.player.frame.texture

    this.playerSprite = this.add.sprite(850, 140, this.playerTexture, this.player.frame.name).setScale(2)

    this.hpLabel = this.add.text(0, 0, this.player.getCurrentHealth() + ' / 100', {
      fontSize: '50'
    })
    this.hpLabel.scale = 2
    this.hpLabel.setOrigin(1, 0)
    this.hpLabel.setPosition(890, 200)
    this.hpLabel.setColor('#008000')
    sceneEvents.on('hpChange', event => {
      this.hpLabel.setText(this.player.getCurrentHealth() + ' / 100')
    })

    this.turnLabel = this.add.text(0, 0, '', {
      fontSize: '50'
    })

    this.turnLabel.scale = 2
    this.turnLabel.setOrigin(1, 0)
    this.turnLabel.setPosition(950, 530)
    this.turnLabel.setColor('#000000')
    if (this.playersTurnId == this.player.id) {
      this.turnLabel.setText("IT'S YOUR TURN!")
      this.turnLabel.setColor('#008000')
    } else {
      this.turnLabel.setText("IT'S NOT YOUR TURN!")
      this.turnLabel.setColor('#ff0000')
    }
    sceneEvents.on('turnChanged', event => {
      if (event == this.player.id) {
        this.turnLabel.setText("IT'S YOUR TURN!")
        this.turnLabel.setColor('#008000')
      } else {
        this.turnLabel.setText("IT'S NOT YOUR TURN!")
        this.turnLabel.setColor('#ff0000')
      }
    })

    this.hotbarOne = this.add.sprite(0, 0, 'frame')
    this.hotbarOne.displayHeight = 40
    this.hotbarOne.displayWidth = 40
    this.hotbarOne.setOrigin(1, 0)
    this.hotbarOne.setPosition(790, 260)
    this.hotbarOne.setInteractive()
    this.hotbarOne.on('pointerdown', event => {
      this.hotbarOne.setTint(0xeaebe7)
    })
    this.hotbarOne.on('pointerup', event => {
      this.hotbarOne.clearTint()
    })

    this.hotbarTwo = this.add.sprite(0, 0, 'frame')
    this.hotbarTwo.displayHeight = 40
    this.hotbarTwo.displayWidth = 40
    this.hotbarTwo.setOrigin(1, 0)
    this.hotbarTwo.setPosition(840, 260)
    this.hotbarTwo.setInteractive()
    this.hotbarTwo.on('pointerdown', event => {
      this.hotbarTwo.setTint(0xeaebe7)
    })
    this.hotbarTwo.on('pointerup', event => {
      this.hotbarTwo.clearTint()
    })

    this.hotbarThree = this.add.sprite(0, 0, 'frame')
    this.hotbarThree.displayHeight = 40
    this.hotbarThree.displayWidth = 40
    this.hotbarThree.setOrigin(1, 0)
    this.hotbarThree.setPosition(890, 260)
    this.hotbarThree.setInteractive()
    this.hotbarThree.on('pointerdown', event => {
      this.hotbarThree.setTint(0xeaebe7)
    })
    this.hotbarThree.on('pointerup', event => {
      this.hotbarThree.clearTint()
    })

    this.hotbarFour = this.add.sprite(0, 0, 'frame')
    this.hotbarFour.displayHeight = 40
    this.hotbarFour.displayWidth = 40
    this.hotbarFour.setOrigin(1, 0)
    this.hotbarFour.setPosition(940, 260)
    this.hotbarFour.setInteractive()
    this.hotbarFour.on('pointerdown', event => {
      this.hotbarFour.setTint(0xeaebe7)
    })
    this.hotbarFour.on('pointerup', event => {
      this.hotbarFour.clearTint()
    })

    //Switch Weapon
    this.switchWeaponBtnUp = this.add.sprite(0, 0, 'gun-switch')
    this.switchWeaponBtnUp.displayHeight = 40
    this.switchWeaponBtnUp.displayWidth = 40
    this.switchWeaponBtnUp.setOrigin(1, 0)
    this.switchWeaponBtnUp.setPosition(940, 160)
    this.switchWeaponBtnUp.setInteractive()
    this.switchWeaponBtnUp.on('pointerdown', event => {
      this.switchWeaponBtnUp.setTint(0xeaebe7)
      sceneEvents.emit('changeGun', "execute")
      this.switchWeaponCommand.execute();
    })
    this.switchWeaponBtnUp.on('pointerup', event => {
      this.switchWeaponBtnUp.clearTint()
    })
    //
    this.switchWeaponBtnDown = this.add.sprite(0, 0, 'gun-switch')
    this.switchWeaponBtnDown.displayHeight = 40
    this.switchWeaponBtnDown.displayWidth = 40
    this.switchWeaponBtnDown.setOrigin(1, 0)
    this.switchWeaponBtnDown.setPosition(985, 160)
    this.switchWeaponBtnDown.setInteractive()
    this.switchWeaponBtnDown.on('pointerdown', event => {
      this.switchWeaponBtnDown.setTint(0xeaebe7)
      sceneEvents.emit('changeGun', "undo")
      this.switchWeaponCommand.undo();
    })
    this.switchWeaponBtnDown.on('pointerup', event => {
      this.switchWeaponBtnDown.clearTint()
    })

    //Broken bone status
    this.brokenBone = this.add.sprite(0, 0, 'broken_bone')
    this.brokenBone.displayHeight = 40
    this.brokenBone.displayWidth = 40
    this.brokenBone.setOrigin(1, 0)
    this.brokenBone.setPosition(780, 160)
    this.brokenBone.setVisible(false)

    //Bleeding  status
    this.bleeding = this.add.sprite(0, 0, 'bleeding')
    this.bleeding.displayHeight = 40
    this.bleeding.displayWidth = 40
    this.bleeding.setOrigin(1, 0)
    this.bleeding.setPosition(780, 115)
    this.bleeding.setVisible(false)

    // CONTROLS

    this.arrowUp = this.add.sprite(0, 0, 'arrowup')
    this.arrowUp.displayHeight = 24
    this.arrowUp.displayWidth = 24
    this.arrowUp.setOrigin(1, 0)
    this.arrowUp.setPosition(860, 450)
    this.arrowUp.setInteractive()
    this.arrowUp.on('pointerdown', event => {
      this.arrowUp.tint = 12
      const direction = DirectionEnum.UP
      const commandCounter = this.commandCounter
      sceneEvents.emit('movement', { direction, commandCounter })
    })
    this.arrowUp.on('pointerup', event => {
      this.arrowUp.clearTint()
    })

    this.arrowDown = this.add.sprite(0, 0, 'arrowdown')
    this.arrowDown.displayHeight = 24
    this.arrowDown.displayWidth = 24
    this.arrowDown.setOrigin(1, 0)
    this.arrowDown.setPosition(860, 500)
    this.arrowDown.setInteractive()
    this.arrowDown.on('pointerdown', event => {
      this.arrowDown.tint = 12
      const direction = DirectionEnum.DOWN
      const commandCounter = this.commandCounter
      sceneEvents.emit('movement', { direction, commandCounter })
    })
    this.arrowDown.on('pointerup', event => {
      this.arrowDown.clearTint()
    })

    this.arrowLeft = this.add.sprite(0, 0, 'arrowleft')
    this.arrowLeft.displayHeight = 24
    this.arrowLeft.displayWidth = 24
    this.arrowLeft.setOrigin(1, 0)
    this.arrowLeft.setPosition(835, 475)
    this.arrowLeft.setInteractive()
    this.arrowLeft.on('pointerdown', event => {
      this.arrowLeft.tint = 12
      const direction = DirectionEnum.LEFT
      const commandCounter = this.commandCounter
      sceneEvents.emit('movement', { direction, commandCounter })
    })
    this.arrowLeft.on('pointerup', event => {
      this.arrowLeft.clearTint()
    })

    this.arrowRight = this.add.sprite(0, 0, 'arrowright')
    this.arrowRight.displayHeight = 24
    this.arrowRight.displayWidth = 24
    this.arrowRight.setOrigin(1, 0)
    this.arrowRight.setPosition(885, 475)
    this.arrowRight.setInteractive()
    this.arrowRight.on('pointerdown', event => {
      this.arrowRight.tint = 12
      const direction = DirectionEnum.RIGHT
      const commandCounter = this.commandCounter
      sceneEvents.emit('movement', { direction, commandCounter })
    })
    this.arrowRight.on('pointerup', event => {
      this.hotbarOne.clearTint()
    })

    // COMMANDS

    this.commandLabel = this.add.text(0, 0, 'STEP', {
      fontSize: '24'
    })
    this.commandLabel.scale = 1
    this.commandLabel.setOrigin(1, 0)
    this.commandLabel.setPosition(770, 464)
    this.commandLabel.setColor('white')

    this.commandText = this.add.text(0, 0, this.commandCounter.toString(), {
      fontSize: '50'
    })
    this.commandText.scale = 2
    this.commandText.setOrigin(1, 0)
    this.commandText.setPosition(762, 484)
    this.commandText.setColor('white')

    this.commandUp = this.add.sprite(0, 0, 'arrowup')
    this.commandUp.displayHeight = 24
    this.commandUp.displayWidth = 24
    this.commandUp.setOrigin(1, 0)
    this.commandUp.setPosition(800, 474)
    this.commandUp.setInteractive()
    this.commandUp.on('pointerdown', event => {
      if ((this.commandCounter < 5 && !this.player.isCrippled) || this.commandCounter < 3) {
        this.commandCounter++
        this.commandText.setText(this.commandCounter.toString())
      }
    })
    this.commandUp.on('pointerup', event => {
      this.commandUp.clearTint()
    })

    this.commandDown = this.add.sprite(0, 0, 'arrowdown')
    this.commandDown.displayHeight = 24
    this.commandDown.displayWidth = 24
    this.commandDown.setOrigin(1, 0)
    this.commandDown.setPosition(800, 499)
    this.commandDown.setInteractive()
    this.commandDown.on('pointerdown', event => {
      if (this.commandCounter > 1) {
        this.commandCounter--
        this.commandText.setText(this.commandCounter.toString())
      }
    })
    this.commandDown.on('pointerup', event => {
      this.commandDown.clearTint()
    })

    // this.Undo= this.add.sprite(0, 0, 'arrowright')
    // this.Undo.displayHeight = 24
    // this.Undo.displayWidth = 24
    // this.Undo.setOrigin(1, 0)
    // this.Undo.setPosition(885, 550)
    // this.Undo.setInteractive()
    // this.Undo.on('pointerdown', event => {
    //   this.Undo.tint = 12
    // console.log("pressed")
    //   sceneEvents.emit('Undo')
    // })
    // this.Undo.on('pointerup', event => {
    //   this.hotbarOne.clearTint()
    // })

    this.MenuGroup = this.add.group()
    this.MenuGroup.add(this.baseSprite)
    this.MenuGroup.add(this.expandSprite)
    this.MenuGroup.add(this.backBtn)
    this.MenuGroup.add(this.nameLabel)
    this.MenuGroup.add(this.hpLabel)
    this.MenuGroup.add(this.playerSprite)
    this.MenuGroup.add(this.hotbarOne)
    this.MenuGroup.add(this.hotbarTwo)
    this.MenuGroup.add(this.hotbarThree)
    this.MenuGroup.add(this.hotbarFour)
    this.MenuGroup.add(this.switchWeaponBtnUp)
    this.MenuGroup.add(this.switchWeaponBtnDown)
    this.MenuGroup.add(this.arrowUp)
    this.MenuGroup.add(this.arrowDown)
    this.MenuGroup.add(this.arrowLeft)
    this.MenuGroup.add(this.arrowRight)
    this.MenuGroup.add(this.commandUp)
    this.MenuGroup.add(this.commandDown)
    this.MenuGroup.add(this.commandLabel)
    this.MenuGroup.add(this.commandText)
    this.MenuGroup.add(this.brokenBone)
    this.MenuGroup.add(this.bleeding)

    var i = 0
    this.playerList.forEach(playerInList => {
      if (playerInList.id != this.player.id) {
        var spriteLocal = this.add.sprite(750 + i, 350, playerInList.frame.texture, playerInList.frame.name).setScale(2)
        i = i + 100
        var attackBtn = this.add.sprite(0, 0, 'attack')
        attackBtn.setInteractive()
        attackBtn.on('pointerdown', event => {
          attackBtn.tint = 12
          sceneEvents.emit('damage', playerInList.id)
        })
        attackBtn.on('pointerup', event => {
          attackBtn.clearTint()
        })
        attackBtn.displayHeight = 44
        attackBtn.displayWidth = 44
        attackBtn.setOrigin(1, 0)
        attackBtn.setPosition(672 + i, 400)
        this.MenuGroup.add(attackBtn)
        this.MenuGroup.add(spriteLocal)
      }
    })

    this.player.inventory.forEach((item: IItem, index: number) => {
      let positionX = 790 + (50 * index);
      let itemBar = this.add.sprite(0, 0, item.getTexture());
      itemBar.displayHeight = 40
      itemBar.displayWidth = 40
      itemBar.setOrigin(1, 0)
      itemBar.setPosition(positionX, 260)
      itemBar.setInteractive()
      itemBar.on('pointerdown', event => {
        itemBar.setTint(0xeaebe7)
        sceneEvents.emit('useItem', index);
      })
      itemBar.on('pointerup', event => {
        itemBar.destroy();
      })
    })
  }
}
