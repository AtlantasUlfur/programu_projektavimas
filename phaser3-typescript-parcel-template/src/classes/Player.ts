export default class Player{
    public x: number;
    public y: number;
    public body: Phaser.Physics.Arcade.Body ;
    public id: string
    public target_x: number | undefined;
    public target_y: number | undefined;
    public HP: number = 100;

    constructor(x: number, y:number, body: Phaser.Physics.Arcade.Body, id:string)
	{
        this.x = x;
        this.y = y;
        this.body = body;
        this.id = id;
	}

}