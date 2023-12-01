import { Map } from '../../Models/Map';

interface MapBuilderInterface {
  setBackground(mapImage: string): void
  setTileMap(mapData: any, tileWidth: number, tileHeight: number): void
  setTileSet(tileSetName: string, tileSetKey: string): void
  build(): Map
}

export default class MapBuilder implements MapBuilderInterface {
  private map: Phaser.Tilemaps.Tilemap
  private scene: Phaser.Scene

  constructor(scene) {
    this.scene = scene
  }

  setBackground(mapImage: string): void {
    this.scene.add.image(this.scene.game.renderer.width / 2, this.scene.game.renderer.height / 2, mapImage).setDepth(0)
  }
  setTileMap(mapData: any, tileWidth: number, tileHeight: number): void {
    this.map = this.scene.make.tilemap({ data: mapData, tileWidth: tileWidth, tileHeight: tileHeight })
  }
  setTileSet(tileSetName: string, tileSetKey: string): void {
    const tiles = this.map.addTilesetImage(tileSetName, tileSetKey)
    this.map.createLayer(0, tiles, 0, 0)
  }

  build(): Map {
    //const result = this.map
    return new Map(this.map)
  }
}
