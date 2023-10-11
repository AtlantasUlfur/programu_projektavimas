import * as Phaser from "phaser";
import { GameScene } from "./GameScene";
import {CANVAS_HEIGHT, CANVAS_WIDTH} from "../main"
import { Socket } from 'socket.io-client';
import { Connection } from "../Connection";

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: true,
    visible: true,
    key: "StartMenu",
  };

export class StartMenuScene extends Phaser.Scene {
    private playersInQueue: number = 1;
    private text: Phaser.GameObjects.Text;
    private session_host: boolean = false;
    private session_id: number;
    private socketInstance: Connection | null;
    private socket: Socket | null;
    private otherPlayerIds: Array<string> = [];


    // text objects
    private wait_for_host_text: Phaser.GameObjects.Text;
    private wait_for_players_text: Phaser.GameObjects.Text;
    private start_game_text: Phaser.GameObjects.Text;


    constructor() {
        super(sceneConfig);
    }
    
    public preload(){
        const self = this;
        self.load.image("cloud_backround", "../../assets/cloud_backround.png")
        self.load.image("play_button", "../../assets/play_button.png")
    }
    public create() {
        let self = this;
        this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2, "cloud_backround").setDepth(0)
        this.text = this.add.text(
            CANVAS_WIDTH/2 - 120,
            20,
            `Players in Queue: ${this.playersInQueue} / 4`,
            { color: "black"}
        );
        
        this.start_game_text = this.add.text(
            CANVAS_WIDTH/2 - 120,
            100,
            `You can start the game`,
            { color: "black"}
        ).setVisible(false);
        
        this.wait_for_host_text = this.add.text(
            CANVAS_WIDTH/2 - 120,
            100,
            `Wait for host to start the game`,
            { color: "red"}
        ).setVisible(false);

        this.wait_for_players_text = this.add.text(
            CANVAS_WIDTH/2 - 120,
            100,
            `Wait for more players to join`,
            { color: "red"}
        ).setVisible(false);

        this.text = this.add.text(
            CANVAS_WIDTH/2 - 120,
            20,
            `Players in Queue: ${this.playersInQueue} / 4`,
            { color: "black"}
        );

        let playButton = this.add.image(this.game.renderer.width / 2, this.game.renderer.height / 2 + 100, "play_button").setDepth(1)
        playButton.setTintFill(1)
        playButton.setInteractive();
        
        playButton.on("pointerover", () => {
            if(self.playersInQueue > 1 && self.session_host){
                playButton.setAlpha(0.5);
            }
        });

        playButton.on("pointerout", () => {
            playButton.setAlpha(1)
        });

        playButton.on("pointerdown", () => {
            if(self.playersInQueue > 1 && self.session_host){
                this.scene.start("Game", {"player_id": self.socket.id, "player_ids" : self.otherPlayerIds})
            }
        });
        
        this.socketInstance = Connection.getInstance();
        this.socketInstance.connect("http://localhost:8081")
    
        this.socket = this.socketInstance.getSocket();
        
        this.socket.on("session_host", function (session_id){
            self.session_host = true;
            self.session_id = session_id;
            console.log(`host of session with id: ${session_id}`)
            self.wait_for_host_text.setVisible(false)
            if(self.playersInQueue > 1){
                self.wait_for_players_text.setVisible(false);
                self.start_game_text.setVisible(true);
              }
              else{
                self.wait_for_players_text.setVisible(true);
              }
        })

        this.socket.on("currentPlayers", function (players) {
          const socketId = this.id;
          for (let index = 0; index < players.length; index++) {
            const id = players[index];
            self.addPlayerToQueue(id)
          }

          if(self.playersInQueue > 1){
            if(self.session_host){
                self.start_game_text.setVisible(true);
            }else{
                self.wait_for_host_text.setVisible(true);
            }
          }
          else{
            self.wait_for_players_text.setVisible(true);
          }

        });

        this.socket.on("newPlayer", function (playerInfo) {
            console.log(`Player Info: ${playerInfo}`)
            self.addPlayerToQueue(playerInfo.playerId);
            if(self.playersInQueue > 1){
                if(self.session_host){
                    self.start_game_text.setVisible(true);
                }else{
                    self.wait_for_host_text.setVisible(true);
                }
              }
              self.wait_for_players_text.setVisible(false);
          });

        this.socket.on("disconnectPlayer", function (playerId) {
            console.log("disconnect_player")
            self.removePlayerFromQueue(playerId)
            if(self.playersInQueue === 1){
                self.start_game_text.setVisible(false);
                self.wait_for_host_text.setVisible(false);
                self.wait_for_players_text.setVisible(true);
              }
          });
    }
    public update(time: number, delta: number): void {
       
    }

    private addPlayerToQueue(id: string){
        this.playersInQueue += 1;
        // tekstas dubliuojasi galit pabandyti pataisyti
        this.text.text = `Players in Queue: ${this.playersInQueue} / 4`,
        this.otherPlayerIds.push(id)
    }
    
    private removePlayerFromQueue(id: string){
        this.playersInQueue -= 1;
        // tekstas dubliuojasi galit pabandyti pataisyti
        this.text.text = `Players in Queue: ${this.playersInQueue} / 4`,
        this.otherPlayerIds = this.otherPlayerIds.filter(_id => _id != id)
    }
}