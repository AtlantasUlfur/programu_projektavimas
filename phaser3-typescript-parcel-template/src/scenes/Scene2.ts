import * as Phaser from 'phaser'
import Tile from '../classes/Tile'
import Player from '../classes/Player'
import { IMessageEvent, w3cwebsocket as W3CWebSocket} from 'websocket'
import game from '../main'

var player, player2: Phaser.Physics.Arcade.Body;
var bullets;
var key;
const canvasHeigth = 672;
const canvasWidth = 768;
const tileSize = 48;
const tilesPerRow = Math.ceil((canvasWidth - tileSize / 2) / tileSize)
const rows = Math.ceil((canvasHeigth - tileSize / 2)/ tileSize)
var MainPlayer: Player;
var wsClient: W3CWebSocket | undefined = undefined



export default class TestScene extends Phaser.Scene
{
    private target;
    private players: Player[] = [];
    private last_bullet_shot;
    private tiles: Tile[] = [];
    constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.image('tile', 'images/tile.png')
        this.load.image('unwalkable_tile', 'images/unwalkable_tile.png')
        this.load.image('bullet', 'images/bullet.png')
        this.load.spritesheet('dude', 
            'images/dude.png',
            { frameWidth: 32, frameHeight: 48 }
        );
    }

    create(){
        key = this.input.keyboard.addKey("x")
        bullets = this.physics.add.group();
        this.tile_background('tile', 'unwalkable_tile');
        player = this.create_new_player(100, 450)

        this.target = new Phaser.Math.Vector2();

        const client = new W3CWebSocket('ws://127.0.0.1:8001');
        client.onopen = () => {
            console.log('Websocket Client Connected');
        };
        
        const this_ref = this;
        client.onmessage = (message: IMessageEvent) => {
            console.log('Received message from server: ' + String(message.data))
            const dataFromServer = JSON.parse(String(message.data));


            // register yourself (get your own ID)
            if (dataFromServer.hasOwnProperty("userID")){
                MainPlayer = new Player(player.x, player.y, player, dataFromServer["userID"])
                console.log(`have registered self with ID : ${dataFromServer["userID"]}`)
            }
            
            // register yourself (get your own ID)
            if (dataFromServer.hasOwnProperty("connectedPlayers")){
                var connectedPlayers = dataFromServer["connectedPlayers"];
                for (const key in connectedPlayers){


                    //console.log(body)
                    this_ref.players.push(new Player(
                         Number(connectedPlayers[key]["x"]),
                         Number(connectedPlayers[key]["y"]), 
                        this_ref.create_new_player( Number(connectedPlayers[key]["x"]),
                                                Number(connectedPlayers[key]["y"])),
                        connectedPlayers[key]["userID"]))
                    console.log(this_ref.players)
                }
                
            }
            // register others
            if(dataFromServer.hasOwnProperty("connected")){
                var connected_dictionary = dataFromServer["connected"];

                var newPlayer = this_ref.create_new_player(
                    Number(connected_dictionary["x"]),
                    Number(connected_dictionary["y"]))
                console.log(newPlayer)
                this_ref.players.push(
                    new Player(
                        Number(connected_dictionary["x"]),
                        Number(connected_dictionary["y"]),
                        newPlayer,
                        connected_dictionary["userID"])
                )
            }

            // register other people moves
            if(dataFromServer.hasOwnProperty("move")){
                var move_dictionary = dataFromServer["move"];
                var userID = move_dictionary["userID"];
                var x_coordinate = Number(move_dictionary["x"])
                var y_coordinate = Number(move_dictionary["y"])

                for (const key in this_ref.players){
                    if (this_ref.players[key].id == userID){
                        var player_to_move = this_ref.players[key];
                        var new_target = new Phaser.Math.Vector2();
                        new_target.x = x_coordinate;
                        new_target.y = y_coordinate;
                        this_ref.physics.moveToObject(player_to_move.body.gameObject, new_target, 200);
                        player_to_move.target_x = new_target.x;
                        player_to_move.target_y = new_target.y;
                    }
                }
            }
        }


        this.input.on('pointerdown', (pointer) =>
        {
            var closest_tile = this.calculate_closest_tile(pointer.x, pointer.y)

            if(closest_tile.walkable){

                var center_of_tile = new Phaser.Math.Vector2(closest_tile.x, closest_tile.y)

                this.target.x = center_of_tile.x;
                this.target.y = center_of_tile.y;
                // Move at 200 px/s:
                this.physics.moveToObject(player.gameObject, this.target, 200);

                client.send(`{"move":{
                    "userID" : "${MainPlayer.id}",
                    "x" : "${center_of_tile.x}",
                    "y" : "${center_of_tile.y}"
                }}`);
            }        
        });


        
    }


    update(time: number, delta: number): void {
        if(this.last_bullet_shot == null || this.last_bullet_shot == undefined){
            this.last_bullet_shot = time
        }

        if (key.isDown && time - this.last_bullet_shot > 100)
        {
            console.log("space is down")
            this.spawn_bullet(MainPlayer);
            this.last_bullet_shot = time;
        }
        //  4 is our distance tolerance, i.e. how close the source can get to the target
        //  before it is considered as being there. The faster it moves, the more tolerance is required.
        const tolerance = 35;

        // const tolerance = 200 * 1.5 / this.game.loop.targetFps;

        const distance = Phaser.Math.Distance.BetweenPoints(player, this.target);

        if(MainPlayer != undefined && MainPlayer.body != undefined && MainPlayer.body.speed > 0)
        {
            if (distance < tolerance)
            {
                player.reset(this.target.x, this.target.y);
            }
        }

        for(const key in this.players){
            if (this.players[key].target_x != undefined && this.players[key].target_y != undefined){
                var enemy_distance = Phaser.Math.Distance.BetweenPoints(this.players[key].body, new Phaser.Math.Vector2(this.players[key].target_x, this.players[key].target_y));
                if (enemy_distance < tolerance)
                {
                    this.players[key].body.reset(Number(this.players[key].target_x), Number(this.players[key].target_y));
                    this.players[key].target_x = undefined;
                    this.players[key].target_y = undefined;
                }
            }
        }
    }

    private spawn_bullet(player:Player){
        let playerPosition = player.body.position
        let mouse_X = game.input.mousePointer.x;
        let mouse_Y = game.input.mousePointer.y;
        var bullet_target = new Phaser.Math.Vector2(mouse_X, mouse_Y);
        
        let spawned_bullet = this.physics.add.sprite(playerPosition.x, playerPosition.y, 'bullet').body.setAllowGravity(false);
        this.physics.moveToObject(spawned_bullet.gameObject, bullet_target, 500);

        let game_bodies: Phaser.GameObjects.GameObject[] = [];
        for(const key in this.players){
            game_bodies.push(this.players[key].body.gameObject)
        }

        var this_ref = this
        this.physics.add.collider(spawned_bullet.gameObject, game_bodies, function (bullet, player: Phaser.GameObjects.GameObject){
            bullet.setActive(false)
            for(const key in this_ref.players){
                if(this_ref.players[key].body.gameObject === player)
                {
                    let hit_player = this_ref.players[key];
                    hit_player.HP -= 20;
                }
            
            }
        });
    }
    private create_new_player(x:number, y:number):  Phaser.Physics.Arcade.Body{
        return this.physics.add.sprite(x, y, 'dude').body.setAllowGravity(false)
    }

    private calculate_closest_tile(x, y): Tile{

        var x_index = Math.floor(x /  tileSize)
        var y_index = Math.floor(y / tileSize)

        var tile_index = y_index * tilesPerRow  + x_index
        var tile = this.tiles[tile_index]

        // console.log(x_index, y_index, tile_index)
        // console.log(tile.x, tile.y)
        //return new Phaser.Math.Vector2(tile.x, tile.y)
        return tile;
    }
    private tile_background(tileName: string, unwalkable_tile_name:string){
        
        var height = tileSize/2
        for (let i = 0; i < rows ; i++) {
            var width = tileSize/2
            for (let j = 0; j < tilesPerRow ; j++) {
                
                if (j % 4 == 0 && i % 2 == 0){
                    let tile = this.add.image(width, height, unwalkable_tile_name);
                    this.tiles.push(new Tile(width, height, tile, false));
                }
                else {
                    let tile = this.add.image(width, height, tileName);
                    this.tiles.push(new Tile(width, height, tile));
                }
                width += tileSize
            }
            height += tileSize
        }
    }
}