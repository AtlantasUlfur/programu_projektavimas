import * as Phaser from 'phaser'
import SocketController from '../SocketController'
import { TileTypeEnum, SizeEnum, DirectionEnum } from '../Models/Enums'
import { PlayerServer } from '../Models/ServerModels'
import { Player } from '../Models/Player'
import PlayerBuilder from '../utils/PlayerBuilder'
import { sceneEvents } from '../Events/EventsController'

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
  public playerList: Player[] = []
  public alivePlayerCount : number = 0;
  public player: Player
  public playersTurnId: string = ''

  constructor() {
    super('MainScene')
  }

  init(data) {
    this.currentPlayerData = data.player
    this.allPlayerData = data.sessionPlayers
    this.alivePlayerCount = this.allPlayerData.length;
    this.playersTurnId = data.playersTurnId
    this.socketInstance = SocketController.getInstance()
    this.socketInstance.setScene(this)

    //Fill map data disgusting
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
      frameHeight: 36
    })
    this.load.spritesheet('dead', '../../assets/cloud_tileset.png',{
      frameWidth: 16,
      frameHeight: 16
    });
    this.load.image('tiles', '../../assets/cloud_tileset.png')
    this.load.image('background', '../../assets/cloud_backround.png')
    this.load.spritesheet('guns', '../../assets/guns.png', { frameWidth: 160, frameHeight: 160 });
  }

  create() {
    const scene = this
    this.socketInstance = SocketController.getInstance()
    
    //const gunImage = this.add.image(200, 200, 'guns', 0).setDepth(100).setScale(0.25).setOrigin(0)

    //Map Render
    this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'background').setDepth(0)
    this.tileMap = this.make.tilemap({ data: this.mapData, tileWidth: 16, tileHeight: 16 })
    const tiles = this.tileMap.addTilesetImage('tile-set', 'tiles')
    const layer = this.tileMap.createLayer(0, tiles, 0, 0)
    const builder = new PlayerBuilder(scene)
    //Create all players
    this.allPlayerData = this.allPlayerData.sort((a, b) => {
      return a.socketId.localeCompare(b.socketId)
    })
    const texture_frames = [49, 52, 55, 10]
    this.allPlayerData.forEach((playerData, index) => {
      console.log(playerData) 

      if (playerData.x == scene.currentPlayerData.x && playerData.y == scene.currentPlayerData.y) {
        //Create current player
        this.player = builder
          .setPosition(new Phaser.Math.Vector2(playerData.x, playerData.y))
          .setKey('player') // key of spritesheet
          .setFrame(texture_frames[index]) // frame in spritesheet
          .setName(playerData.name)
          .setHP(playerData.currentHP)
          .setSocketId(playerData.socketId)
          .setColor('#008000')
          .build()
        scene.playerList.push(this.player)

        //Camera follow this player
        this.cameras.main.startFollow(this.player)
        this.cameras.main.roundPixels = true
        this.cameras.main.zoom = 2
      } else {
        //Create other player
        let otherPlayer = builder
          .setPosition(new Phaser.Math.Vector2(playerData.x, playerData.y))
          .setKey('player') // key of spritesheet
          .setFrame(texture_frames[index]) // frame in spritesheet
          .setName(playerData.name)
          .setHP(playerData.currentHP)
          .setSocketId(playerData.socketId)
          .setColor('red')
          .build()
        scene.playerList.push(otherPlayer)
      }
    })

    //Handle player events
    sceneEvents.on('movement', payload => {
      this.handleMovement(payload)
    })
    sceneEvents.on('damage', payload => {
      this.handleDamage(payload)
    })

    //Run UI Scenes
    this.scene.run('UIScene', { playerObj: this.player, players: this.playerList, playersTurnId: this.playersTurnId })
    this.scene.run('GameOver');
  }

  update(time: number, delta: number) {

    if (this.player.attackPower == 0) {
      this.socketInstance.getAttackAmount()
    }
    if(this.alivePlayerCount == 1) {
      sceneEvents.emit("gameOver", {victory: true});
    }
    this.player.update(time, delta)
  }

  handleMovement(direction: DirectionEnum)
  {
      if(this.playersTurnId == this.player.id && !this.player.isDead())
      {
          var distance = 0;
          switch (direction) {
              case DirectionEnum.UP:
                  distance = this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x, this.player.tilePos.y-5, DirectionEnum.UP);
                  if(distance != 0){
                      this.socketInstance.movePlayer(this.player.tilePos.x, this.player.tilePos.y-distance);
                      this.player.move(DirectionEnum.UP, distance);
                      this.socketInstance.endTurn();
                  }
                break;
              case DirectionEnum.DOWN:
                  distance = this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x, this.player.tilePos.y+5, DirectionEnum.DOWN)
                  if(distance != 0){
                      this.socketInstance.movePlayer(this.player.tilePos.x, this.player.tilePos.y+distance);
                      this.player.move(DirectionEnum.DOWN, distance);
                      this.socketInstance.endTurn();
                  }
                break;
              case DirectionEnum.LEFT:
                  distance = this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x-5, this.player.tilePos.y, DirectionEnum.LEFT)
                  if(distance != 0){
                      this.socketInstance.movePlayer(this.player.tilePos.x-distance, this.player.tilePos.y);
                      this.player.move(DirectionEnum.LEFT, distance);
                      this.socketInstance.endTurn();
                  }
                break;
              case DirectionEnum.RIGHT:
                  distance = this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x+5, this.player.tilePos.y, DirectionEnum.RIGHT)
                  if(distance != 0){
                      this.socketInstance.movePlayer(this.player.tilePos.x+distance, this.player.tilePos.y);
                      this.player.move(DirectionEnum.RIGHT,  distance);
                      this.socketInstance.endTurn();
                  }
                break;
              default:
                console.log("Somethings wrong...")
                break;
          }
      }
  }

  canPlayerMove(scene : MainScene, tileMap : Phaser.Tilemaps.Tilemap, player : Player, toX : number, toY : number, direction : DirectionEnum){
    let distance = 0;
        switch (direction) {
        case DirectionEnum.UP:
            distance = player.tilePos.y - toY;
            var travelingY = player.tilePos.y;
            for (let i = 0; i < distance; i++) {
                travelingY--;
                let tile = tileMap.getTileAt(toX, travelingY);
                if(!scene.tileMoveCheck(scene, tile))
                    return i;
            }
            return distance;
        case DirectionEnum.DOWN:
            distance = toY - player.tilePos.y;
            var travelingY = player.tilePos.y;
            for (let i = 0; i < distance; i++) {
                travelingY++;
                let tile = tileMap.getTileAt(toX, travelingY);
                if(!scene.tileMoveCheck(scene, tile))
                    return i;
            }
            return distance;
        case DirectionEnum.LEFT:
            distance = player.tilePos.x - toX;
            var travelingX = player.tilePos.x;
            for (let i = 0; i < distance; i++) {
                travelingX--;
                let tile = tileMap.getTileAt(travelingX, toY);
                if(!scene.tileMoveCheck(scene, tile))
                    return i;
            }
            return distance;
        case DirectionEnum.RIGHT:
            distance = toX - player.tilePos.x;
            var travelingX = player.tilePos.x;
            for (let i = 0; i < distance; i++) {
                travelingX++;
                let tile = tileMap.getTileAt(travelingX, toY);
                if(!scene.tileMoveCheck(scene, tile))
                    return i;
            }
            return distance;
        default:
            console.log("Somethings wrong...")
            return distance;
    }
  }

    private tileMoveCheck(scene : MainScene, toTile : Phaser.Tilemaps.Tile){
        //Check if collides with player
        var result = true;
        scene.playerList.forEach(playerElem =>{
            if(playerElem.id != scene.player.id){
                var playerTile = scene.tileMap.getTileAt(playerElem.tilePos.x, playerElem.tilePos.y);
                if(playerTile.x == toTile.x && playerTile.y == toTile.y)
                    result = false;
            }
        });
        if(!result)
            return result;

        //Check if collides with tile types
        switch (toTile.index) {
            case TileTypeEnum.WALL:
                return false;
            default:
                return true;
        }

    }
    handleDamage(targetId: string) {
        if (this.playersTurnId == this.player.id && !this.player.isDead()) {
          this.socketInstance.damagePlayer(this.player.attackPower, targetId)
          this.socketInstance.endTurn()
          //TODO: DISTANCE CHECK
        }
      }
}
