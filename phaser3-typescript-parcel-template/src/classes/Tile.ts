export default class Tile{
    public x: number;
    public y: number;
    public image: Phaser.GameObjects.Image;

    constructor(x: number, y:number, image: Phaser.GameObjects.Image)
	{
        this.x = x;
        this.y = y;
        this.image = image;
	}

}