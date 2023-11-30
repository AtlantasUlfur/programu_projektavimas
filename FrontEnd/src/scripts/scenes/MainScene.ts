import * as Phaser from 'phaser'
import SocketController from '../SocketController'
import { TileTypeEnum, SizeEnum, DirectionEnum } from '../Models/Enums'
import { PlayerServer } from '../Models/ServerModels'
import { Player } from '../Models/Player'
import PlayerBuilder from '../utils/Builder/PlayerBuilder'
import { sceneEvents } from '../Events/EventsController'
import { IGun } from '../Interfaces/Guns/IGun'
import { GunCreator } from '../utils/GunCreator'
import { IRifle } from '../Interfaces/Guns/IRifle'
import { IPistol } from '../Interfaces/Guns/IPistol'
import MapBuilder from '../utils/Builder/MapBuilder'
import { SceneManagerFacade } from '../utils/Facade/SceneManagerFacade'
import { MediumRangeGunStrategy } from '../utils/Strategy/GunStrategy'
import MathAdapter from '../utils/Adapter/MathAdapter'
import { Turret } from '../Models/Turret'
import { BaseScene } from '../utils/Template/BaseScene'

export default class MainScene extends BaseScene {

  //Init Data
  private mapData
  private currentPlayerData: PlayerServer
  private allPlayerData: PlayerServer[]
  //Map
  private tileMap: Phaser.Tilemaps.Tilemap
  //Players
  public playerList: Player[] = []
  public alivePlayerCount: number = 0
  public player: Player
  public playersTurnId: string = ''
  private allGuns: IGun[]
  public theme: string

  private turretCount = 1;
  private turretPositions: Array<{x: integer, y: integer}> = [];
  private turrets: Array<Turret> = [];
  public mathAdapter : MathAdapter = new MathAdapter()
  constructor() {
    super('MainScene')
  }

  init(data) {
    this.theme = data.theme
    this.currentPlayerData = data.payload.player
    this.allPlayerData = data.payload.sessionPlayers
    this.alivePlayerCount = this.allPlayerData.length
    this.playersTurnId = data.payload.playersTurnId
    this.socketInstance = SocketController.getInstance()
    this.socketInstance.setScene(this)
    this.allGuns = GunCreator.CreateAllGuns()

    //Fill map data
    this.mapData = [
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367],
      [367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367, 367]
    ]

    data.payload.map.tileMap.forEach(tile => {
      switch (tile.entity?.id) {
        case 'wall':
          if(this.turretCount > 0)
          {
            this.turretCount -= 1;
            this.turretPositions.push({x: tile.x as integer, y: tile.y as integer})
          }
          switch (this.theme) {
            case 'cloud_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.WALL
              break
            case 'hell_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.WALL_HELL
              break
            case 'city_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.WALL_CITY
              break
            case 'jungle_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.WALL_JUNGLE
              break
          }
          break
        case 'ground':
          switch (this.theme) {
            case 'cloud_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND
              break
            case 'hell_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND_HELL
              break
            case 'city_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND_CITY
              break
            case 'jungle_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND_JUNGLE
              break
          }
          break
        case 'player':
          switch (this.theme) {
            case 'cloud_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND
              break
            case 'hell_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND_HELL
              break
            case 'city_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND_CITY
              break
            case 'jungle_background':
              this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.GROUND_JUNGLE
              break
          }
          break
      }
    })
  }

  preload() {
    this.load.spritesheet('turret', '../../assets/turret.png', {
       frameWidth: 254, frameHeight: 254
    });
    //Load texturesW
    this.load.spritesheet('player', '../../assets/characters.png', {
      frameWidth: 26,
      frameHeight: 36
    })
    this.load.spritesheet('dead', '../../assets/cloud_tileset.png', {
      frameWidth: 16,
      frameHeight: 16
    })
    switch (this.theme) {
      case 'cloud_background':
        this.load.image('tiles', '../../assets/cloud_tileset.png')
        this.load.image('cloud_background', '../../assets/cloud_backround.png')
        break
      case 'hell_background':
        this.load.image('tiles', '../../assets/hell_tileset.png')
        this.load.image('hell_background', '../../assets/hell_background.jpg')
        break
      case 'jungle_background':
        this.load.image('tiles', '../../assets/jungle_tileset.png')
        this.load.image('jungle_background', '../../assets/jungle_background.png')
        break
      case 'city_background':
        this.load.image('tiles', '../../assets/city_tileset.png')
        this.load.image('city_background', '../../assets/city_background.png')

      default:
        this.load.image('tiles', '../../assets/cloud_tileset.png')
        this.load.image('cloud_background', '../../assets/cloud_backround.png')
        break
    }

    this.load.spritesheet('guns', '../../assets/guns.png', { frameWidth: 160, frameHeight: 160 })
  }

  create() {
    const scene = this

    this.turretPositions.forEach(turretPosition => {
      console.log(`adding turret at ${turretPosition.x}:${turretPosition.y}`)
      var turret = new Turret(scene, 'turret', 0.125);
      turret.setDepth(100)
      turret.setPos(new Phaser.Math.Vector2(turretPosition.x, turretPosition.y));
      this.add.existing(turret)
      this.turrets.push(turret)
    })

    const sceneManager = new SceneManagerFacade(this.scene)
    this.socketInstance = SocketController.getInstance()

    let mapBuilder = new MapBuilder(scene)
    mapBuilder.setBackground(this.theme)
    mapBuilder.setTileMap(this.mapData, 16, 16)
    mapBuilder.setTileSet('tile-set', 'tiles')
    this.tileMap = mapBuilder.build()

    //Create all players
    this.allPlayerData = this.allPlayerData.sort((a, b) => {
      return a.socketId.localeCompare(b.socketId)
    })
    const texture_frames = [49, 52, 55, 10]
    var pistol = this.allGuns[0] as IPistol
    var rifle = this.allGuns[4] as IRifle
    var deepPistol = pistol.deepCopy()
    var shallowPistol = pistol.shallowCopy() as IPistol;
    console.log("original pistol", pistol)
    console.log("shallowPistol", shallowPistol)
    console.log("changed shallow copy bullet object")
    shallowPistol.bullet.dmg = 123;
    console.log("----------")
    console.log("original pistol", pistol)
    console.log("shallowPistol", shallowPistol)
    console.log("original pistol", pistol)
    console.log("deepPistol", deepPistol)
    console.log("changed deep copy pistol bullet damage")
    deepPistol.bullet.dmg = 444
    console.log("pistol", pistol)
    console.log("deepPistol", deepPistol)

    let builder = new PlayerBuilder(scene, 'player')
    this.allPlayerData.forEach((playerData, index) => {
      if (playerData.x == scene.currentPlayerData.x && playerData.y == scene.currentPlayerData.y) {
        //Create current player
        builder.setPosition(new Phaser.Math.Vector2(playerData.x, playerData.y))
        builder.setFrame(texture_frames[index])
        builder.setName(playerData.name)
        builder.setColor('#008000')
        builder.setHP(playerData.currentHP);
        builder.setSocketId(playerData.socketId);
        builder.setSecondaryGun(pistol.deepCopy());
        builder.setMainGun(rifle.deepCopy() as IRifle);
        this.player = builder.build()
        scene.playerList.push(this.player)

        //Camera follow this player
        this.cameras.main.startFollow(this.player)
        this.cameras.main.roundPixels = true
        this.cameras.main.zoom = 2
      } else {
        //Create other player
        builder.setPosition(new Phaser.Math.Vector2(playerData.x, playerData.y))
        builder.setFrame(texture_frames[index])
        builder.setName(playerData.name)
        builder.setColor('red')
        builder.setHP(playerData.currentHP);
        builder.setSocketId(playerData.socketId);
        builder.setSecondaryGun(pistol.deepCopy());
        builder.setMainGun(rifle.deepCopy() as IRifle);

        let otherPlayer = builder.build()
        scene.playerList.push(otherPlayer)
      }
    })

    //Handle player events
    sceneEvents.on('movement', payload => {
      this.handleMovement(payload.direction, payload.commandCounter)
    })
    sceneEvents.on('damage', payload => {
      this.handleDamage(payload)
    })
    sceneEvents.on('changeGun', payload => {
      this.handleGunChange()
    })

    //Run UI Scenes
    sceneManager.runGameUIScene(this.player, this.playerList, this.playersTurnId)
    sceneManager.runGameOverScene()
  }
  private findPlayerById(id: string): Player | null {
    var player: Player | null = null

    this.playerList.forEach(element => {
      if (element.id == id) {
        player = element
      }
    })
    return player
  }
  handleGunChange() {
    this.socketInstance.changeGun()
  }

  update(time: number, delta: number) {
    if (this.player.attackPower == 0) {
      this.socketInstance.getAttackAmount()
    }
    if (this.alivePlayerCount == 1) {
      sceneEvents.emit('gameOver', { victory: true })
    }
    this.player.update(time, delta)
  }

  handleMovement(direction: DirectionEnum, commandCounter: number) {
    if (this.playersTurnId == this.player.id && !this.player.isDead()) {
      var distance = 0
      switch (direction) {
        case DirectionEnum.UP:
          distance = this.canPlayerMove(
            this,
            this.tileMap,
            this.player,
            this.player.tilePos.x,
            this.player.tilePos.y - commandCounter,
            DirectionEnum.UP
          )
          if (distance != 0) {
            this.socketInstance.movePlayer(this.player.tilePos.x, this.player.tilePos.y - distance)
            this.player.move(DirectionEnum.UP, distance)
            if (this.player.isBleeding) {
              this.socketInstance.damagePlayer(distance, this.player.id)
            }
            this.socketInstance.endTurn()
          }
          break
        case DirectionEnum.DOWN:
          distance = this.canPlayerMove(
            this,
            this.tileMap,
            this.player,
            this.player.tilePos.x,
            this.player.tilePos.y + commandCounter,
            DirectionEnum.DOWN
          )
          if (distance != 0) {
            this.socketInstance.movePlayer(this.player.tilePos.x, this.player.tilePos.y + distance)
            this.player.move(DirectionEnum.DOWN, distance)
            if (this.player.isBleeding) {
              this.socketInstance.damagePlayer(distance, this.player.id)
            }
            this.socketInstance.endTurn()
          }
          break
        case DirectionEnum.LEFT:
          distance = this.canPlayerMove(
            this,
            this.tileMap,
            this.player,
            this.player.tilePos.x - commandCounter,
            this.player.tilePos.y,
            DirectionEnum.LEFT
          )
          if (distance != 0) {
            this.socketInstance.movePlayer(this.player.tilePos.x - distance, this.player.tilePos.y)
            this.player.move(DirectionEnum.LEFT, distance)
            if (this.player.isBleeding) {
              this.socketInstance.damagePlayer(distance, this.player.id)
            }
            this.socketInstance.endTurn()
          }
          break
        case DirectionEnum.RIGHT:
          distance = this.canPlayerMove(
            this,
            this.tileMap,
            this.player,
            this.player.tilePos.x + commandCounter,
            this.player.tilePos.y,
            DirectionEnum.RIGHT
          )
          if (distance != 0) {
            this.socketInstance.movePlayer(this.player.tilePos.x + distance, this.player.tilePos.y)
            this.player.move(DirectionEnum.RIGHT, distance)
            if (this.player.isBleeding) {
              this.socketInstance.damagePlayer(distance, this.player.id)
            }
            this.socketInstance.endTurn()
          }
          break
        default:
          console.log('Somethings wrong...')
          break
      }
    }
  }

  canPlayerMove(
    scene: MainScene,
    tileMap: Phaser.Tilemaps.Tilemap,
    player: Player,
    toX: number,
    toY: number,
    direction: DirectionEnum
  ) {
    let distance = 0
    switch (direction) {
      case DirectionEnum.UP:
        distance = player.tilePos.y - toY
        var travelingY = player.tilePos.y
        for (let i = 0; i < distance; i++) {
          travelingY--
          let tile = tileMap.getTileAt(toX, travelingY)
          if (!scene.tileMoveCheck(scene, tile)) return i
        }
        return distance
      case DirectionEnum.DOWN:
        distance = toY - player.tilePos.y
        var travelingY = player.tilePos.y
        for (let i = 0; i < distance; i++) {
          travelingY++
          let tile = tileMap.getTileAt(toX, travelingY)
          if (!scene.tileMoveCheck(scene, tile)) return i
        }
        return distance
      case DirectionEnum.LEFT:
        distance = player.tilePos.x - toX
        var travelingX = player.tilePos.x
        for (let i = 0; i < distance; i++) {
          travelingX--
          let tile = tileMap.getTileAt(travelingX, toY)
          if (!scene.tileMoveCheck(scene, tile)) return i
        }
        return distance
      case DirectionEnum.RIGHT:
        distance = toX - player.tilePos.x
        var travelingX = player.tilePos.x
        for (let i = 0; i < distance; i++) {
          travelingX++
          let tile = tileMap.getTileAt(travelingX, toY)
          if (!scene.tileMoveCheck(scene, tile)) return i
        }
        return distance
      default:
        console.log('Somethings wrong...')
        return distance
    }
  }

  private tileMoveCheck(scene: MainScene, toTile: Phaser.Tilemaps.Tile) {
    //Check if collides with player
    var result = true
    scene.playerList.forEach(playerElem => {
      if (playerElem.id != scene.player.id) {
        var playerTile = scene.tileMap.getTileAt(playerElem.tilePos.x, playerElem.tilePos.y)
        if (playerTile.x == toTile.x && playerTile.y == toTile.y) result = false
      }
    })
    if (!result) return result

    //Check if collides with tile types
    switch (toTile.index) {
      case TileTypeEnum.WALL:
        return false
      case TileTypeEnum.WALL_CITY:
        return false
      case TileTypeEnum.WALL_HELL:
        return false
      case TileTypeEnum.WALL_JUNGLE:
        return false
      default:
        return true
    }
  }
  handleDamage(targetId: string) {
    if (this.playersTurnId == this.player.id && !this.player.isDead()) {
      console.log("player shoot", this.player)
      var damage = this.player.selectedGun.shoot(this.findDistanceToPlayer(targetId))
      this.socketInstance.damagePlayer(damage, targetId)
      this.socketInstance.endTurn()
    }
  }
  private findDistanceToPlayer(targetId: string): number {
    var target = this.findPlayerById(targetId)
    if (target == null) return -1
    
    //Euclidean distance
    return this.mathAdapter.calculateEuclidean(this.player.tilePos, target.tilePos) // <- Distance
  }
}


