import * as Phaser from "phaser";
import { Player } from "../Player";
import { GridControls } from "../GridControls";
import { GridPhysics } from "../GridPhysics";
import { Connection } from "../Connection";
import { Socket } from 'socket.io-client';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: "Game",
  };

export class GameScene extends Phaser.Scene {
    private gridControls: GridControls;
    private gridPhysics: GridPhysics;
    private socketInstance: Connection | null;
    private socket: Socket | null;
    private tileMap: Phaser.Tilemaps.Tilemap;
    private otherPlayers = [];
    private player: Player;
    public initData;
    constructor() {
      super(sceneConfig);
    }
  
    static readonly TILE_SIZE = 48;
    public init(data){
      this.initData = data;
  
      // this.createPlayerAnimation(Direction.UP, 90, 92);
      // this.createPlayerAnimation(Direction.RIGHT, 78, 80);
      // this.createPlayerAnimation(Direction.DOWN, 54, 56);
      // this.createPlayerAnimation(Direction.LEFT, 66, 68);
    }
    public create() {
      const self = this;
      this.socketInstance = Connection.getInstance();
      this.socketInstance.connect("http://localhost:8081")

      this.tileMap = this.make.tilemap({ key: "cloud-city-map" });
      this.tileMap.addTilesetImage("Cloud City", "tiles");
      for (let i = 0; i < this.tileMap.layers.length; i++) {
        const layer = self.tileMap.createLayer(i, "Cloud City", 0, 0);
        layer.setDepth(i);
        layer.scale = 3;
      }
  
      this.socket = this.socketInstance.getSocket();
        console.log(this.initData)
        //Initialise players
        var playerId = this.initData['player_id'];
        this.socket.emit("getPlayerPos", {playerId}, (response) =>{
          var x = response['playerPos'].x
          var y = response['playerPos'].y
          this.addPlayer(self, {playerId, x, y}, self.tileMap);
          
        });

        for(let i = 0; i < this.initData['player_ids'].length; i++){
          playerId = this.initData['player_ids'][i];
          this.socket.emit("getPlayerPos", {playerId}, (response) =>{
            var x = response['playerPos'].x
            var y = response['playerPos'].y
            this.addOtherPlayers(self, {playerId, x, y});
          });
        }
      this.socket.on("currentPlayers", function (players) {
        const socketId = this.id;
        Object.keys(players).forEach(function (id) {
          if (id == socketId) {
            console.log("3");
            self.addPlayer(self, players[id], self.tileMap);
          } else {
            console.log("4");
            self.addOtherPlayers(self, players[id]);
          }
        });
      });

      this.socket.on("newPlayer", function (playerInfo) {
        self.addOtherPlayers(self, playerInfo);
      });

      this.socket.on("disconnect", function (playerId) {
        console.log("disc");
        self.otherPlayers.forEach(function (otherPlayer) {
          if (playerId === otherPlayer.playerId) {
            otherPlayer.destroy();
          }
        });
      });
  
      this.socket.on("move", function (message) {
        console.log(message);
        self.otherPlayers[message.playerId]?.setTilePos(
          new Phaser.Math.Vector2(message.x, message.y)
        );
        self.otherPlayers[message.playerId]?.health.drawByPos(self.otherPlayers[message.playerId]?.getTilePos().x * GameScene.TILE_SIZE - 11, self.otherPlayers[message.playerId]?.getTilePos().y * GameScene.TILE_SIZE - 100)
        console.log(self.otherPlayers);
      });
  
      this.socket.on("updateHealth", function (message) {
        console.log(message);
        Object.keys(message.players).forEach(function (player) {
        if(self.player.Id == player){
            self.player.health.setHealth(message.players[player].health);
          }
          else{
            self.otherPlayers[player].health.setHealth(message.players[player].health);
          }
        });
      });
      this.gridPhysics = new GridPhysics(this.player, this.tileMap, this.socket);
      this.gridControls = new GridControls(this.input, this.gridPhysics);
    }
  
    public update(_time: number, delta: number) {
      if(this.gridControls.update(_time))
      {
        this.player.health.drawByPos(this.player.getTilePos().x * GameScene.TILE_SIZE - 11, this.player.getTilePos().y * GameScene.TILE_SIZE - 100);
      }
      this.updateGrid();
    }
  
    public preload() {
      this.load.image("tiles", "../../assets/cloud_tileset.png");
      this.load.tilemapTiledJSON("cloud-city-map", "../../assets/cloud_city.json");
      this.load.spritesheet("player", "../../assets/characters.png", {
        frameWidth: 26,
        frameHeight: 36,
      });
    }
  
    updateGrid() {
      const self = this;
      if (this.player) {
        const self = this;
        var pos_x = this.player.getPosition().x;
        var pos_y = this.player.getPosition().y;
        var origin = self.tileMap.getTileAtWorldXY(pos_x, pos_y, true);
        //console.log(origin)
        self.tileMap.forEachTile((tile) => {
          const dist_full = Phaser.Math.Distance.Snake(
            origin.x,
            origin.y,
            tile.x,
            tile.y
          );
          tile.setAlpha(1 - 0.16 * dist_full);
        });
        Object.keys(this.otherPlayers).forEach(function (otherPlayer) {
          var other_x = self.otherPlayers[otherPlayer].getPosition().x;
          var other_y = self.otherPlayers[otherPlayer].getPosition().y;
          var origin_other = self.tileMap.getTileAtWorldXY(
            other_x,
            other_y,
            true
          );
          const dist_other = Phaser.Math.Distance.Snake(
            origin.x,
            origin.y,
            origin_other.x,
            origin_other.y
          );
          self.otherPlayers[otherPlayer].setPlayerVisible(1 - 0.13 * dist_other);
        });
      }
    }
  
    changePlayerHealth(self, playerId, value){
      if(self.player.Id == playerId){
        self.player.health.setHealth(value);
      }
      else{
        self.otherPlayers[playerId].health.setHealth(value);
      }  
      this.socket.emit("healthChange", {targetId: playerId, healthUpdate: value})
    }
  
    addPlayer(self, playerInfo, cloudCityTilemap) {
      const playerSprite = self.add.sprite(0, 0, "player");
      playerSprite.setDepth(2);
      playerSprite.scale = 3;
      this.cameras.main.startFollow(playerSprite);
      this.cameras.main.roundPixels = true;
  
      console.log(playerInfo);
  
      this.player = new Player(
        playerInfo.playerId,
        playerSprite,
        new Phaser.Math.Vector2(playerInfo.x, playerInfo.y),
        self
      );
      this.player.setPlayerName("YOU");
  
      this.gridPhysics = new GridPhysics(
        this.player,
        cloudCityTilemap,
        this.socket
      );
      this.gridControls = new GridControls(this.input, this.gridPhysics);
  
      var selfEventInit = false;
      this.player.sprite.on("pointerdown", function (pointer) {
        let element = document.getElementById("input-box");
        if (element && element.style.display === "none") {
          element.style.display = "block";
          if(!selfEventInit)
          {
            for (let i = 0; i < element.children.length; i++) {
              if (element.children[i].tagName === "INPUT") {
                element.children[i].addEventListener("input", () => {});
              } else {
                let element_next = document.getElementById("input-box2");
                element_next.style.display = "none";
                element.children[i].addEventListener("click", () => {
                  if(element.children[i].textContent == "Action #1")
                    self.changePlayerHealth(self, self.player.Id, self.player.health.increase(10))
                  if(element.children[i].textContent == "Action #2")
                    self.changePlayerHealth(self, self.player.Id, self.player.health.increase(20))
                  element.style.display = "none";
                });
              }
            }
            selfEventInit = true; 
          }
        }
      });
    this.player.sprite.on("pointerup", function (pointer) {
      this.clearTint();
    });
    }
  
    addOtherPlayers(self, playerInfo) {
      const enemySprite = self.add.sprite(1, 1, "player");
      enemySprite.setDepth(2);
      enemySprite.scale = 3;
  
      this.otherPlayers[playerInfo.playerId] = new Player(
        playerInfo.playerId,
        enemySprite,
        new Phaser.Math.Vector2(playerInfo.x, playerInfo.y),
        self
      );
  
      var eventInit = false;
      this.otherPlayers[playerInfo.playerId]
        .sprite.on("pointerdown", function (pointer) {
          let element = document.getElementById("input-box2");
          if (element && element.style.display === "none") {
            element.style.display = "block";
            if(!eventInit)
            {
              for (let i = 0; i < element.children.length; i++) {
                if (element.children[i].tagName === "INPUT") {
                  element.children[i].addEventListener("input", () => {});
                } else {
                  let element_next = document.getElementById("input-box2");
                  element_next.style.display = "none";
                  element.children[i].addEventListener("click", () => {
                    if(element.children[i].textContent == "Attack #1")
                      self.changePlayerHealth(self, playerInfo.playerId, self.otherPlayers[playerInfo.playerId].health.decrease(10))
                    if(element.children[i].textContent == "Attack #2")
                      self.changePlayerHealth(self, playerInfo.playerId, self.otherPlayers[playerInfo.playerId].health.decrease(20))
                    element.style.display = "none";
                  });
                }
              }
              eventInit = true; 
            }
          }
      });
      this.otherPlayers[playerInfo.playerId]
        .sprite.on("pointerup", function (pointer) {
          this.clearTint();
        });
    }
  }