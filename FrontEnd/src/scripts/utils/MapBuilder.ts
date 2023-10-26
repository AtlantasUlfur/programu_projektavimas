import { IGrenadeLauncher } from '../Interfaces/Guns/IGrenadeLauncher'
import { IGun } from '../Interfaces/Guns/IGun'
import { IPistol } from '../Interfaces/Guns/IPistol'
import { IRifle } from '../Interfaces/Guns/IRifle'
import { SizeEnum } from '../Models/Enums'
import { Player } from '../Models/Player'

interface MapBuilderInterface {
  build(): Phaser.Tilemaps.Tilemap;
}

export default class MapBuilder implements MapBuilderInterface {
  private map : Phaser.Tilemaps.Tilemap;
  private scene : Phaser.Scene;


  constructor(scene) {
    this.scene = scene;
  }

  setBackground(mapImage: string): void {
    this.scene.add.image(this.scene.game.renderer.width / 2, this.scene.game.renderer.height / 2, mapImage).setDepth(0);
  }
  setTileMap(mapData : any, tileWidth: number, tileHeight : number): void {
    this.map = this.scene.make.tilemap({ data: mapData, tileWidth: tileWidth, tileHeight: tileHeight });
  }
  setTileSet(tileSetName: string, tileSetKey: string): void {
    const tiles = this.map.addTilesetImage(tileSetName, tileSetKey);
    this.map.createLayer(0, tiles, 0, 0);
  }

  build(): Phaser.Tilemaps.Tilemap {
    const result = this.map;
    return result;
  }
}
