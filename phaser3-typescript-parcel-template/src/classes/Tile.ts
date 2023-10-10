export default class Tile{
    public x: number;
    public y: number;
    public image: Phaser.GameObjects.Image;
    public walkable: boolean = true;

    constructor(x: number, y:number, image: Phaser.GameObjects.Image, walkable: boolean = true)
	{
        this.x = x;
        this.y = y;
        this.image = image;
        this.walkable = walkable;
	}

}