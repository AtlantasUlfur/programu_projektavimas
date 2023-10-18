import * as Phaser from 'phaser';

export default class MainScene extends Phaser.Scene{
    private tileMap: Phaser.Tilemaps.Tilemap;
    public playerCount : number;
    constructor(){
        super("MainScene");
    }

    preload(){
        this.load.spritesheet("player", "../../assets/characters.png", {
            frameWidth: 26,
            frameHeight: 36,
        });

        this.load.image("tiles", "../../assets/cloud_tileset.png");
        
    }

    create(){
        const scene = this;

        this.tileMap = this.make.tilemap({ key: "cloud-city-map" });
        this.tileMap.addTilesetImage("Cloud City", "tiles");
        for (let i = 0; i < this.tileMap.layers.length; i++) {
            const layer = scene.tileMap.createLayer(i, "Cloud City", 0, 0);
            layer.setDepth(i);
            layer.scale = 3;
        }

        
    }

    update(){}
}