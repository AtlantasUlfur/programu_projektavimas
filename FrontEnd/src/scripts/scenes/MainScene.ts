import * as Phaser from 'phaser';
import SocketController from "../SocketController";
import { TileTypeEnum } from '../Models/Enums';
type Entity = {
    id: String;
    x?: Number;
    y?: Number;
  };
  
type Tile = {
    entity?: Entity;
    x: Number;
    y: Number;
  };


export default class MainScene extends Phaser.Scene{
    private tileMap: Phaser.Tilemaps.Tilemap;
    public playerCount : number;
    private mapData;
    constructor(){
        super("MainScene");
    }

    init(map : Tile[]){
        //Fill map data
        this.mapData = [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

        map.forEach(tile => {
            switch (tile.entity?.id) {
                case 'wall':
                    this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.WALL;
                    break;
                case 'player':
                    this.mapData[tile.y as integer][tile.x as integer] = TileTypeEnum.PLAYER;
                    break;
                default:
                    break;
            }

        })
    }

    preload(){
        this.load.spritesheet("player", "../../assets/characters.png", {
            frameWidth: 26,
            frameHeight: 36,
        });

        this.load.image("tiles", "../../assets/cloud_tileset.png");
        
    }

    create(){
        this.tileMap = this.make.tilemap({data: this.mapData, tileWidth: 16, tileHeight: 16})
        const tiles = this.tileMap.addTilesetImage('tiles');
        this.tileMap.createLayer(0, tiles, 0, 0);
    }

    update(){}
}