
export abstract class TileComponent extends Phaser.Tilemaps.Tile
{
    public isDestructable: boolean;

    constructor(isDestructable: boolean,
         layer: Phaser.Tilemaps.LayerData,
         index: number,
         x: number,
         y: number,
         width: number,
         height: number,
         baseWidth: number,
         baseHeight: number)
    {
        super(layer, index, x, y, width, height, baseWidth, baseHeight);
        this.isDestructable = isDestructable;
    }
    abstract tryDestroy() : TileComponent;
}