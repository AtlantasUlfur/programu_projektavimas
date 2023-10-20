import * as Phaser from 'phaser'
import SocketController from '../SocketController'
import { TileTypeEnum, SizeEnum, DirectionEnum } from '../Models/Enums'
import { PlayerServer } from '../Models/ServerModels'
import { Player } from '../Models/Player'
import PlayerBuilder from '../utils/PlayerBuilder'


export default class MainScene extends Phaser.Scene {
  //Utils
  private socketInstance: SocketController
  //Init Data
  private mapData
  private currentPlayerData: PlayerServer
  private allPlayerData: PlayerServer[]
  //Map
  private tileMap: Phaser.Tilemaps.Tilemap
  //Players
  private playerList: Player[] = []
  private player: Player
  public playersTurnId: string = ''
  private lastUpdate: number = 0

  constructor() {
    super('MainScene')
  }

  init(data) {
    this.currentPlayerData = data.player
    this.allPlayerData = data.sessionPlayers
    this.playersTurnId = data.playersTurnId
    this.socketInstance = SocketController.getInstance()
    this.socketInstance.setScene(this)

    //Fill map data disgusting
    this.mapData = [
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373],
      [373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373, 373]
    ]

    data.map.tileMap.forEach(tile => {
      switch (tile.entity?.id) {
        case 'wall':
          this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.WALL
          break
        // case 'player':
        //     this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.PLAYER;
        //     break;
        default:
          break
      }
    })
  }

  preload() {
    //Load textures
    this.load.spritesheet('player', '../../assets/characters.png', {
      frameWidth: 26,
      frameHeight: 36,
    })
    this.load.image('tiles', '../../assets/cloud_tileset.png')
    this.load.image('background', '../../assets/cloud_backround.png')
  }

    create(){
        const scene = this;
        this.socketInstance = SocketController.getInstance()



    //Map Render
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'background').setDepth(0)
    this.tileMap = this.make.tilemap({ data: this.mapData, tileWidth: 16, tileHeight: 16 })
    const tiles = this.tileMap.addTilesetImage('tile-set', 'tiles')
    const layer = this.tileMap.createLayer(0, tiles, 0, 0)
    const builder = new PlayerBuilder(scene)
    //Create all players
    this.allPlayerData.forEach(playerData => {
      let spawnPoint = this.tileMap.getTileAt(Number(playerData.x), Number(playerData.y))
      if (playerData.x == scene.currentPlayerData.x && playerData.y == scene.currentPlayerData.y) {
        //Create current player
        this.player = builder
          .setPosition(spawnPoint.x * SizeEnum.TILE_SIZE, spawnPoint.y * SizeEnum.TILE_SIZE)
          .setKey('player') // key of spritesheet
          .setFrame(49) // frame in spritesheet
          .setName('YOU')
          .setHP(playerData.currentHP)
          .setSocketId(playerData.socketId)
          .build()
        scene.playerList.push(this.player)

        //Camera follow this player
        this.cameras.main.startFollow(this.player)
        this.cameras.main.roundPixels = true
        this.cameras.main.zoom = 1
      } else {
        //Create other player
        let otherPlayer = builder
          .setPosition(spawnPoint.x * SizeEnum.TILE_SIZE, spawnPoint.y * SizeEnum.TILE_SIZE)
          .setKey('player') // key of spritesheet
          .setFrame(46) // frame in spritesheet
          .setName('ENEMY')
          .setHP(playerData.currentHP)
          .setSocketId(playerData.socketId)
          .build()
        scene.playerList.push(otherPlayer)
      }
    })
    this.scene.run('UIScene', { playerObj: this.player, players: this.playerList })
  }

    update(time : number, delta : number)
    {
        this.player.update(time, delta)
       
        if(this.playersTurnId == this.player.id)
        {
            console.log("TURN ENDED");

            //Handle player turn
            this.socketInstance.endTurn()
        }
    }
}
