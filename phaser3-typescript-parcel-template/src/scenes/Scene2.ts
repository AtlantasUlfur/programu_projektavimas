import * as Phaser from 'phaser'
import Tile from '../classes/Tile'

var player: Phaser.Physics.Arcade.Body;
const canvasHeigth = 672;
const canvasWidth = 768;
const tileSize = 48;
const tilesPerRow = Math.ceil((canvasWidth - tileSize / 2) / tileSize)
const rows = Math.ceil((canvasHeigth - tileSize / 2)/ tileSize)

export default class TestScene extends Phaser.Scene
{
    private target;
    private tiles: Tile[] = [];
    constructor()
	{
		super('hello-world')
	}

	preload()
    {
        this.load.image('tile', 'images/tile.png')
        this.load.spritesheet('dude', 
        'images/dude.png',
        { frameWidth: 32, frameHeight: 48 }
    );
    }

    create(){
        this.tile_background('tile');
        // this.add.image(24,24, 'tile')
        player = this.physics.add.sprite(100, 450, 'dude').body.setAllowGravity(false)
        //player.body.setAllowGravity(false)
        this.target = new Phaser.Math.Vector2();

        this.input.on('pointerdown', (pointer) =>
        {
            var closest_tile = this.calculate_center_of_closest_tile(pointer.x, pointer.y)
            
            this.target.x = closest_tile.x;
            this.target.y = closest_tile.y;
            // Move at 200 px/s:
            this.physics.moveToObject(player.gameObject, this.target, 200);
        });
    }

    update(time: number, delta: number): void {

        //  4 is our distance tolerance, i.e. how close the source can get to the target
        //  before it is considered as being there. The faster it moves, the more tolerance is required.
        const tolerance = 35;

        // const tolerance = 200 * 1.5 / this.game.loop.targetFps;

        const distance = Phaser.Math.Distance.BetweenPoints(player, this.target);

        if (player.speed > 0)
        {
            if (distance < tolerance)
            {
                player.reset(this.target.x, this.target.y);
            }
        }
    }

    private calculate_center_of_closest_tile(x, y): Phaser.Math.Vector2{

        var x_index = Math.floor(x /  tileSize)
        var y_index = Math.floor(y / tileSize)

        var tile_index = y_index * tilesPerRow  + x_index
        var tile = this.tiles[tile_index]

        console.log(x_index, y_index, tile_index)
        console.log(tile.x, tile.y)
        return new Phaser.Math.Vector2(tile.x, tile.y)
    }
    private tile_background(tileName: string){
        
        var height = tileSize/2
        for (let i = 0; i < rows ; i++) {
            var width = tileSize/2
            for (let j = 0; j < tilesPerRow ; j++) {
                var tile = this.add.image(width, height, tileName);
                this.tiles.push(new Tile(width, height, tile));
                width += tileSize
            }
            height += tileSize
        }
    }
}