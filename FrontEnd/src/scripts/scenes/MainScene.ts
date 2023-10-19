import * as Phaser from 'phaser';
import SocketController from "../SocketController";
import { TileTypeEnum, SizeEnum } from '../Models/Enums';
import { PlayerServer } from '../Models/ServerModels';
import { Player } from '../Models/Player';

export default class MainScene extends Phaser.Scene{
    private tileMap: Phaser.Tilemaps.Tilemap;
    public playerCount : number;
    private player : Player;
    private playerList : Player[] = [];
    private mapData;
    private currentPlayerData : PlayerServer;
    private allPlayerData : PlayerServer[];

    constructor(){
        super("MainScene");
    }

    init(data){
        this.currentPlayerData = data.player;
        this.allPlayerData = data.sessionPlayers;

        //Fill map data disgusting
        this.mapData = [
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND],
        [TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND,TileTypeEnum.GROUND]];

        data.map.tileMap.forEach(tile => {
            switch (tile.entity?.id) {
                case 'wall':
                    this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.WALL;
                    break;
                // case 'player':
                //     this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.PLAYER;
                //     break;
                default:
                    break;
            }
        })
    }

    preload(){
        //Load textures
        this.load.spritesheet("player", "../../assets/characters.png", {
            frameWidth: 26,
            frameHeight: 36,
        });

        this.load.image("tiles", "../../assets/cloud_tileset.png");
        this.load.image("background", "../../assets/cloud_backround.png");
        
    }

    create(){
        const scene = this;

        //Map Render
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "background").setDepth(0)
        this.tileMap = this.make.tilemap({data: this.mapData, tileWidth: 16, tileHeight: 16})
        const tiles = this.tileMap.addTilesetImage('tile-set', "tiles");
        const layer = this.tileMap.createLayer(0, tiles, 0, 0);

        //Create all players
        this.allPlayerData.forEach(playerData => {
            let spawnPoint = this.tileMap.getTileAt(Number(playerData.x), Number(playerData.y));
            if(playerData.x == scene.currentPlayerData.x && playerData.y == scene.currentPlayerData.y)
            {
                //Create current player
                this.player = new Player(scene, spawnPoint.x * SizeEnum.TILE_SIZE, spawnPoint.y * SizeEnum.TILE_SIZE, 'player', 'YOU')
                scene.playerList.push(this.player);

                //Camera follow this player
                this.cameras.main.startFollow(this.player);
                this.cameras.main.roundPixels = true;
                this.cameras.main.zoom = 1;
            }
            else
            {
                //Create other player   
                let otherPlayer = new Player(scene, spawnPoint.x * SizeEnum.TILE_SIZE, spawnPoint.y * SizeEnum.TILE_SIZE, 'player', 'ENEMY')
                scene.playerList.push(otherPlayer);
            }

        });
    }

    update(time : number, delta : number)
    {
        this.player.update(time, delta)
    }
}