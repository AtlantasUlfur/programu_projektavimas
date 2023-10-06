export class HealthBar {
    private bar : Phaser.GameObjects.Graphics
    private x : integer
    private y : integer
    private healthValue : integer
    private p :  number

    constructor (scene, x, y)
    {
        this.bar = new Phaser.GameObjects.Graphics(scene);

        this.x = x;
        this.y = y;
        this.healthValue = 100;
        this.p = 76 / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease (amount)
    {
        this.healthValue -= amount;

        if (this.healthValue < 0)
        {
            this.healthValue = 0;
        }

        this.draw();

        return (this.healthValue === 0);
    }

    draw ()
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, 80, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(this.x + 2, this.y + 2, 76, 12);

        this.bar.setDepth(11)

        if (this.healthValue < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.healthValue);

        this.bar.fillRect(this.x + 2, this.y + 2, d, 12);
    }

    drawByPos (pos_x : number, pos_y : number)
    {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(pos_x, pos_y, 80, 16);

        //  Health

        this.bar.fillStyle(0xffffff);
        this.bar.fillRect(pos_x + 2, pos_y + 2, 76, 12);

        this.bar.setDepth(11)

        if (this.healthValue < 30)
        {
            this.bar.fillStyle(0xff0000);
        }
        else
        {
            this.bar.fillStyle(0x00ff00);
        }

        var d = Math.floor(this.p * this.healthValue);

        this.bar.fillRect(pos_x + 2, pos_y + 2, d, 12);
    }

    setAlpha(value : number)
    {
        this.bar.setAlpha(value);
    }

}