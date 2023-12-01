import { TileComponent } from "./TileComponent";


export class CompositeTile extends TileComponent{
    constructor (
        layer: Phaser.Tilemaps.LayerData,
        index: number,
        x: number,
        y: number,
        width: number,
        height: number,
        baseWidth: number,
        baseHeight: number){
        super(true, layer, index, x, y, width, height, baseWidth, baseHeight)
    }

    private child: TileComponent
    public replaceChild(tileComponent: TileComponent)
    {
        this.child = tileComponent;
    }
    public getChild()
    {
        return this.child;
    }
    public tryDestroy() : TileComponent
    {
        if(this.child != null)
        {
            return this.child;
        }
        else{
            return this;
        }
    }
}