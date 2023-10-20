import * as Phaser from 'phaser'
import SocketController from '../SocketController'
import { TileTypeEnum, SizeEnum, DirectionEnum } from '../Models/Enums'
import { PlayerServer } from '../Models/ServerModels'
import { Player } from '../Models/Player'
import PlayerBuilder from '../utils/PlayerBuilder'
import { sceneEvents } from '../Events/EventsController'

export default class MainScene extends Phaser.Scene{
    //Utils
    private socketInstance : SocketController;
    //Init Data
    private mapData;
    private currentPlayerData : PlayerServer;
    private allPlayerData : PlayerServer[];
    //Map
    private tileMap: Phaser.Tilemaps.Tilemap;
    //Players
    private playerList : Player[] = [];
    private player : Player;
    public playersTurnId :string = "";

    constructor(){
        super("MainScene");
    }

    init(data)
    {
        this.currentPlayerData = data.player;
        this.allPlayerData = data.sessionPlayers;
        this.playersTurnId = data.playersTurnId;
        this.socketInstance = SocketController.getInstance();
        this.socketInstance.setScene(this);

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

    preload() 
    {
        //Load textures
        this.load.spritesheet('player', '../../assets/characters.png', {
        frameWidth: 26,
        frameHeight: 36,
        })
        this.load.image('tiles', '../../assets/cloud_tileset.png')
        this.load.image('background', '../../assets/cloud_backround.png')
    }

  

    create()
    {
        const scene = this;
        this.socketInstance = SocketController.getInstance()   

        //Map Render
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, 'background').setDepth(0)
        this.tileMap = this.make.tilemap({ data: this.mapData, tileWidth: 16, tileHeight: 16 })
        const tiles = this.tileMap.addTilesetImage('tile-set', 'tiles')
        const layer = this.tileMap.createLayer(0, tiles, 0, 0)
        const builder = new PlayerBuilder(scene)
        //Create all players
        this.allPlayerData = this.allPlayerData.sort((a, b) => {
            return a.socketId.localeCompare(b.socketId);
        });
        const texture_frames = [49, 52, 55, 10];
        this.allPlayerData.forEach((playerData, index) => {
        
    
        console.log(playerData)
        
        if (playerData.x == scene.currentPlayerData.x && playerData.y == scene.currentPlayerData.y) {
            //Create current player
            this.player = builder
            .setPosition(new Phaser.Math.Vector2(playerData.x, playerData.y))
            .setKey('player') // key of spritesheet
            .setFrame(texture_frames[index]) // frame in spritesheet
            .setName('YOU')
            .setHP(playerData.currentHP)
            .setSocketId(playerData.socketId)
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
            .setName('ENEMY')
            .setHP(playerData.currentHP)
            .setSocketId(playerData.socketId)
            .build()
            scene.playerList.push(otherPlayer)
        }
        })
        this.scene.run('UIScene', this.player)
    }

    update(time: number, delta: number) {

        if(this.playersTurnId == this.player.id && time > 10000)
        {
            // //Handle player turn
            // //DEBUGGING WALKING
            // switch (prompt("nigga")) {
            //     case "w":
            //         if(this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x, this.player.tilePos.y-1))
            //             this.player.move(DirectionEnum.UP, 1);

            //         break;
            //     case "a":
            //         if(this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x-1, this.player.tilePos.y))
            //             this.player.move(DirectionEnum.LEFT, 1);
            //         break;
            //     case "s":
            //         if(this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x, this.player.tilePos.y+1))
            //             this.player.move(DirectionEnum.DOWN, 1);
            //         break;
            //     case "d":
            //         if(this.canPlayerMove(this, this.tileMap, this.player, this.player.tilePos.x+1, this.player.tilePos.y))
            //             this.player.move(DirectionEnum.RIGHT, 1);
            //         break;
            //     default:
            //         break;
            // }
            // this.socketInstance.endTurn();
        }
        this.player.update(time, delta)
    }

    canPlayerMove(scene : MainScene, tileMap : Phaser.Tilemaps.Tilemap, player : Player, toX : number, toY : number){
        var toTile = tileMap.getTileAt(toX, toY);
        //Check if collides with player
        var result = true;
        scene.playerList.forEach(playerElem =>{
            if(playerElem.id != player.id){
                var playerTile = tileMap.getTileAt(playerElem.tilePos.x, playerElem.tilePos.y);
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
}
