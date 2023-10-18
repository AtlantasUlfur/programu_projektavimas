import { SizeEnum } from "./Enums";
export class Player extends Phaser.GameObjects.Sprite {
    private playerName : Phaser.GameObjects.Text;
    constructor(scene : Phaser.Scene, x : number, y : number, key : string){
        super(scene, 0, 0, key);
        
        //Add to scene
        this.scene.add.existing(this);

        //Self explanitory 
        this.setTexture("player");

        this.setDepth(0);

        this.setPosition(x, y);

        this.playerName = this.scene.add.text(0, 0, "YOU", {
            fontFamily: "Arial",
            fontSize: "16",
            fontStyle: "bold",
            color: "#008000",
        });
        this.playerName.setDepth(10);
        this.playerName.setOrigin(0.5, 1.5);
        this.playerName.setResolution(7);
    }

    update(time : number, delta : number){
        this.showPlayerNickname();
    }

    showPlayerNickname() {
        // this.playerName.x = this.x - (this.playerName.width / 2);
        // this.playerName.y = this.y - (this.height / 2);
        this.playerName.setPosition(this.x, this.y - SizeEnum.PLAYER_NAME_OFFSET)
    }
}