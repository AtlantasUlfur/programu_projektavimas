import * as Phaser from 'phaser';
import SocketController from "../SocketController";
import { TileTypeEnum, SizeEnum } from '../Models/Enums';
import { PlayerServer } from '../Models/ServerModels';
import { Player } from '../Models/Player';

export default class MainScene extends Phaser.Scene{
    private tileMap: Phaser.Tilemaps.Tilemap;
    public playerCount : number;
    private player : Player;
    private mapData;
    private currentPlayerData : PlayerServer;

    constructor(){
        super("MainScene");
    }

    init(data){
        this.currentPlayerData = data.player;

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
        //Map Render
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "background").setDepth(0)
        this.tileMap = this.make.tilemap({data: this.mapData, tileWidth: 16, tileHeight: 16})
        const tiles = this.tileMap.addTilesetImage('tile-set', "tiles");
        const layer = this.tileMap.createLayer(0, tiles, 0, 0);

        var tile = this.tileMap.getTileAt(Number(this.currentPlayerData.x), Number(this.currentPlayerData.y));
        //Player create
        this.player = new Player(this, tile.x * SizeEnum.TILE_SIZE, tile.y * SizeEnum.TILE_SIZE, 'player');

        //Camera follow player
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true;
        this.cameras.main.zoom = 2;

        //TODO: DRAW OTHER PLAYERS
    }

    update(time : number, delta : number)
    {
        this.player.update(time, delta)
    }
}