import { TileComponent } from "./TileComponent";

export class Tile extends TileComponent{
    constructor (
        layer: Phaser.Tilemaps.LayerData,
        index: number,
        x: number,
        y: number,
        width: number,
        height: number,
        baseWidth: number,
        baseHeight: number){
        super(false, layer, index, x, y, width, height, baseWidth, baseHeight)
    }
    public tryDestroy() : TileComponent
    {
        return this;
    }
}