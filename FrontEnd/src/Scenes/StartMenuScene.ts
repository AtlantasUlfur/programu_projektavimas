import * as Phaser from "phaser";
import { GameScene } from "./GameScene";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../main"

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: "StartMenu",
  };

export class StartMenuScene extends Phaser.Scene {
    private tileMap: Phaser.Tilemaps.Tilemap;
    private playersInQueue: number = 1;

    constructor() {
        super(sceneConfig);
      }
    
    public preload(){
        const self = this;
  
        self.tileMap = this.make.tilemap({ key: "cloud-city-map" });
        self.tileMap.addTilesetImage("Cloud City", "tiles");

        self.load.image("play_button", "../../assets/play_button.png")
        

    }
    public create() {
        let text = this.add.text(
            CANVAS_WIDTH/2 - 65,
            20,
            `Players in Queue: ${this.playersInQueue} / 4`,
            { font: '"Arial"',fontSize: "45", color: "white"}
        );
        
        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "play_button").setDepth(1)
        playButton.setInteractive();

        playButton.on("pointerdown", () => {
            this.scene.start("Game", {"player_ids" : [1,2,3,4]})
        });
        //
    }
}